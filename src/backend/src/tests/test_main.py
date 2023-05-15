from json import dumps, loads

import pytest

from ..featurizers import FeaturizerIdentity, featurizer_map
from ..main import USERS, app
from .utils import integrationtest

# Refer to https://flask.palletsprojects.com/en/2.2.x/testing/
# for resources on how to unit test Flask applications


@pytest.fixture
def client():
    client = app.test_client()
    yield client


def test_featurizer_info_ok(client):
    from matminer.featurizers.composition.packing import AtomicPackingEfficiency

    info = loads(
        client.get(
            "/api/featurizers/info/composition.packing.AtomicPackingEfficiency",
        ).data
    )
    fi = FeaturizerIdentity(
        path=["composition", "packing"],
        name="AtomicPackingEfficiency",
        klass=AtomicPackingEfficiency,
    )
    f = AtomicPackingEfficiency()
    assert info["citations"] == f.citations()
    assert info["help_text"] == fi.help_html()
    assert info["feature_labels"] == f.feature_labels()


@pytest.mark.parametrize("featurizer", featurizer_map().keys())
def test_featurizer_info_ok_all(client, featurizer):
    response = client.get(
        f"/api/featurizers/info/{featurizer}",
    )
    assert response.status_code == 200


def test_featurizer_info_unknown_featurizer_error(client):
    response = client.get("/api/featurizers/info/Not%20a%20real%20featurizer")
    assert response.status_code == 400
    response = client.get("/api/featurizers/info/this one contains spaces")
    assert response.status_code == 400
    response = client.get("/api/featurizers/info/this/one/has/extra/path/components")
    assert response.status_code == 404


@integrationtest
def test_dataset_selection_ok(client):
    with client.session_transaction() as session:
        session["user_email"] = "test@test.com"
    response = client.post(
        "/api/datasets/select",
        data=dumps({"dataset": "boltztrap_mp"}),
        headers={"Content-Type": "application/json"},
    )
    assert response.status_code == 200
    assert loads(response.data) == [
        "formula",
        "m_n",
        "m_p",
        "mpid",
        "pf_n",
        "pf_p",
        "s_n",
        "s_p",
        "structure",
    ]
