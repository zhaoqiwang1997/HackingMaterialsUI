from os import environ

import pytest

integrationtest = pytest.mark.skipif(
    "PYTEST_DISABLE_INTEGRATION_TESTS" in environ,
    reason="Integration tests are skipped in GitHub CI to avoid spinning up a Docker environment",
)
