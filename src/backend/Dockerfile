from python:3.10-slim-buster
run apt-get update && apt-get install build-essential -y
workdir /usr/src/hacking-materials
env FLASK_APP=src/main.py
env FLASK_RUN_HOST=0.0.0.0
env FLASK_ENV=development
copy requirements.txt requirements.txt
run python -m pip install --upgrade pip
run pip install -r requirements.txt

# Depending on the host machine, pip may have installed either psycopg2 or psycopg2-binary
# On ARM machines (e.g. Apple's M1 machines), psycopg2-binary is incorrectly configured
# and installs a very old version of its dependency libpq, which breaks
# authentication with postgres databases using SCRAM authentication
# To fix this, we:
# - Uninstall psycopg2-binary if it's installed
# - Install libpq-dev from the system package manager (i.e., an up-to-date version)
# - Install psycopg2 instead, which builds the dependent C library from source.

run apt update -y && apt install -y build-essential libpq-dev
run pip uninstall -y psycopg2-binary
run pip install psycopg2

copy src src

