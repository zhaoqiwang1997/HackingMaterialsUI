import os
import traceback
from json import JSONDecodeError
from logging import error, warning, debug

from celery import Celery
from celery.exceptions import SoftTimeLimitExceeded
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from google.auth.transport import requests
from google.oauth2 import id_token
from sklearn.exceptions import NotFittedError
import jwt

from .datasets import datasets_map, retrieve_data_columns, retrieve_dataset
from .featurize_column import FeaturizerJob
from .featurizers import featurizer_map
from .ml import ML
from .plot_results import plot_results
from .task_updates import get_status, record_error, initialise_task, save_result
from .users import User, Users
from .workflow_data_handler import load_workflow, save_workflow, load_featurized_data
from datetime import datetime as dt

from sklearn.exceptions import NotFittedError
import pandas as pd

SESSION_USER_EMAIL_KEY = "user_email"
load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:*", "http://127.0.0.1:*"])

celery = Celery(
    "tasks",
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_BACKEND_URL"),
)
celery.conf.update(app.config)

GOOGLE_CLIENT_ID = os.environ["REACT_APP_GOOGLE_CLIENT_ID"]
app.config["SECRET_KEY"] = os.environ["FLASK_SECRET"]

MASL_CLIENT_ID = os.environ["REACT_APP_MSAL_CLIENT_ID"]

USERS = Users()


@app.route("/api/")
def home():
    return "Flask!"


@app.route("/api/featurizers", methods=["GET"])
def featurizers():
    response = jsonify({k: v.ui_repr() for (k, v) in featurizer_map().items()})

    return response


@app.route("/api/datasets", methods=["GET"])
def datasets():
    return jsonify(datasets_map())


@app.route("/api/datasets/select", methods=["POST"])
def dataset_selection():
    try:
        selectedValue = request.get_json()
        dataset = selectedValue["dataset"]
    except JSONDecodeError as e:
        error(e)
        return "Expected a JSON object", 400
    except KeyError as e:
        error(e)
        return "JSON object missing expected field 'dataset'", 400
    # this has to be updated once session implementation is in place

    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401

    success, data = Users().read(user_id)

    user = User(**data)

    user.workflow.dataset = dataset
    # Reset the current dataframe -
    # Otherwise, the current dataframe and the selected dataset won't match,
    # which may produce unexpected results elsewhere.
    user.current_dataset = pd.DataFrame()
    Users().update(user)
    data_columns = retrieve_data_columns(dataset)
    return jsonify(data_columns)


@app.route("/api/dataset-info", methods=["POST"])
def dataset_info():
    try:
        selection_data = request.get_json()
        dataset_name = selection_data["dataset"]
    except KeyError as e:
        error(e)
        return jsonify("KeyError, make sure dataset is provided"), 400
    data_columns = retrieve_data_columns(dataset_name)
    return jsonify(data_columns)


@app.route("/api/datasets/column/select", methods=["POST"])
def dataset_column_selection():
    try:
        selection_data = request.get_json()
        column_id = selection_data["column_to_featurize"]
    except JSONDecodeError as e:
        error(e)
        return "Expected a JSON value", 400
    except KeyError as e:
        error(e)
        return (
            jsonify(
                "KeyError, make sure all required data are provided with the correct key"
            ),
            400,
        )

    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )
    workflow.column_to_featurize = column_id
    save_workflow(workflow.to_json(), user_id)

    return jsonify(column_id), 200


@app.route("/api/login", methods=["POST"])
def login():
    login_info = request.get_json()
    token_id = login_info["token_id"]
    pro_user = login_info["pro_user"]
    auth_provider = login_info["auth_provider"]

    url = "https://login.microsoftonline.com/common/discovery/v2.0/keys"

    email = ""

    if auth_provider == "Msal":
        jwks_client = jwt.PyJWKClient(url)
        signing_key = jwks_client.get_signing_key_from_jwt(token_id)
        decoded_token = jwt.decode(
            token_id,
            key=signing_key.key,
            algorithms=["RS256"],
            options={"verify_exp": False},
            audience=MASL_CLIENT_ID,
        )
        print(decoded_token)
        email = decoded_token["email"]

        if not email.endswith(".unimelb.edu.au"):
            return (
                jsonify(error="Account must be under the .unimelb.edu.au subdomain"),
                401,
            )

    elif auth_provider == "google":
        try:
            idinfo = id_token.verify_oauth2_token(
                token_id, requests.Request(), GOOGLE_CLIENT_ID
            )
        except ValueError as er:
            error(er)
            return jsonify(error="Couldn't validate identity token"), 401

        if not idinfo["hd"].endswith(".unimelb.edu.au"):
            return (
                jsonify(error="Account must be under the .unimelb.edu.au subdomain"),
                401,
            )
        email = idinfo["email"]

    if not email:
        return (jsonify(error="Email not set - authentication failed"), 401)

    found, message = USERS.read(email)

    if found:
        user = User(**message)
    else:
        warning("User did not exist, creating")
        user = User(
            email=email,
            is_pro_user=bool(pro_user),
            # all other fields default
        )
        USERS.create(user)

    session[SESSION_USER_EMAIL_KEY] = user.email
    return jsonify(user.as_ui_repr())


@app.route("/api/featurizers/info/<featurizer_id>")
def featurizer_info(featurizer_id):
    def error_handler(err, error_message):
        error(err)
        error(error_message)
        return jsonify(
            {
                "error": error_message,
                "citations": "",
                "implementors": "",
                "help_text": featurizer_info.help_html(),
                "feature_labels": "",
            }
        )

    try:
        featurizer_info = featurizer_map()[featurizer_id]
    except KeyError as err:
        error(err)
        return "Unknown featurizer", 400

    try:
        featurizer = featurizer_info.klass()
    except TypeError as err:
        return error_handler(
            err,
            f"Failed to instantiate featurizer class {featurizer_info.klass.__name__} - it probably needs extra arguments, and we don't support those yet",
        )
    except RuntimeError as err:
        return error_handler(
            err,
            f"Failed to instantiate featurizer class {featurizer_info.klass.__name__} with default arguments",
        )

    if type(featurizer) is None:
        return error_handler(
            ValueError,
            f"Featurizer constructor succeeded, but returned None instead of a valid instance",
        )

    try:
        return jsonify(
            {
                "error": None,
                "citations": featurizer.citations(),
                "implementors": featurizer.implementors(),
                "help_text": featurizer_info.help_html(),
                "feature_labels": featurizer.feature_labels(),
            }
        )
    except AttributeError as err:
        return error_handler(
            err,
            f"Featurizer constructor succeeded, but the featurizer didn't correctly implement a required method",
        )
    except NotImplementedError as err:
        return error_handler(
            err,
            f"Featurizer {featurizer_info.klass.__name__} constructed, but the resulting object didn't implement a required method",
        )
    except (NotFittedError) as err:
        return error_handler(
            err,
            f"Failed to instantiate featurizer class {featurizer_info.klass.__name__} - it probably needs extra arguments, and we don't support those yet",
        )
    except Exception as err:
        if err.args == ("You must run 'fit' first!",):
            return error_handler(
                err,
                f"Failed to instantiate featurizer class {featurizer_info.klass.__name__} - it probably needs extra arguments, and we don't support those yet",
            )
        else:
            raise err


@app.route("/api/featurizers/select", methods=["POST"])
def select_featurizer():
    # this can be tested in combination with the /db_create_test_data endpoint
    selection_data = request.get_json()
    try:
        featurizer = selection_data["featurizer"]
    except JSONDecodeError as e:
        error(e)
        return "Expected a JSON value", 400
    except KeyError as e:
        error(e)
        return (
            jsonify(
                "KeyError, make sure all required data are provided with the correct key"
            ),
            400,
        )

    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401

    featurizer_identify = featurizer_map()[featurizer]
    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )
    workflow.featurizer = featurizer
    save_workflow(workflow.to_json(), user_id)
    return jsonify(featurizer_identify.name), 200


@app.route("/api/models/select", methods=["POST"])
def model_select():
    try:
        selectedValue = request.get_json()
        model = selectedValue["model"]
    except JSONDecodeError as e:
        error(e)
        return "Expected a JSON object", 400
    except KeyError as e:
        error(e)
        return "JSON object missing expected field 'model'", 400
    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )
    workflow.ml_algorithm = model
    save_workflow(workflow.to_json(), user_id)
    return jsonify(model), 200


@app.get("/api/task_status/<task_id>")
def task_status(task_id):
    """Frontend can poll this endpoint to get task status and can then update the UI accordingly"""
    result, status = get_status(task_id)
    if not result:
        return jsonify(status), 404
    if status == "complete":
        return jsonify(status), 200
    return jsonify(status), 202


@app.get("/api/kill_task/<task_id>")
def kill_task(task_id):
    celery.control.revoke(task_id, terminate=True)

    response = jsonify("Task killed")

    return response, 200


@app.get("/api/task_info/<task_id>")
def task_info(task_id):
    task_result = celery.AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": str(task_result.result),
    }

    return jsonify(result), 200


@app.get("/api/running_tasks")
def running_tasks():
    # get a list of running tasks
    active_tasks_by_host = celery.control.inspect().active()
    results = {}
    for host_tasklist in active_tasks_by_host.values():
        for task_info in host_tasklist:
            task_id = task_info["id"]
            task_result = celery.AsyncResult(task_id)
            result = {
                "task_id": task_id,
                "task_status": task_result.status,
                "task_result": task_result.result,
            }
            results[task_id] = result

    return jsonify(results), 200


@app.route("/api/getFeatures", methods=["GET"])
def get_feature():
    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as e:
        error(e)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )

    data_columns = retrieve_data_columns(workflow.dataset)
    response = jsonify(data_columns)
    return response


@app.route("/api/selectXAxis", methods=["POST"])
def xaxis_select():
    try:
        selectedValue = request.get_json()
        x_feature = selectedValue["xAxis"]
    except Exception:
        return "Failed", 500

    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as e:
        error(e)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )

    workflow.Xaxis = x_feature
    save_workflow(workflow.to_json(), user_id)
    return jsonify(x_feature), 200


@app.route("/api/selectYAxis", methods=["POST"])
def yaxis_select():
    try:
        selectedValue = request.get_json()
        y_feature = selectedValue["yAxis"]
    except Exception:
        return "Failed", 500

    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as e:
        error(e)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )

    workflow.Yaxis = y_feature
    save_workflow(workflow.to_json(), user_id)
    return jsonify(y_feature), 200


@app.route("/api/selectPredictingColumn", methods=["POST"])
def predicting_feature_select():
    try:
        selectedValue = request.get_json()
        predicting_column = selectedValue["predictingColumn"]
    except Exception:
        return "Failed", 500

    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as e:
        error(e)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )

    workflow.ml_y_label = predicting_column
    save_workflow(workflow.to_json(), user_id)
    return jsonify(predicting_column), 200


@app.get("/api/featurize_column")
def featurize_column():
    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401

    task = featurize_celery.delay(user_id)
    initialise_task(user_id, task.id)
    response = jsonify({"task_id": task.id}), 202

    # TODO
    import time

    time.sleep(4)
    save_result(user_id, dict(), timestamp=dt.now())

    return response


@celery.task(name="Featurize", soft_time_limit=60 * 60, hard_time_limit=60 * 61)
def featurize_celery(user_id):
    try:
        celery_featurize = FeaturizerJob(featurize_celery.request.id, user_id)
        result = celery_featurize.featurize()

        return result, 200

    except SoftTimeLimitExceeded:
        # record soft time limit error to database log
        record_error(user_id, "Max running time exceeded")

        return "Time limit exceeded!", 400

    except Exception:
        # record runtime error to database log
        err_msg = "Error:\n" + str(traceback.format_exc())
        record_error(user_id, err_msg)

        return f"Runtime Error: {err_msg}", 500


@app.route("/api/models/execute")
def execute_model():
    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401

    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )
    model = workflow.ml_algorithm
    task = create_model_celery.delay(user_id, model)
    initialise_task(user_id, task.id)

    return jsonify({"task_id": task.id}), 202


@celery.task(name="Create Model", soft_time_limit=60 * 60, hard_time_limit=60 * 61)
def create_model_celery(user_id, model):
    try:
        celery_ml = ML(create_model_celery.request.id, user_id, model)
        result = celery_ml.create_model()

        return result, 200

    except SoftTimeLimitExceeded:
        # record soft time limit error to database log
        record_error(user_id, "Max running time exceeded")

        return "Time limit exceeded!", 400

    except Exception:
        # record runtime error to database log
        err_msg = "Error:\n" + str(traceback.format_exc())
        record_error(user_id, err_msg)

        return f"Runtime Error: {err_msg}", 500


@app.route("/api/models/result", methods=["GET"])
def model_result():
    try:
        user_id = session[SESSION_USER_EMAIL_KEY]
    except KeyError as err:
        error(err)
        return "Unauthorized", 401
    found, workflow = load_workflow(user_id)
    if not found:
        return (
            jsonify(
                "Internal server error: no workflow found, but all users should have an associated workflow"
            ),
            500,
        )
    try:
        xAxis = workflow.Xaxis
        yAxis = workflow.Yaxis
    except Exception as e:
        error(e)
        return "Missing xAxis or yAxis data!", 400
    dataset = load_featurized_data(user_id)
    res = plot_results.plot_results(dataset, xAxis, yAxis)
    model_res_dict = {"xAxis": xAxis, "yAxis": yAxis, "result": res}
    debug(model_res_dict)

    return jsonify(model_res_dict), 200
