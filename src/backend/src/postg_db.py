"""Some basic tools to interact with postgress database
"""
import datetime as dt
import os
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy import (JSON, Boolean, Column, DateTime, ForeignKey,
                        LargeBinary, MetaData, String, Table, Text,
                        create_engine, delete, insert, select, update)
from sqlalchemy.orm import registry, relationship
from sqlalchemy.sql import text
from sqlalchemy_utils import database_exists

load_dotenv()

mapper_registry = registry()
STR_CONN = os.getenv("STR_CONN")

if STR_CONN:
    engine = create_engine(STR_CONN)
else:
    # TODO must be a better way to do this. Needed so Github tests don't fail
    # engine is never used in these tests but need to have some definition at least
    engine = create_engine("postgresql://@localhost:5432/ha_db")

metadata = MetaData(engine)


class MyDb:
    """Tools to access/retrieve data from postgres database"""

    def __init__(self) -> None:
        """create blank tables if they do not exist"""
        assert database_exists(STR_CONN), "Ensure database is running!"

        metadata.create_all(engine)

    def createrow(self, table: Table, data: dict) -> tuple:
        """Append Row to a table in the database

        Args:
            table (Table): Table Dataclass
            data (dict): dict of values where keys=table column headers

        Returns:
            tuple(bool, str): status of append process
        """

        if self.readrow(table, data[table.lookupkey])[0]:
            return (
                False,
                "Row with this primary key already exists",
                data[table.lookupkey],
                table.lookupkey,
            )

        stmt = insert(table).values(data)
        with engine.connect() as conn:
            conn.execute(stmt)

        return (True, "success")

    def readrow(self, table: Table, lookupkey: str) -> tuple:
        """Read row from specific table by single lookup key

        Args:
            table (Table): Table Dataclass
            lookupkey (str): Primary key value

        Returns:
            tuple(bool, dict): (status of read process, data|empty if lookup
                               key doesn't exist)
        """

        sql = select(table.__table__).where(table.lookupcolumn == lookupkey)

        with engine.connect() as conn:
            dbdata = conn.execute(sql).all()

        if dbdata:
            return (True, dict(dbdata[0]))

        return (False, {})

    def updaterow(self, table: Table, data: dict) -> tuple:
        """Append Row to a table in the database

        Args:
            table (Table): Table Dataclass
            data (dict): dict of values where keys=table column headers

        Returns:
            tuple(bool, str): status of update process
        """

        update_data = data.copy()
        stmt = (
            update(table)
            .where(table.lookupcolumn == update_data.pop(table.lookupkey))
            .values(update_data)
        )
        with engine.connect() as conn:
            res = conn.execute(stmt)

        if res.rowcount == 0:
            return (False, "User not found")

        return (True, "Success")

    def deleterow(self, table: Table, lookupkey: str) -> tuple:
        """Delete row from specific table by single lookup key

        Args:
            table (Table): Table Dataclass
            lookupkey (str): Primary key value

        Returns:
            tuple(bool, str): status of delete process
        """

        if self.readrow(table, lookupkey)[0]:
            sql = delete(table.__table__).where(table.lookupcolumn == lookupkey)

            with engine.connect() as conn:
                conn.execute(sql)

            return (True, "Success")

        else:
            return (False, "Row does not exist")

    def raw_sql(self, sql_txt: str, data: dict = {}) -> tuple:
        """Execute text SQL commands

        Args:
            sql_txt (str): SQL statement eg `SELECT * FROM ...`
            data (dict, optional): payload data from sql. Defaults to {}.

        Returns:
            tuple(bool, str): status of SQL execution
        """
        with engine.connect() as con:

            statement = text(sql_txt)
            res = con.execute(statement, **data)

        if res.rowcount > 0:
            if res.returns_rows:
                return (True, [x._mapping for x in res])
            else:
                return (True, f"{res.rowcount} row/s affected. No data returned")

        else:
            return (False, "SQL statement did not affect any data")


class Tables:
    """Define all tables in the postgress database here. Blank tables will be
    created if they do not exist when the MyDb() class loads
    """

    @mapper_registry.mapped
    @dataclass
    class MatminerDatasetsTbl:
        """Table to store downloaded material datasets"""

        lookupkey: str = "email"
        datasets_name: str = ""
        pickled_table: bytes = b""
        serialised_table: str = ""

        __table__ = Table(
            "matminer_datasets",
            metadata,
            Column(lookupkey, Text, primary_key=True),
            Column("pickled_table", LargeBinary),
            Column("serialised_table", Text),
        )

        lookupcolumn: Column = __table__.columns[lookupkey]

    @mapper_registry.mapped
    @dataclass
    class UsersTbl:
        """Temporary place holder for logged in users details, final structure
        will depend on details returned from SSO login process
        """

        lookupkey: str = "email"

        # TODO add nullable=False to all columns after development
        __table__ = Table(
            "users",
            metadata,
            Column(lookupkey, String, primary_key=True),
            Column("auth_info", JSON),
            Column("workflow", JSON),
            Column("current_dataset", LargeBinary),
            Column("is_pro_user", Boolean),
        )

        email: str = ""
        auth_info: JSON = ""
        workflow: JSON = ""
        current_dataset: bytes = b""
        is_pro_user: bool = False
        lookupcolumn: Column = __table__.columns[lookupkey]

    @mapper_registry.mapped
    @dataclass
    class TaskTbl:
        """Running task details and history will be stored here"""

        lookupkey: str = "email"

        __table__ = Table(
            "running_tasks",
            metadata,
            Column(
                lookupkey,
                String,
                ForeignKey(
                    "users.email", ondelete="cascade", onupdate="cascade"
                ),
                primary_key=True,
            ),
            Column("status", JSON),
            Column("task_id", String),
            Column("start_time", DateTime),
            Column("finish_time", DateTime),
            Column("last_update", DateTime),
            Column("result_location", JSON),
        )

        email: str = ""
        status: JSON = None
        task_id: Optional[str] = None
        start_time: Optional[dt.datetime] = None
        finish_time: Optional[dt.datetime] = None
        last_update: Optional[dt.datetime] = None
        result_location: Optional[JSON] = None

        lookupcolumn: Column = __table__.columns[lookupkey]

        # back_populates="running_tasks" ensures that changes to email in user table will
        # back populate to running_tasks table. Deleting a user will also delete any related
        # entries in the running_tasks table
        running_tasks = relationship(
            "running_tasks",
            back_populates="users",
            cascade="all, delete",
            passive_deletes=True,
            passive_updates=True,
        )

    @mapper_registry.mapped
    @dataclass
    class LogTbl:
        """Keep a log of errors for debugging purposes"""

        lookupkey: String = "timestamp"

        __table__ = Table(
            "error_log",
            metadata,
            Column(lookupkey, DateTime, primary_key=True),
            Column("email", String),
            Column("tag", String),
            Column("error_msg", JSON),
        )

        timestamp: Optional[dt.datetime] = None
        email: str = ""
        tag: Optional[str] = None
        error_msg: JSON = None

        lookupcolumn: Column = __table__.columns[lookupkey]

    @mapper_registry.mapped
    @dataclass
    class ModelTbl:
        """Temporary place holder for models, final structure
        might change based on the demands of machine learning module developers
        """

        lookupkey: String = "id"

        __table__ = Table(
            "models",
            metadata,
            Column(
                "id",
                String,
                primary_key=True,
            ),
            Column("timestamp", DateTime),
            Column("model", LargeBinary),
            Column("params_and_data", JSON),
            Column("email", String),
        )

        id: String = ""
        timestamp: Optional[dt.datetime] = None
        model: LargeBinary = None
        params_and_data: JSON = None
        email: str = ""
        lookupcolumn: Column = __table__.columns[lookupkey]

        # back_populates="models" ensures that changes to email in user table will
        # back populate to models table. Deleting a user will also delete any related
        # entries in the models table
