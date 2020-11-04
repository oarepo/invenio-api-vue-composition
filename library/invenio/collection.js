// @flow

import { computed, ref } from '@vue/composition-api'
import { useInvenioOptions } from './options'
import type {
  InvenioCollectionListOptions,
  InvenioHttpOptionOptions,
  UseInvenioCollectionComposable,
} from './types'
import { useHttp } from '../http/http'
import { concatenateUrl } from '../utils'
import axios from 'axios'
import { useDefaultErrorFormatter } from '../errors'

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
export function useInvenioCollection<Record>(
  baseUrl: string, httpGetOptions: InvenioCollectionListOptions<Record>,
  httpOptionOptions: InvenioHttpOptionOptions): UseInvenioCollectionComposable<Record> {

  const {
    options: collectionOptions,
    load: optionsLoad,
    knownFacets
  } = useInvenioOptions(baseUrl, httpOptionOptions)

  const currentCollectionCode = ref('')

  const {
    currentApiModule, currentApiUrl, currentApiQuery, currentApiUrlWithQuery, stale,
    loading, data, error, load: httpLoad, reload, loaded, baseUrl: normalizedBaseUrl
  } = useHttp(
    baseUrl,
    'get',
    httpGetOptions
  )

  const pageSize = ref(10)

  const facets = computed(() => {
    if (!knownFacets.value.length || !data.value) {
      return []
    }
    const receivedFacets = data.value.aggregations || {}
    return knownFacets.value.map(facetDef => {
      const ret = {
        ...facetDef,
        ...receivedFacets[facetDef.code]
      }
      if (ret.facet?.values && ret.buckets) {
        ret.buckets = ret.buckets.map(x => {
          x.key_as_string = ret.facet.values[x.key] || x.key_as_string || x.key
          return x
        })
      }
      return ret
    })
  })

  const records = computed(() => {
    if (!collectionOptions.value || !data.value) {
      return null
    }
    return data.value.hits.hits.map(record => {
      const uiLinkTransformer = httpGetOptions?.uiLinkTransformer || (record => ({
        name: `record-${currentCollectionCode.value}`,
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

  const pages = computed(() => {
    if (!collectionOptions.value || !data.value) {
      return null
    }
    return Math.ceil(data.value.hits.total / (pageSize.value || 1))
  })

  function load(module, query, force) {
    if (!module) {
      module = currentCollectionCode.value
    }
    if (currentCollectionCode.value !== module) {
      // reload options
      optionsLoad(module + '/')
    }
    pageSize.value = query?.size || 10
    currentCollectionCode.value = module
    return httpLoad(module + '/', query, force)
  }

  function setCollectionCode(module) {
    currentCollectionCode.value = module
    if (currentCollectionCode.value !== module) {
      // reload options
      optionsLoad(module + '/')
    }
  }

  async function createRecord<Record>(data: Record, { collectionCode, resultContainer } = {}): Promise<Record> {
    if (!collectionCode) {
      collectionCode = currentCollectionCode.value
    }
    const postUrl = concatenateUrl(normalizedBaseUrl, collectionCode)
    try {
      const resp = await axios.post(postUrl, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      const record: Record = resp.data
      if (resultContainer) {
        (resultContainer: any)._prefetch(collectionCode, record)    // not a public api
      }
      return record
    } catch (e) {
      throw httpGetOptions?.errorFormatter ? httpGetOptions.errorFormatter(e) : useDefaultErrorFormatter(e)
    }
  }

  return {
    collectionCode: currentCollectionCode,
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
    pages,
    setCollectionCode,
    createRecord,
    options: collectionOptions
  }
}
