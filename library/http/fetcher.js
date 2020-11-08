// @flow

import { computed, ref, watch } from '@vue/composition-api'
import useSWRV, { mutate } from 'swrv'
import { concatenateUrl, key2url, stringifyQuery } from '../utils'
import { defaultErrorFormatter } from '../errors'
import type { FetcherFunction, FetcherOptions, HttpError, Ref, UseFetcherComposable } from './types'
import deepEqual from 'deep-equal'

/**
 * A wrap around swrv library to make loading resources identified by base url + relative parts easier
 *
 * @param baseUrl the base    url of the loaded api
 * @param cacheKeyPrefix      swrv key is created as __cacheKeyPrefix__:__baseUrl__/__module__?__query__
 * @param fetcherFunction     a function to call to fetch the data
 * @param options             swrv options and error handling options
 * @return                    Composable props & methods
 *
 * Example:
 *
 * ```javascript
 * export default defineComponent({
 *   template: `<pre>{{data}}</pre>`
 *   setup(props, ctx) {
 *      const {data, error, loaded, load, ...} = useFetcher('/api', 'get', async (url) => (await axios.get(url)).data)
 *      load('test1.json')
 *      return { data }
 *   }
 * })
 * ```
 */
export function useFetcher<DataType, ErrorType: HttpError>(
  baseUrl: string,
  cacheKeyPrefix: string,
  fetcherFunction: FetcherFunction<DataType, ErrorType>,
  options: FetcherOptions<DataType, ErrorType>): UseFetcherComposable<DataType, ErrorType> {
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substr(0, baseUrl.length - 1)
  }
  options = { ...options }
  if (options.revalidateOnFocus === undefined) {
    options.revalidateOnFocus = false
  }

  const currentApiUrl = ref(null)
  const currentApiModule = ref(null)
  const currentApiQuery = ref(null)
  const loaded = ref(false)
  const currentApiUrlWithQuery = computed(() => {
    if (currentApiQuery.value && currentApiUrl.value) {
      return `${currentApiUrl.value}${stringifyQuery((currentApiQuery.value))}`
    }
    return currentApiUrl.value
  })

  const stale = ref(true)
  const errorFormatter = options?.errorFormatter

  function url2key(url) {
    return `${cacheKeyPrefix}:${url}`
  }

  const { data: rawData, error: rawError, isValidating, mutate: doReload } =
    useSWRV(
      () => {
        return currentApiUrlWithQuery.value ? url2key(currentApiUrlWithQuery.value) : ''
      },
      async key => {
        const ret = await fetcherFunction(key2url(key), {
          urlWithoutQuery: currentApiUrl.value,
          query: currentApiQuery.value,
          options
        })
        return ret
      }, options)

  const data = ref<DataType>(null)
  const error = ref<ErrorType>(null)
  const keepPreviousData = ref<boolean>(false)

  watch([isValidating, rawData, rawError], () => {
    if (!rawData.value) {
      loaded.value = false
    } else {
      loaded.value = true
    }

    // stale
    if (isValidating.value) {
      stale.value = true
    } else if (!error.value && rawData.value) {
      stale.value = false
    }
    if (!isValidating.value || !keepPreviousData.value) {
      data.value = rawData.value
      if (rawError.value) {
        error.value = errorFormatter ? errorFormatter(rawError.value) : defaultErrorFormatter(rawError.value)
      } else {
        error.value = null
      }
      keepPreviousData.value = false
    }
  })

  function setKeepPrevious(keepPrevious, newUrl, clonedQuery) {
    if (keepPrevious !== undefined) {
      keepPreviousData.value = keepPrevious
    } else if (options.keepData) {
      keepPreviousData.value = options.keepData(
        data.value, error.value,
        currentApiUrl.value,
        currentApiQuery.value,
        newUrl, clonedQuery,
        options)
    } else {
      keepPreviousData.value = false
    }
  }

  function load(module, query, force = false, keepPrevious = undefined) {
    const clonedQuery = query ? JSON.parse(JSON.stringify(query)) : null
    const newUrl = concatenateUrl(baseUrl, module)
    setKeepPrevious(keepPrevious, newUrl, clonedQuery)

    if (currentApiModule.value === module && deepEqual(currentApiQuery.value, clonedQuery)) {
      if (force) {
        reload()
      }
    } else {
      currentApiModule.value = module
      currentApiUrl.value = newUrl
      if (query) {
        currentApiQuery.value = clonedQuery
      } else {
        currentApiQuery.value = null
      }
    }
  }

  function reload(keepPrevious = undefined) {
    setKeepPrevious(keepPrevious, currentApiUrl.value, currentApiQuery.value)
    doReload()
  }

  function prefetch(module: string, value: any, query: any) {
    const apiUrl = concatenateUrl(baseUrl, module)
    const apiQuery = query ? JSON.parse(JSON.stringify(query)) : null
    const apiUrlWithQuery = apiQuery && apiUrl ? `${apiUrl}${stringifyQuery(apiQuery)}` : apiUrl
    const key = url2key(apiUrlWithQuery)

    mutate(key, JSON.parse(JSON.stringify(value)))

    currentApiModule.value = module
    currentApiUrl.value = apiUrl
    currentApiQuery.value = apiQuery
  }

  return {
    baseUrl,
    currentApiModule,
    currentApiUrl,
    currentApiQuery,
    currentApiUrlWithQuery,
    stale,
    loading: isValidating,
    loaded,
    data,
    error: ((error: any): Ref<ErrorType>),
    load,
    reload,
    prefetch
  }
}
