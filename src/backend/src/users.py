"""CRUD functions for users
"""
import dataclasses
import json
import pickle
from dataclasses import dataclass

import pandas as pd

from .postg_db import MyDb, Tables
from .workflow_configurations import WorkflowConfigurations


@dataclass()
class User:
    email: str
    is_pro_user: bool = False
    auth_info: str = ""
    current_dataset: pd.DataFrame = pd.DataFrame()
    workflow: WorkflowConfigurations = WorkflowConfigurations()

    def as_db_repr(self):
        return {
            "email": self.email,
            "is_pro_user": self.is_pro_user,
            "auth_info": self.auth_info,
            "current_dataset": self.current_dataset,
            "workflow": self.workflow.to_json(),
        }

    def as_ui_repr(self):
        return {
            "email": self.email,
            "is_pro_user": self.is_pro_user,
            "auth_info": self.auth_info,
            "workflow": dataclasses.asdict(self.workflow),
        }


# TODO rewrite so all supplied data is a dataclass and not a dict
class Users:
    '''All functions needed for user dataclass database functions
    '''
    def __init__(self):
        self._db = None

    @property
    def db(self):
        if not self._db:
            self._db = MyDb()
        return self._db

    def create(self, data: dict) -> tuple:
        """Create a new user, ensure data contains info for all columns

        Args:
            data (dict): row data

        Returns:
            tuple(bool, str): status of create process
        """
        if type(data) == User:
            data = data.as_db_repr()
        if isinstance(data['current_dataset'], pd.DataFrame):
            data['current_dataset'] = pickle.dumps(data['current_dataset'])

        return self.db.createrow(Tables.UsersTbl, data)

    def read(self, user_id: str) -> tuple:
        """Read user data from database

        Args:
            user_id (str): email address

        Returns:
            tuple(bool, str): status of create process
        """
        success, data = self.db.readrow(Tables.UsersTbl, user_id)

        if success:
            if data['current_dataset']:
                data['current_dataset'] = pickle.loads(data['current_dataset'])
            data['workflow'] = WorkflowConfigurations.from_json(data['workflow'])

            return (success, data)
        return (False, "Could not find user")

    def update(self, data: dict) -> tuple:
        """Update existing user in database

        Args:
            data (dict): row data

        Returns:
            tuple(bool, str): status of update process
        """
        if type(data) == User:
            data = data.as_db_repr()
        if 'current_dataset' in data.keys() and isinstance(data['current_dataset'], pd.DataFrame):
            data['current_dataset'] = pickle.dumps(data['current_dataset'])
        return self.db.updaterow(Tables.UsersTbl, data)

    def delete(self, user_id: str) -> tuple:
        """Delete user from database

        Args:
            user_id (str): email

        Returns:
            tuple(bool, str): status of delete process
        """
        return self.db.deleterow(Tables.UsersTbl, user_id)

    def update_email(self, old_email: str, new_email: str) -> tuple:
        """Change user email address and cascade to other tables

        Args:
            old_email (str): old email
            new_email (str): new email

        Returns:
            tuple(bool, str): status of update process
        """
        new_email_exists, _ = self.read(new_email)
        if new_email_exists:
            return (False, "New email already exists")

        sql = (
            f"""UPDATE users set email='{new_email}' where"""
            + f""" email = '{old_email}';"""
        )
        res = self.db.raw_sql(sql, {})

        return res

    def add_test_data(self, test_email="test@test.com", workflow=None) -> tuple:
        """Add test data to users table

        Args:
            test_email (str, optional): email address. Defaults to "test@test.com".

        Returns:
            tuple(bool, str): status of create test data process
        """
        from matminer.datasets import load_dataset

        if not workflow:
            workflow = {"dataset": "elastic_tensor_2015",
                        "featurizer": "conversions.StrToComposition",
                        "column_to_featurize": "formula",
                        "ml_y_label": "K_VRH",
                        "split_ratio": 0.2,
                        "ml_algorithm": "lr",
                        "ml_model_db_id": "",
                        "plot_type": "bar",
                        }

        test_data = {
            "email": test_email,
            "is_pro_user": True,
            "auth_info": "",
            "current_dataset": load_dataset(workflow["dataset"]),
            "workflow": json.dumps(workflow),
        }

        self.delete(test_email)

        return self.create(test_data)