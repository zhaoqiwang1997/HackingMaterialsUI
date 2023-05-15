#!/usr/bin/python
""" Create .env files needed for all docker containers"""
import secrets
import sys
from pathlib import PurePath


def create_envs(root_git: PurePath):
    '''Create .env files needed for docker frontend/backend

    Args:
        root_git (str): root directory of git files
    '''
    env_dict = dict()
    env_accepted = False
    tries_left = 5
    example_google_api_key = "111111111-111abc123abc123abc123abc123abc.apps.googleusercontent.com"

    while not env_accepted and tries_left > 0:
        postgress_user = "ha_db_admin"
        email_address = input("Please enter an email address for the database administrator: ")
        print(f"\nGoogle Api keys are in this format {example_google_api_key}")
        google_api = input("Please enter/paste Google Api client key: ")
        postgress_pass = secrets.token_urlsafe(16)
        pga_password = secrets.token_urlsafe(16)
        redis_password = secrets.token_urlsafe(64)
        flask_secret = secrets.token_urlsafe(64)

        env_dict["backend"] = f"""POSTGRES_USER={postgress_user}
POSTGRES_PASS={postgress_pass}
PGA_USER={email_address}
PGA_PASS={pga_password}
REDIS_PASSWORD={redis_password}
FLASK_SECRET={flask_secret}
REACT_APP_GOOGLE_CLIENT_ID={google_api}
POSTGRES_URL="postgresql://${{POSTGRES_USER}}:${{POSTGRES_PASS}}@localhost:5432/ha_db"
CELERY_BROKER_URL="redis://:${{REDIS_PASSWORD}}@localhost:6379/0"
CELERY_RESULT_BACKEND="redis://:${{REDIS_PASSWORD}}@localhost:6379/0"
STR_CONN="postgresql://${{POSTGRES_USER}}:${{POSTGRES_PASS}}@localhost:5432/ha_db"
        """

        env_dict["frontend"] = f"""REACT_APP_GOOGLE_CLIENT_ID={google_api}
REACT_APP_BACKEND_API_URI=''
    """

        print(f"\n\n\tBackend environment variables:\n{env_dict['backend']}")
        print(f"\n\n\tFrontend environment variables:\n{env_dict['frontend']}\n\n")
        accept_str = input("enter yes to accept: ")

        print(accept_str.strip())
        env_accepted = accept_str.strip() == "yes"
        tries_left -= 1

    if not env_accepted:
        print("Maximum tries exceeded. run \npython3 ~/HA-2022-SM2/src/backend/create_envs.py\nto try again")
    else:
        for item in ["backend", "frontend"]:
            env_fname = root_git.joinpath("src", item, ".env")
            with open(env_fname, "w") as env_file:
                env_file.write(env_dict[item])

        print("Frontend & Backend .env files created")


if __name__ == '__main__':
    root_git = PurePath(sys.argv[1])
    create_envs(root_git)
