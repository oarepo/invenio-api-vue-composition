import json

import click
import requests
from flask import current_app
from flask.cli import with_appcontext
from invenio_db import db
from invenio_search import current_search, current_search_client

from testinvenio.records import TestRecord
import faker

f = faker.Faker()
import random


@click.group()
def testrepo():
    """restrepo commands"""

def generate_words(nwords_min, nwords_max):
    nwords = random.randint(nwords_min, nwords_max)
    raw = f.sentence(nb_words=nwords)
    raw = raw.strip('.')
    return ' '.join(raw.split()[:nwords])

def category():
   choices = ['Article', 'Book', 'Research Data']
   return choices[random.randint(0, len(choices)-1)]


@testrepo.command()
@with_appcontext
def records():
    server_name = current_app.config['SERVER_NAME']
    for idx in range(20):
        md = {
            "title": generate_words(5, 10),
            "author": f.profile(),
            "category": category()
        }
        assert requests.post(f'https://{server_name}/api/records/', data=json.dumps(md, default=lambda s: str(s)),
                      headers={
                          'Content-Type': 'application/json'
                      },
                      verify=False).status_code == 201
