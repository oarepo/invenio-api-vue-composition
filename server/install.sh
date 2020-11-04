#!/bin/bash

curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
source $HOME/.poetry/env
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip setuptools wheel
poetry install
mkdir -p .venv/var/instance
