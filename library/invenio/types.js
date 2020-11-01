// @flow

/*
 * global types
 */

import type { FetcherOptions, HttpError } from '../http/types'

export interface Ref<T = any> {
  value: T;
}


/*
 * options
 */


/**
 * returned options -> facets
 */
export type FacetDefinition = {
  code: string,
  facet: {
    label: string
  }
}

/**
 * HTTP options are just ``<any>``thing
 */
export type InvenioOptions = {
  facets: FacetDefinition[],
  filters: any
}

/**
 * Currently no other options but those from fetcher
 * @see FetcherOptions
 */
export type InvenioHttpOptionOptions = {} & FetcherOptions<HttpError>

/**
 * Composable result of useInvenioOptions.
 * @see useInvenioOptions
 */
export type UseInvenioOptionsComposable = {
  /**
   * Set to true if the returned data are stale, that is not yet reloaded
   */
  stale: Ref<boolean>,
  /**
   * Set to true if loading is in progress
   */
  loading: Ref<boolean>,
  /**
   * Set to true if at least some data have been loaded (not necesarily in the latest reload)
   */
  loaded: Ref<boolean>,
  /**
   * loaded options
   */
  options: Ref<InvenioOptions>,
  /**
   * Any error received from the underlying http library
   */
  error: Ref<HttpError>,
  /**
   * Initiates loading of new data
   *
   * @param module  the module to be loaded
   * @param query   query dictionary
   * @param force   true if reload should be trigger even if module & query are the same as previously
   */
  load: (module: string, query?: any, force?: boolean) => void,
  /**
   * Reloads the current data from server
   */
  reload: () => void,

  /**
   * facets known by the endpoint
   */
  knownFacets: Ref<FacetDefinition[]>
}


/*
 * record
 */

/**
 * Vue route definition (name and params) or a string path
 */
export type RecordRouteDef = {
  name: string,
  params: {
    id: string
  }
} | string

/**
 * Options for listing collection
 * @see FetcherOptions
 */
export type InvenioCollectionListOptions<Record> = {
  /**
   * a function that returns link to the user interface that will show the record.
   * The link will be placed as record.links.ui property
   *
   * @param record                  record to be shown
   * @param response                raw response from Invenio
   * @param collectionOptions       OPTIONS response
   * @param httpGetOptions          options passed to useInvenioCollection
   */
  uiLinkTransformer: (record: Record, response: any,
                      collectionOptions: InvenioOptions,
                      httpGetOptions: InvenioCollectionListOptions<Record>) => RecordRouteDef,

  /**
   * a function that transforms a record. Can be used to implement custom logic on the record
   * before it is returned.
   *
   * @param record                  record to be shown
   * @param response                raw response from Invenio
   * @param collectionOptions       OPTIONS response
   * @param httpGetOptions          options passed to useInvenioCollection
   */
  recordTransformer: (record: Record, response: any,
                      collectionOptions: InvenioOptions,
                      httpGetOptions: InvenioCollectionListOptions<Record>) => Record
} & FetcherOptions<HttpError>

/**
 * returned options -> facets
 */
export type FacetInstanceDefinition = {
  buckets: Array<{
    doc_count: number,
    key: string,
    key_as_string?: string
  }>,
  doc_count_error_upper_bound: number,
  sum_other_doc_count: number
} & FacetDefinition


/**
 * Composable result of useInvenioCollection.
 * @see useInvenioCollection
 */
export type UseInvenioCollectionComposable<Record> = {
  /**
   * actually loaded collection code
   */
  collectionCode: Ref<string>,
  /**
   * actually loaded collection url without query
   */
  collectionUrl: Ref<string>,
  /**
   * actually loaded query
   */
  collectionQuery: Ref<string>,
  /**
   * complete collection url with query
   */
  collectionUrlWithQuery: Ref<string>,
  /**
   * Loads a collection (page)
   *
   * @param collection  collection code (will be put to the url)
   * @param query       optional query dictionary
   * @param force       if true force reload even if it is currently loaded
   */
  load: (collection: string, query: any, force: boolean) => void,
  /**
   * reloads the collection (page)
   */
  reload: () => void,
  /**
   * true if currently loading
   */
  loading: Ref<boolean>,
  /**
   * true if has been previously loaded
   */
  loaded: Ref<boolean>,
  /**
   * true if records/facets are stale - that is loaded from previous load (if the current one was not successful)
   */
  stale: Ref<boolean>,
  /**
   * loading error
   */
  error: Ref<HttpError>,
  /**
   * loaded facets
   */
  facets: Ref<FacetInstanceDefinition[]>,
  /**
   * loaded records
   */
  records: Ref<Record[]>,
  /**
   * number of pages
   */
  pages: Ref<number | null>,
  /**
   * loaded collection options
   */
  options: Ref<InvenioOptions>
}

/*
 * Record
 */


/**
 * Options for listing collection
 * @see FetcherOptions
 */
export type InvenioRecordOptions<Record> = {
  /**
   * a function that transforms a record. Can be used to implement custom logic on the record
   * before it is returned.
   *
   * @param record                  record to be shown
   * @param response                raw response from Invenio
   * @param collectionOptions       OPTIONS response
   * @param httpGetOptions          options passed to useInvenioCollection
   */
  recordTransformer: (record: Record, response: any,
                      collectionOptions: InvenioOptions,
                      httpGetOptions: InvenioRecordOptions<Record>) => Record
} & FetcherOptions<HttpError>


/**
 * Composable result of useInvenioRecord.
 * @see useInvenioRecord
 */
export type UseInvenioRecordComposable<Record> = {
  /**
   * code of currently loaded collection
   */
  collectionCode: Ref<string>,
  /**
   * id of currently loaded record
   */
  recordId: Ref<string>,
  /**
   * Use this collection for subsequent loads
   *
   * @param collection
   */
  useCollection: (collection: string) => void,
  /**
   * loads a record
   *
   * @param recordId    id of the record
   * @param collection  collection of the record.
   *                    Pass null to load record in collectionCode (set for example in useCollection call)
   * @param force       reload even if currently loaded
   */
  load: (recordId: string, collection?: string, force?: boolean) => void,
  /**
   * reload currently loaded record
   */
  reload: () => void,
  /**
   * true if currently loading
   */
  loading: Ref<boolean>,
  /**
   * true if has been previously loaded
   */
  loaded: Ref<boolean>,
  /**
   * true if records/facets are stale - that is loaded from previous load (if the current one was not successful)
   */
  stale: Ref<boolean>,
  /**
   * loading error
   */
  error: Ref<HttpError>,
  /**
   * currently loaded record
   */
  record: Ref<Record>,
  /**
   * collection HTTP OPTIONS
   */
  options: Ref<InvenioOptions>
}
