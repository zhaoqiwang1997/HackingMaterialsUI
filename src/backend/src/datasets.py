from functools import lru_cache

import matminer
import matminer.datasets
from matminer.datasets import load_dataset


@lru_cache
def datasets_map():
    """Extracting the list of datasets available through matminer to display for selection

    Returns:
        dictonary using the hashed value as the key and the function name and UI name as the values.
    """
    datasets = matminer.datasets.dataset_retrieval.get_available_datasets(
        print_format=None
    )
    dataset_names = [x.replace("_", " ").title() for x in datasets]

    final_results = {}
    for func_name, dataset_name in zip(datasets, dataset_names):
        final_results[func_name] = {"function": func_name, "name": dataset_name}
    return final_results


def retrieve_data_columns(dataset_name):
    """Returns the dataframe containing the specified dataset

    Args:
        name: name of the selected dataset
    Returns:
        list of columns names for the selected dataset
    """
    return matminer.datasets.dataset_retrieval.get_dataset_columns(dataset_name)


def retrieve_dataset(name):
    """Returns the dataframe containing the specified dataset

    Args:
        name: name of the selected dataset
    Returns:
        selected dataset in Dataframe
    """
    return load_dataset(name)
