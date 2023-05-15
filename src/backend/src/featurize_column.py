from matminer.featurizers.base import BaseFeaturizer

from .datasets import retrieve_dataset
from .featurizers import create_featurizer
from .task_updates import save_progress, save_result
from .users import Users
from .datasets import retrieve_dataset


class FeaturizerJob: 
    """Apply featurizer to a column and add the resulting column to the dataset
    """
    def __init__(self, task_id: str, email: str) -> None:
        _, data = Users().read(email)
        self.email = email
        self.workflow = data["workflow"]
        self.dataset = data["current_dataset"]
        self.featurizer: BaseFeaturizer = create_featurizer(self.workflow.featurizer)

        # Load the dataset:
        # If there's an existing current_dataset, it's likely left-over from when the user selected a different featurizer
        self.dataset = retrieve_dataset(self.workflow.dataset)

    def featurize(self) -> str:
        """Featurize column

        Returns:
            str: success message
        """
        users = Users()

        save_progress(self.email, "Starting to Featurize")
        output_df = self.featurizer.featurize_dataframe(
            self.dataset, self.workflow.column_to_featurize, ignore_errors=True, return_errors=True, pbar=False
        )

        save_progress(self.email, "Featurization Complete, Saving Results")

        # save updated dataset to database
        users.update({"email": self.email, "current_dataset": output_df})

        save_result(self.email, {"table": "users", "key": self.email})

        return str("Featurized Column Created")
