from json import dumps

import pandas as pd
from lightgbm import LGBMRegressor
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.linear_model import BayesianRidge, LinearRegression, Ridge, SGDRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
from xgboost.sklearn import XGBRegressor

from .models_data_handler import MLModels, Model
from .task_updates import save_progress, save_result
from .users import Users
from .workflow_data_handler import save_workflow


class ML:
    def __init__(self, task_id: str, email: str, ml_algorithm: str) -> None:
        '''Use the numerical values in the Matminer dataset to create an ML model

        Args:
            task_id (str): Celery task identifier
            email (str): email address
            model (str): key recieved from frontend to identify mmodel to be used
        '''
        _, data = Users().read(email)
        self.email = email
        self.dataset = data["current_dataset"]
        self.workflow = data["workflow"]
        self.workflow.ml_algorithm = ml_algorithm
        self.ml_y_label = self.workflow.ml_y_label
        self.split_ratio = self.workflow.split_ratio
        self.featurizer = self.workflow.featurizer
        save_workflow(self.workflow, email)

        self.pipe = self.select_ml_algorithm(ml_algorithm)

    # This function transmit the data into target ml methods
    def select_ml_algorithm(self, selected_algorithm: str) -> Pipeline:
        '''Select regressor to be used

        Args:
            regressor (str): _description_

        Returns:
            Pipeline: _description_
        '''
        ml_algorithms = {
            "lr": LinearRegression(),
            "rf": RandomForestRegressor(),
            "gb": GradientBoostingRegressor(),
            "svr": SVR(),
            "br": BayesianRidge(),
            "sgd": SGDRegressor(),
            "xgb": XGBRegressor(),
            "lgb": LGBMRegressor(),
            "kr": Ridge(),
            "gp": GaussianProcessRegressor(),
        }

        return make_pipeline(StandardScaler(), ml_algorithms.get(selected_algorithm, None))

    def clean_dataset(self, df: pd.DataFrame):
        # remove columns that contain objects
        df = df.select_dtypes(exclude=["object"])

        # remove cols that are all nan
        df = df.dropna(axis=1, how='all')
        # remove rows that have any nans
        df = df.dropna()

        return df

    def create_model(self):
        save_progress(self.email, "Training Model")
        model = Model()
        # clean dataset
        df = self.clean_dataset(self.dataset)

        # Error if cleaning the data doesn't leave enough rows
        if df.shape[1] < 2:
            return dumps({"model_id": None, "msg": "Not enough columns left after removing non numeric data"})
        if df.shape[0] < 2:
            return dumps({"model_id": None, "msg": "Not enough rows left after removing non numeric data"})

        # Split test/train
        y = df.pop(self.ml_y_label)
        X = df

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.split_ratio
        )

        # create model
        self.pipe.fit(X_train, y_train)

        save_progress(self.email, "Making Predictions")
        # make predictions on test set
        y_pred_test = self.pipe.predict(X_test)

        save_progress(self.email, "Analysing Fit")
        mae = mean_absolute_error(y_test, y_pred_test)
        mse = mean_squared_error(y_test, y_pred_test)
        r2 = r2_score(y_test, y_pred_test)

        result = {"scores": {"MAE": mae, "MSE": mse, "R2": r2}}

        # save results
        model.model = self.pipe
        model.email = self.email
        MLModels().create(model)

        save_progress(self.email, "Saving Model")
        # save database reference to database
        self.workflow.ml_model_db_id = model.id
        save_workflow(self.workflow, self.email)

        # update celery db log
        save_result(self.email, {"table": "models", "id": model.id, "result": result})

        return dumps({"model_id": model.id})
