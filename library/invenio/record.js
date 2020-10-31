// @flow

import { ref } from '@vue/composition-api'
import axios from 'axios'
import type { InvenioHttpOptionOptions, InvenioRecordOptions, UseInvenioRecordComposable } from './types'
import { useInvenioOptions } from './options'
import { useHttp } from '../http/http'
import { concatenateUrl } from '../utils'
import { useDefaultErrorFormatter } from '../errors'

/**
 * Invenio record getter/creator/updater. When the record is loaded, performs extra OPTIONS call
 * to get collection options - so that these might be used to transform the record - i18n etc.
 *
 * The options are cached and re-fetched once a day
 *
 * @param baseUrl             the base url of invenio API server
 * @param httpGetOptions      extra options for getting/creating/updating the record
 * @param httpOptionOptions   extra options for HTTP options request
 * @returns                   composable UseInvenioRecordComposable
 */
export function useInvenioRecord<Record>(
  baseUrl: string, httpGetOptions: InvenioRecordOptions<Record>,
  httpOptionOptions: InvenioHttpOptionOptions): UseInvenioRecordComposable<Record> {

  const {
    options: collectionOptions,
    load: optionsLoad
  } = useInvenioOptions(baseUrl, httpOptionOptions)

  const currentRecordId = ref(null)
  const currentCollectionCode = ref(null)

  const {
    baseUrl: normalizedBaseUrl, stale, loading, data, error, load: httpLoad, reload, prefetch, loaded
  } = useHttp(
    baseUrl,
    'get',
    httpGetOptions
  )

  function load(recordId: string, collectionCode?: string, force = false) {
    if (collectionCode && currentCollectionCode.value !== collectionCode) {
      optionsLoad(collectionCode)
    }
    if (collectionCode && collectionCode !== currentCollectionCode.value) {
      currentCollectionCode.value = collectionCode
    }
    currentRecordId.value = recordId
    return httpLoad(`${currentCollectionCode.value}/${currentRecordId.value}`, undefined, force)
  }

  async function create(data: Record, collectionCode?: string, storeResult?: boolean): Promise<Record> {
    const postUrl = concatenateUrl(normalizedBaseUrl, collectionCode || currentCollectionCode.value)
    try {
      const resp = await axios.post(postUrl, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      const record: Record = resp.data
      if (storeResult) {
        prefetch(`${collectionCode || currentCollectionCode.value}/${(record: any).id}`, record)

        if (collectionCode && collectionCode !== currentCollectionCode.value) {
          currentCollectionCode.value = collectionCode
        }
        currentRecordId.value = (record: any).id
      }
      return record
    } catch (e) {
      throw httpGetOptions?.errorFormatter ? httpGetOptions.errorFormatter(e) : useDefaultErrorFormatter(e)
    }
  }

  return {
    collectionCode: currentCollectionCode,
    recordId: currentRecordId,
    load,
    reload,
    create,
    loading,
    loaded,
    stale,
    error,
    record: data,
    options: collectionOptions
  }
}
