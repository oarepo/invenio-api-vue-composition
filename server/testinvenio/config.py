from flask import request
from invenio_indexer.api import RecordIndexer
from invenio_records_rest.facets import terms_filter
from invenio_records_rest.utils import allow_all
from invenio_search import RecordsSearch
from oarepo_ui import translate_facets, translate_filters, translate_facet

from testinvenio.records import TestRecord


def loader():
    return request.json


class CommittingRecordIndexer(RecordIndexer):
    def delete(self, record, **kwargs):
        index, doc_type = self.record_to_index(record)
        index, doc_type = self._prepare_index(index, doc_type)
        try:
            return super().delete(record, **kwargs)
        finally:
            self.client.indices.refresh(index)

    def index(self, record, arguments=None, **kwargs):
        index, doc_type = self.record_to_index(record)
        index, doc_type = self._prepare_index(index, doc_type)
        try:
            return super().index(record, arguments, **kwargs)
        finally:
            self.client.indices.refresh(index)


RECORDS_REST_ENDPOINTS = {
    'testinvenio-records':
        dict(
            pid_type='recid',
            pid_minter='recid',
            pid_fetcher='recid',
            default_endpoint_prefix=True,
            record_class=TestRecord,
            search_class=RecordsSearch,
            indexer_class=CommittingRecordIndexer,
            search_index='testinvenio-record',
            search_type=None,
            record_serializers={
                'application/json': 'invenio_records_rest.serializers:json_v1_response',
            },
            record_loaders={
                'application/json': loader,
                'application/json-patch+json': loader
            },
            search_serializers={
                'application/json': 'invenio_records_rest.serializers:json_v1_search',
            },
            list_route='/records/',
            item_route='/records/<pid(recid,record_class="testinvenio.records.TestRecord"):pid_value>',
            default_media_type='application/json',
            max_result_window=10000,
            create_permission_factory_imp=allow_all,
            update_permission_factory_imp=allow_all,
            delete_permission_factory_imp=allow_all,
            error_handlers=dict(),
        )
}

INDEXER_RECORD_TO_INDEX = 'testinvenio.ext:record_to_index'

FILTERS = {
    # object
    'category': terms_filter('category'),
    'job': terms_filter('author.job'),
    'sex': terms_filter('author.sex'),
}


def term_facet(field, order='desc', size=100):
    return {
        'terms': {
            'field': field,
            'size': size,
            "order": {"_count": order}
        },
    }


FACETS = {
    # object
    'category': term_facet('category'),
    'job': term_facet('author.job'),
    'sex': translate_facet(
        term_facet('author.sex'), possible_values={
            'M': 'Male',
            'F': 'Female'
        })
}

RECORDS_REST_FACETS = {
    'testinvenio-record': {
        'aggs': translate_facets(FACETS, label='{facet_key}', value='{value_key}'),
        'filters': translate_filters(FILTERS, label='{filter_key}')
    },
}

RECORDS_REST_SORT_OPTIONS = {
    'testinvenio-record': {
        'alphabetical': {'default_order': 'asc', 'fields': ['title.raw', 'author.name', 'id'], 'order': 1,
                         'title': 'Alphabetical'}
    }
}

RECORDS_REST_DEFAULT_SORT = {
    'testinvenio-record': {
        'noquery': 'alphabetical',
        'query': 'alphabetical'
    }
}
