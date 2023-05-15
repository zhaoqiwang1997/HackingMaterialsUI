"""Save/Load workflow related data to db
"""
from typing import Tuple

from .users import Users
from .workflow_configurations import WorkflowConfigurations


def save_workflow(workflow: object, user_id: str) -> tuple:
    """Save a workflow object to database

    Args:
        workflow (object): workflow object
        user_id (str): email address

    Returns:
        tuple(bool, str): status of validation process
    """
    if isinstance(workflow, WorkflowConfigurations):
        workflow = workflow.to_json()

    data = {"email": user_id, "workflow": workflow}

    return Users().update(data)


def load_workflow(user_id: str) -> Tuple[bool, WorkflowConfigurations]:
    """Load workflow object from database

    Args:
        user_id (str): email address

    Returns:
        (found: bool, result: str): a boolean indicating whether the workflow was found, and either the workflow object as a JSON string, or an error message
    """
    success, data = Users().read(user_id)

    if success:
        return success, data["workflow"]

    return False, "Could not find workflow/user"


def save_featurized_data(user_id, featurized_data):
    data = {"email": user_id, "current_dataset": featurized_data}
    return Users().update(data)


def load_featurized_data(user_id):
    success, data = Users().read(user_id)

    if success:
        return success, data["current_dataset"]

    return False, "Could not find current_dataset/user"
