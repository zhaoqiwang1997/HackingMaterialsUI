"""Running `pytest` in the parent (src) folder will execute tests below
"""
import pytest

from ..users import Users
from ..workflow_configurations import WorkflowConfigurations
from .utils import integrationtest


class DbInit:
    """Initialise database class"""

    def __init__(self) -> None:
        self.db = Users()

        self.data = {
            "email": "testingusers@blah.com",
            "is_pro_user": False,
            "auth_info": "is auth",
            "current_dataset": b"",
            "workflow": WorkflowConfigurations().to_json(),
        }


@pytest.fixture(autouse=True)
def mydb():
    """Initialise db and add dummy data

    Returns:
        DbInit: MyDb with dummy data
    """
    dbinit = DbInit()

    # BEFORE TEST: Delete dummy data if it exists
    dbinit.db.delete(dbinit.data["email"])

    yield dbinit
    # AFTER TEST: cleanup afterwards inc on failure
    dbinit.db.delete(dbinit.data["email"])


@integrationtest
def test_simple_append(mydb: DbInit):
    """Simple test to test adding a row"""
    assert mydb.db.create(mydb.data)[0]


@integrationtest
def test_simple_read(mydb: DbInit):
    """Simple test to read from db"""
    assert mydb.db.create(mydb.data)[0]
    assert mydb.db.read(mydb.data["email"])[0]


@integrationtest
def test_simple_update(mydb: DbInit):
    """simpletest to test update"""
    new_data = mydb.data.copy()
    new_data["is_pro_user"] = True

    # try to update a non existant user
    assert not mydb.db.update(mydb.data)[0]
    # create a new user
    assert mydb.db.create(mydb.data)[0]
    # update that user
    assert mydb.db.update(mydb.data)[0]


@integrationtest
def test_simple_blocked_overwrite(mydb: DbInit):
    """test to test if overwriting a row is blocked by default"""
    assert mydb.db.create(mydb.data)[0]
    assert not mydb.db.create(mydb.data)[0]

