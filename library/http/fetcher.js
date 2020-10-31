// @flow

import { computed, ref, watch } from '@vue/composition-api'
import useSWRV, { mutate } from 'swrv'
import { concatenateUrl, key2url, stringifyQuery } from '../utils'
import { useDefaultErrorFormatter } from '../errors'
import type { FetcherFunction, FetcherOptions, HttpError, Ref, UseFetcher } from './types'

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
  options: FetcherOptions<ErrorType>): UseFetcher<DataType, ErrorType> {
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substr(0, baseUrl.length - 1)
  }
  options = { ...options }

  const currentApiUrl = ref(null)
  const currentApiModule = ref(null)
  const currentApiQuery = ref(null)
  const loaded = ref(false)
  const currentApiUrlWithQuery = computed(() => {
    if (currentApiQuery.value && currentApiUrl.value) {
      return `${currentApiUrl.value}?${stringifyQuery((currentApiQuery.value))}`
    }
    return currentApiUrl.value
  })

  const stale = ref(true)
  const errorFormatter = options?.errorFormatter

  function url2key(url) {
    return `${cacheKeyPrefix}:${url}`
  }

  const { data, error: rawError, isValidating, mutate: reload } =
    useSWRV(
      () => currentApiUrlWithQuery.value ? url2key(currentApiUrlWithQuery.value) : '',
      async key => {
        stale.value = true
        const ret = await fetcherFunction(key2url(key), {
          urlWithoutQuery: currentApiUrl.value,
          query: currentApiQuery.value,
          options
        })
        stale.value = false
        return ret
      }, options)

  watch([isValidating, data], () => {
    if (!isValidating.value && data.value) {
      loaded.value = true
    }
  })

  function load(module, query, force = false) {
    currentApiModule.value = module
    currentApiUrl.value = concatenateUrl(baseUrl, module)
    if (query) {
      currentApiQuery.value = JSON.parse(JSON.stringify(query))
    } else {
      currentApiQuery.value = null
    }
    if (force) {
      reload()
    }
  }

  const error = errorFormatter ? errorFormatter(rawError) : useDefaultErrorFormatter(rawError)

  function prefetch(module: string, value: any, query: any) {
    const apiUrl = concatenateUrl(baseUrl, module)
    const apiQuery = query ? JSON.parse(JSON.stringify(query)) : null
    const apiUrlWithQuery = apiQuery && apiUrl ? `${apiUrl}?${stringifyQuery(apiQuery)}` : apiUrl
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
