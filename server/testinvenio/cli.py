import json

import click
import requests
from flask.cli import with_appcontext
from invenio_db import db
from invenio_search import current_search, current_search_client

from testinvenio.records import TestRecord


@click.group()
def testrepo():
    """restrepo commands"""


@testrepo.command()
@with_appcontext
def records():
    for idx in range(20):
        md = {
            "title": f"Some title{idx}",
            "contributors": [
                {
                    "name": f"jmeno{idx}"
                }
            ],
            "category": f"{idx}"
        }
        assert requests.post('https://127.0.0.1:5000/api/records/', data=json.dumps(md),
                      headers={
                          'Content-Type': 'application/json'
                      },
                      verify=False).status_code == 201
