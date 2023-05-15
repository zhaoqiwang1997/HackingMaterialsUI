'''A Comprehensive test for ml and featurizers. Designed to have the output
    manually reviewed.
'''
import json
from pathlib import Path

import numpy as np
from matminer.datasets import load_dataset

from ..featurize_column import FeaturizerJob
from ..ml import ML
from ..users import Users
from ..workflow_data_handler import load_workflow, save_workflow

users = Users()
mydir = Path(__file__).parent.resolve()


def create_test_users():
    with open(mydir / 'test_data.json') as f:
        test_data = json.load(f)

    for dataset_name in test_data.keys():
        test_email = dataset_name

        # TODO this may be irrelevant after PR#110
        dataset = load_dataset(dataset_name).head(20).copy()

        # select the column with the largest variance
        ml_y_label = dataset.select_dtypes(include=np.number).var().idxmax()
        workflow_template = {
            "dataset": dataset_name,
            "featurizer": "",
            "column_to_featurize": "",
            "ml_y_label": ml_y_label,
            "split_ratio": 0.2,
            "ml_algorithm": "lr",
            "ml_model_db_id": "",
            "plot_type": "bar",
        }

        test_data = {
            "email": test_email,
            "is_pro_user": True,
            "auth_info": "",
            "current_dataset": dataset,
            "workflow": json.dumps(workflow_template),
        }

        users.delete(test_email)
        users.create(test_data)


def delete_test_users():
    with open(mydir / 'test_data.json') as f:
        test_data = json.load(f)

    for dataset_name in test_data.keys():
        test_email = dataset_name

        users.delete(test_email)


def test_featurization(max_tests_per_dataset: int = 3):
    with open(mydir / 'test_data.json') as f:
        test_data = json.load(f)

    for dataset_name in test_data.keys():
        i = 0
        email = dataset_name

        for featurizer, col in test_data[dataset_name]['featurizers'].items():
            _, workflow = load_workflow(email)
            workflow.featurizer = featurizer
            workflow.column_to_featurize = col[0]
            save_workflow(workflow.to_json(), email)

            celery_featurize = FeaturizerJob(f"{dataset_name} - {featurizer}", email, )
            result = celery_featurize.featurize()

            if result == "Featurized Column Created":
                print(f"{dataset_name} - {featurizer}")
            else:
                print(f"ERROR - {result}")

            i += 1
            if i > max_tests_per_dataset:
                break


def test_ml():
    with open(mydir / 'test_data.json') as f:
        test_data = json.load(f)

    for dataset_name in test_data.keys():
        celery_ml = ML(dataset_name, dataset_name, "lr")
        result = celery_ml.create_model()
        print(result)


create_test_users()
test_featurization()
test_ml()
delete_test_users()
