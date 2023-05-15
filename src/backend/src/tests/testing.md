## Pytest Overview
Ensure that pytest is installed - [instructions here](https://docs.pytest.org/en/7.1.x/getting-started.html)   
To test using the pytest library open a terminal in the parent folder (src) and 
run `pytest`. 

Pytest uses conventions for test discovery. Any python file in the tests folder with the `test*.py` will be executed. 

Within the `test*.py` files, any function names starting with `test_` will be run as tests. Sometimes it's better to group tests together in a test class.
Pytest recognize class names starting with `Test` as test classes. 

Below is a simple test class sample that also shows how to use pytest for checking expected exception.

```python
import pytest
class TestDivision:

    def test_happy_division(self):
        assert 4/2 == 2

    def test_division_by_zero_should_throw_exception(self):
        with pytest.raises(ZeroDivisionError):
            2/0
```

In order to maintain consistent and repeatable test environment, we can set up test fixture for our tests. 
Test fixtures can be applied to different scopes, the fixture would be destroyed by the end of the scope.

Here's an example of how pytest fixture can be used.
`autouse=True` will ensure this will be invoked automatically for each test.
```python
import pytest

@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    # Setup: things that need to happen before a test is run, for example: creating objects needed for the test

    yield # this is where the testing happens, if objects needed for the test are created, add them here as well

    # Teardown : things that need to happen after a test is run, typically cleaning up the things we did 
```
More details about the pytest style fixture set up can be found [here](https://docs.pytest.org/en/6.2.x/fixture.html).


If you are already familiar with the xunit-style type of set up, Pytest also allow [xunit-style fixture set up](https://docs.pytest.org/en/6.2.x/xunit_setup.html).