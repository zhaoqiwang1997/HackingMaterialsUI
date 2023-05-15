import json
from dataclasses import dataclass


# DO NOT remove the dataclass decorator, as this class is meant to be a pure data class
@dataclass
class WorkflowConfigurations:
    """A class representing workflow configuration

    The idea of this class is that it contains all the workflow configurations
    When a user is created, we should save a default workflow for him in the database
    Whenever he updates the workflow configuration from the web, the updated workflow will be saved in the database
    When a user log in, the workflow saved in the database will be loaded

    Attributes:
        featurizer: name of the selected featurizer
        dataset: name of the selected dataset
        column_to_featurize: name of the column used for featurization
        ml_algorithm: name of ml algorithm to be used
        ml_model_db_id: str = identifier of trained model in model database
        ml_y_label: Prediction column of dataset
        plot_type: the type of plot user wants to have
    """

    featurizer: str = ""
    dataset: str = ""
    column_to_featurize: str = ""
    ml_algorithm: str = ""
    ml_model_db_id: str = ""
    ml_y_label: str = ""
    split_ratio: float = 0.2
    plot_type: str = ""
    Xaxis: str = ""
    Yaxis: str = ""

    # TODO add additional configs need for executing the workflow, e.g. y label, x, y axis and so on
    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

    @staticmethod
    def from_json(json_str):
        json_dct = json.loads(json_str)
        return WorkflowConfigurations(**json_dct)
