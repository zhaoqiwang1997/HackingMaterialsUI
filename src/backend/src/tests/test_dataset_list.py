from ..datasets import datasets_map


def test_dataset_expected_return():
    test = datasets_map()
    assert type(test) == dict
    assert len(test) != 0

    for (hash_val, dataset) in test.items():
        assert type(hash_val) == str
        assert len(dataset) == 2

    for func, name in test.values():
        assert func, name == {"function", "name"}

    for hash_key, dataset_val in test.items():
        func, name = dataset_val.values()
        assert hash_key == func
