"""Running `pytest` in the parent (src) folder will execute tests below
"""
import pandas as pd
import pytest

from .. import workflow_data_handler
from ..users import Users
from ..workflow_configurations import WorkflowConfigurations
from .utils import integrationtest


@pytest.fixture(autouse=True)
def create_temp_user():
    email = "test_workflow@test.com"
    users = Users()

    # BEFORE TEST: create temp user
    users.add_test_data(email)
    yield email
    # AFTER TEST: cleanup afterwards inc on failure
    users.delete(email)


@integrationtest
def test_read_workflow(create_temp_user: str):
    assert workflow_data_handler.load_workflow(create_temp_user)[0]


@integrationtest
def test_save_workflow(create_temp_user: str):
    workflow_data = WorkflowConfigurations()
    workflow_data = workflow_data.to_json()
    assert workflow_data_handler.save_workflow(workflow_data, create_temp_user)[0]


@integrationtest
def test_load_featurized_data(create_temp_user: str):
    assert workflow_data_handler.load_featurized_data(create_temp_user)[0]


@integrationtest
def test_save_featurized_data(create_temp_user: str):
    featurized_data = pd.DataFrame()
    assert workflow_data_handler.save_featurized_data(create_temp_user, featurized_data)[0]


@integrationtest
def test_update_workflow(create_temp_user: str):
    my_read_workflow = workflow_data_handler.load_workflow(create_temp_user)[1]
    my_new_workflow = WorkflowConfigurations()
    my_new_workflow.featurizer = "featureizer_dummy"
    my_new_workflow = my_new_workflow.to_json()

    assert my_read_workflow != my_new_workflow
    workflow_data_handler.save_workflow(my_new_workflow, create_temp_user)
    my_read_workflow = workflow_data_handler.load_workflow(create_temp_user)[0]

    # ensure workflow has been updated
    assert my_read_workflow != my_new_workflow
