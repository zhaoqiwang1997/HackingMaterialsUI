import dataclasses
import json

from ..users import Users
from ..workflow_configurations import WorkflowConfigurations
from ..workflow_data_handler import load_workflow
from .utils import integrationtest


def test_workflow_export_correct_json():
    wf = WorkflowConfigurations("feat", "data", "col", "nn", "id", "ylab", 0.2, "bar", "", "")
    json_string = wf.to_json()
    json_dct = json.loads(json_string)
    assert json_dct["dataset"] == "data"
    assert json_dct["featurizer"] == "feat"
    assert json_dct["column_to_featurize"] == "col"
    assert json_dct["ml_y_label"] == "ylab"
    assert json_dct["split_ratio"] == 0.2
    assert json_dct["ml_algorithm"] == "nn"
    assert json_dct["ml_model_db_id"] == "id"
    assert json_dct["plot_type"] == "bar"
    assert json_dct["Xaxis"] == ""
    assert json_dct["Yaxis"] == ""


def test_workflow_loads_json_to_object():
    json_string = """
    {
        "featurizer": "feat",
    	"dataset": "data",
    	"column_to_featurize": "col",
        "ml_algorithm": "nn",
        "ml_model_db_id": "id",
    	"ml_y_label": "ylab",
    	"split_ratio": 0.2,
    	"plot_type": "bar",
        "Xaxis": "",
        "Yaxis": ""
    }
    """
    json.loads(json_string)

    wf = WorkflowConfigurations.from_json(json_string)
    assert wf.dataset == "data"
    assert wf.featurizer == "feat"
    assert wf.column_to_featurize == "col"
    assert wf.ml_y_label == "ylab"
    assert wf.split_ratio == 0.2
    assert wf.ml_algorithm == "nn"
    assert wf.ml_model_db_id  == "id"
    assert wf.plot_type == "bar"
    assert wf.Xaxis == ""
    assert wf.Yaxis == ""


@integrationtest
def test_load_workflow_ok():
    sample_workflow = {
        "featurizer": "conversions.StrToComposition",
        "dataset": "elastic_tensor_2015",
        "column_to_featurize": "formula",
        "ml_algorithm": "lr",
        "ml_model_db_id": "",
        "ml_y_label": "K_VRH",
        "split_ratio": 0.2,
        "plot_type": "bar",
        "Xaxis": "",
        "Yaxis": ""
    }
    Users().add_test_data()
    found, workflow = load_workflow("test@test.com")
    assert found


@integrationtest
def test_load_workflow_not_found():
    Users().add_test_data()
    found, workflow = load_workflow("notarealuser")
    assert not found
