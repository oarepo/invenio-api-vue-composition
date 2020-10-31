import re

from flask import jsonify
from invenio_base.signals import app_loaded

from . import config


def record_to_index(record):
    return record.index_name, '_doc'


class TestExt:
    def __init__(self, app, **kwargs):
        for k, v in config.__dict__.items():
            if re.match('^[A-Z0-9_]+$', k):
                app.config[k] = v


@app_loaded.connect
def loaded(target, app, **kwargs):
    def handler(exc, *args, **kwargs):
        code = getattr(exc, 'code', 400)
        ret = jsonify({'status': 'error', 'message': str(exc)})
        ret.status_code = code
        return ret

    # Re-Register errors handlers.
    app.register_error_handler(401, handler)
    app.register_error_handler(403, handler)
    app.register_error_handler(404, handler)
    app.register_error_handler(429, handler)
    app.register_error_handler(500, handler)
