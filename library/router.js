import CollectionWrapper from './components/CollectionWrapper.vue'
import deepmerge from 'deepmerge'

/**
 * Generates route path for a collection
 *
 * @param options                 options
 * @param {string} options.apiUrl          Invenio api url, defaults to '/api'
 * @param {string} options.collectionCode  collection code that will be appended to api url. If not defined, equals to route path
 * @param {string} options.path            route path. If not defined, equals to collectionCode
 * @param {Component} options.viewerComponent
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
 *  <component
 *    :collection-api="collectionApi"
 *    :records="collectionApi.records"
 *    :facets="collectionApi.facets"
 *    :loading="collectionApi.loading"
 *    :loaded="collectionApi.loaded"
 *    :error="collectionApi.error"
 *    :stale="collectionApi.stale"
 *  ></component>
 * ```
 *
 * *Example*:
 *
 * ```javascript
 *  routes = [
 *    collection({
 *        collectionCode: 'records',
 *        viewerComponent: MyCollectionViewer,
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
    viewerComponent,
    errorComponent,
    loadingComponent,
    apiUrl,
    recordRouteName,
    httpOptionsProps,
    httpGetProps
  }, extra: any): any {
  let proto = {
    path,
    component: CollectionWrapper,
    props: {
      collectionCode,
      viewerComponent: viewerComponent,
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
