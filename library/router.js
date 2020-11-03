import CollectionWrapper from './components/CollectionWrapper.vue'
import CollectionApiWrapper from './components/CollectionApiWrapper.vue'
import RecordWrapper from './components/RecordWrapper.vue'
import deepmerge from 'deepmerge'


/**
 * Generates route path for a collection
 *
 * @param options                 options
 * @param {string} options.apiUrl          Invenio api url, defaults to '/api'
 * @param {string} options.collectionCode  collection code that will be appended to api url. If not defined, equals to route path
 * @param {string} options.path            route path. If not defined, equals to collectionCode
 * @param {Component} options.component
 *                                viewer component for showing the records and facets
 * @param {string|Component} options.errorComponent component shown on error
 *
 * - if component is passed it will be used to render the error
 * - If set to 'viewer', viewerComponent will be used
 * - If set to 'simple' or undefined, simple component showing the error with a retry button is shown
 *
 * @param {string|Component} options.loadingComponent component shown while loading records
 *
 * - if component is passed it will be used during loading when records are not available.
 * - If set to 'viewer', viewerComponent will be used during loading
 * - If set to 'empty' or undefined, empty space is shown during load
 *
 * @param {string} options.recordRouteName
 *      name of route that will be used to show the record. the route must contain ``recordId`` url param.
 * @param {InvenioHttpOptionOptions} options.httpOptionsProps
 *      InvenioHttpOptionOptions used for fetching collection options
 * @param {InvenioCollectionListOptions} options.httpGetProps
 *      InvenioCollectionListOptions used for fetching the collection
 *
 * @param extra                   extra parameters to be merged with the route object
 *
 * @returns object to put into the router routes
 *
 * *Viewer/Loading/Error component*
 *
 * The component is passed the following props:
 *
 * ```html
 * <component
 *   :is="currentComponent"
 *   :collection-api="collectionApi"
 *   :records="collectionApi.records.value"
 *   :facets="facets"
 *   :loading="collectionApi.loading.value"
 *   :loaded="collectionApi.loaded.value"
 *   :error="collectionApi.error.value"
 *   :stale="collectionApi.stale.value"
 *   :pages="collectionApi.pages.value"
 *   :page="$query.page"
 *   :pageSize="$query.size"
 *   :query="$query.q"
 *   :reload="collectionApi.reload"
 *   \@nextPage="nextPage"
 *   \@prevPage="prevPage"
 *   \@setPage="setPage"
 *   \@setPageSize="setPageSize"
 *   \@search="search"
 * ></component>
 * ```
 *
 * *Example*:
 *
 * ```javascript
 *  routes = [
 *    collection({
 *        collectionCode: 'records',
 *        component: MyCollectionViewer,
 *      },
 *      { name: 'recordList' }
 *    )
 *  ]
 * ```
 *
 *  Will evaluate to:
 *
 * ```javascript
 *  routes = [
 *   {
 *      path: 'records',
 *      component: CollectionWrapper,
 *      name: 'recordList',
 *      props: {
 *        collectionCode: 'records',
 *        viewerComponent: MyCollectionViewer,
 *        errorComponent: 'simple',
 *        loadingComponent: 'empty'
 *      },
 *      meta: {
 *        query: {
 *          page: 'int:1',
 *          size: 'int:10',
 *          facets: 'commaarray:',
 *          q: 'string:'
 *        }
 *      }
 *    }
 *  ]
 * ```
 */
export function collection(
  {
    path,
    collectionCode,
    component,
    errorComponent,
    loadingComponent,
    apiUrl,
    recordRouteName,
    httpOptionsProps,
    httpGetProps,
    wrapperComponent
  }, extra: any): any {
  if (!wrapperComponent) {
    wrapperComponent = CollectionWrapper
  }
  let proto = {
    path: (path ? path : '/' + collectionCode),
    component: wrapperComponent,
    props: {
      collectionCode: (collectionCode ? collectionCode : path.split('/').filter(x => x).join('/')),
      viewerComponent: component,
      errorComponent: errorComponent,
      loadingComponent: loadingComponent,
      recordRouteName,
      httpOptionsProps,
      httpGetProps,
      apiUrl
    },
    meta: {
      query: {
        page: 'int:1',
        size: 'int:10',
        facets: 'commaarray:',
        q: 'string:'
      }
    }
  }
  if (extra) {
    proto = deepmerge(proto, extra)
  }
  return proto
}

/**
 * Wraps a component and injects collectionApi to its props. The collectionApi is configured with the current collection.
 *
 * @param options                 options
 * @param {string} options.apiUrl          Invenio api url, defaults to '/api'
 * @param {string} options.collectionCode  collection code that will be appended to api url. If not defined, equals to route path
 * @param {string} options.path            route path. If not defined, equals to collectionCode
 * @param {Component} options.component
 *                                wrapped component
 *
 * @param {string} options.recordRouteName
 *      name of route that will be used to show the record. the route must contain ``recordId`` url param.
 * @param {InvenioHttpOptionOptions} options.httpOptionsProps
 *      InvenioHttpOptionOptions used for fetching collection options
 * @param {InvenioCollectionListOptions} options.httpGetProps
 *      InvenioCollectionListOptions used for fetching the collection
 *
 * @param extra                   extra parameters to be merged with the route object
 *
 * @returns object to put into the router routes
 *
 * ```html
 * <component
 *   :is="currentComponent"
 *   :collection-api="collectionApi"
 *   :records="collectionApi.records.value"
 *   :facets="facets"
 *   :loading="collectionApi.loading.value"
 *   :loaded="collectionApi.loaded.value"
 *   :error="collectionApi.error.value"
 *   :stale="collectionApi.stale.value"
 *   :pages="collectionApi.pages.value"
 *   :reload="collectionApi.reload"
 * ></component>
 * ```
 *
 * *Example*:
 *
 * ```javascript
 *  routes = [
 *    collectionApi({
 *      path: '/create'
 *      collectionCode: 'records',
 *      component: RecordCreator,
 *      },
 *      { name: 'create' }
 *    )
 *  ]
 * ```
 *
 *  Will evaluate to:
 *
 * ```javascript
 *  routes = [
 *   {
 *      path: '/create',
 *      component: CollectionApiWrapper,
 *      name: 'create',
 *      props: {
 *        collectionCode: 'records',
 *        viewerComponent: RecordCreator,
 *      },
 *      meta: {
 *        query: {
 *          page: 'int:1',
 *          size: 'int:10',
 *          facets: 'commaarray:',
 *          q: 'string:'
 *        }
 *      }
 *    }
 *  ]
 * ```
 */
export function collectionApi(
  {
    path,
    collectionCode,
    component,
    apiUrl,
    recordRouteName,
    httpOptionsProps,
    httpGetProps,
  }, extra: any): any {
  return collection({
    path,
    collectionCode,
    component,
    apiUrl,
    recordRouteName,
    httpOptionsProps,
    httpGetProps,
    wrapperComponent: CollectionApiWrapper
  }, extra)
}


/**
 * Generates route path for a record
 *
 * @param options                 options
 * @param {string} options.apiUrl          Invenio api url, defaults to '/api'
 * @param {string} options.collectionCode  collection code that will be appended to api url.
 *                                         If not defined, equals to route path up to the last '/'
 * @param {string} options.path            route path. If not defined, equals to `${collectionCode}/:recordId`
 * @param {Component} options.component
 *                                viewer component for showing the record
 * @param {string|Component} options.errorComponent component shown on error
 *
 * - if component is passed it will be used to render the error
 * - If set to 'viewer', viewerComponent will be used
 * - If set to 'simple' or undefined, simple component showing the error with a retry button is shown
 *
 * @param {string|Component} options.loadingComponent component shown while loading record
 *
 * - if component is passed it will be used during loading when records are not available.
 * - If set to 'viewer', viewerComponent will be used during loading
 * - If set to 'empty' or undefined, empty space is shown during load
 *
 * @param {InvenioHttpOptionOptions} options.httpOptionsProps
 *      InvenioHttpOptionOptions used for fetching collection options
 * @param {InvenioRecordOptions} options.httpGetProps
 *      InvenioRecordOptions used for fetching the record
 *
 * @param extra                   extra parameters to be merged with the route object
 *
 * @returns object to put into the router routes
 *
 * *Viewer/Loading/Error component*
 *
 * The component is passed the following props:
 *
 * ```html
 * ```
 *
 * *Example*:
 *
 * ```javascript
 *  routes = [
 *    record({
 *        collectionCode: 'records',
 *        component: MyRecordViewer,
 *      },
 *      { name: 'record' }
 *    )
 *  ]
 * ```
 *
 *  Will evaluate to:
 *
 * ```javascript
 *  routes = [
 *   {
 *      path: 'records/:recordId',
 *      component: RecordWrapper,
 *      name: 'record',
 *      props: {
 *        collectionCode: 'records',
 *        viewerComponent: MyRecordViewer,
 *        errorComponent: 'simple',
 *        loadingComponent: 'empty'
 *      }
 *    }
 *  ]
 * ```
 */
export function record(
  {
    path,
    collectionCode,
    component,
    errorComponent,
    loadingComponent,
    apiUrl,
    httpOptionsProps,
    httpGetProps
  }, extra: any): any {
  if (!path) {
    path = `/${collectionCode}/:recordId`
  } else if (!collectionCode) {
    const collectionCodeSplit = path.split('/').filter(x => x)
    collectionCode = collectionCodeSplit.slice(0, path.length - 1).join('/')
  }
  let proto = {
    path,
    component: RecordWrapper,
    props: {
      collectionCode,
      viewerComponent: component,
      errorComponent: errorComponent,
      loadingComponent: loadingComponent,
      httpOptionsProps,
      httpGetProps,
      apiUrl
    }
  }
  if (extra) {
    proto = deepmerge(proto, extra)
  }
  return proto
}
