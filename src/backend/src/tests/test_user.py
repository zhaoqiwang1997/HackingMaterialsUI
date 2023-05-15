import json

from ..users import User


def test_user_ui_repr_is_json_serializable():
    user = User("test@test.com")
    user_json = '{"email": "test@test.com", "is_pro_user": false, "auth_info": "", "workflow": {"featurizer": "", "dataset": "", "column_to_featurize": "", "ml_algorithm": "", "ml_model_db_id": "", "ml_y_label": "", "split_ratio": 0.2, "plot_type": "", "Xaxis": "", "Yaxis": ""}}'
    assert json.dumps(user.as_ui_repr()) == user_json