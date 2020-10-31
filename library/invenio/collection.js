// @flow

import { computed } from '@vue/composition-api'
import { useInvenioOptions } from './options'
import type { InvenioCollectionListOptions, InvenioHttpOptionOptions, UseInvenioCollectionComposable } from './types'
import { useHttp } from '../http/http'

/**
 * Invenio collection getter. When the collection is loaded, performs extra OPTIONS call
 * to get collection options - human name, facets, filters, etc...
 *
 * The options are cached and re-fetched once a day
 *
 * @param baseUrl             the base url of invenio API server
 * @param httpGetOptions      extra options for listing request
 * @param httpOptionOptions   extra options for HTTP options request
 * @returns                   composable UseInvenioCollectionComposable
 */
export function useInvenioCollection<Record>(baseUrl: string, httpGetOptions: InvenioCollectionListOptions<Record>,
                                      httpOptionOptions: InvenioHttpOptionOptions): UseInvenioCollectionComposable<Record> {

  const {
    options: collectionOptions,
    load: optionsLoad,
    knownFacets
  } = useInvenioOptions(baseUrl, httpOptionOptions)

  const {
    currentApiModule, currentApiUrl, currentApiQuery, currentApiUrlWithQuery, stale,
    loading, data, error, load: httpLoad, reload, loaded
  } = useHttp(
    baseUrl,
    'get',
    httpGetOptions
  )

  const facets = computed(() => {
    if (!knownFacets.value.length || !data.value) {
      return []
    }
    const receivedFacets = data.value.aggregations || {}
    return knownFacets.value.map(facetDef => {
      return {
        ...facetDef,
        ...receivedFacets[facetDef.code]
      }
    })
  })

  const records = computed(() => {
    if (!collectionOptions.value || !data.value) {
      return []
    }
    return data.value.hits.hits.map(record => {
      const uiLinkTransformer = httpGetOptions?.uiLinkTransformer || (record => ({
        name: `record-${currentApiModule.value}`,
        params: {
          id: record.id
        }
      }))
      if (httpGetOptions && httpGetOptions.recordTransformer) {
        record = httpGetOptions.recordTransformer(record, data.value, collectionOptions.value, httpGetOptions)
      }
      if (!(record: any).links.ui) {
        (record: any).links.ui = uiLinkTransformer(record, data.value, collectionOptions.value, httpGetOptions)
      }
      return record
    })
  })

  function load(module, query, force) {
    if (currentApiModule.value !== module) {
      // reload options
      optionsLoad(module)
    }
    return httpLoad(module, query, force)
  }

  return {
    collectionCode: currentApiModule,
    collectionUrl: currentApiUrl,
    collectionQuery: currentApiQuery,
    collectionUrlWithQuery: currentApiUrlWithQuery,
    load,
    reload,
    loading,
    loaded,
    stale,
    error,
    facets,
    records,
    options: collectionOptions
  }
}
