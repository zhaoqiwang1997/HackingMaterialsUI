"""CRUD functions for database methods on models
"""
import pickle
from dataclasses import asdict, dataclass, field
from datetime import datetime as dt
from uuid import uuid4

from sqlalchemy import TIMESTAMP, String

from .postg_db import MyDb, Tables


@dataclass
class Model:
    id: String = field(default_factory=lambda: str(uuid4()))
    timestamp: TIMESTAMP = None
    model: bytes = pickle.dumps("")
    params_and_data: str = ""
    email: str = ""

    def as_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "model": self.model,
            "params_and_data": self.params_and_data,
            "email": self.email
        }


class MLModels:
    def __init__(self):
        self._db = None

    @property
    def db(self):
        if not self._db:
            self._db = MyDb()
        return self._db

    # TODO for all data wrap it in a dataclass and only use that as an input
    # TODO remove all dicts as inputs
    def create(self, data: dict|Model) -> tuple:
        """Create a new model, ensure data contains info for all columns

        Args:
            data (dict): row data

        Returns:
            tuple(bool, str): status of create process
        """
        if type(data) == Model:
            data = asdict(data)

        data["model"] = pickle.dumps(data["model"])
        data["timestamp"] = dt.now()

        return self.db.createrow(Tables.ModelTbl, data)

    def read(self, timestamp: TIMESTAMP) -> tuple:
        """Read model data from database

        Args:
            model_id (str): email address

        Returns:
            tuple(bool, str): status of create process
        """
        success, data = self.db.readrow(Tables.ModelTbl, timestamp)

        if success:
            data["model"] = pickle.loads(data["model"])
            return success, data

        return (False, "Could not find model")

    def update(self, data: dict|Model) -> tuple:
        """Update existing model in database

        Args:
            data (dict): row data

        Returns:
            tuple(bool, str): status of update process
        """
        if type(data) == Model:
            data = data.as_dict()

        if "model" in data.keys():
            data["model"] = pickle.dumps(data["model"])

        return self.db.updaterow(Tables.ModelTbl, data)

    def delete(self, model_id: int) -> tuple:
        """Delete model from database

        Args:
            model_id (str): email

        Returns:
            tuple(bool, str): status of delete process
        """
        return self.db.deleterow(Tables.ModelTbl, model_id)
