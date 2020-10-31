// @flow

import { computed } from '@vue/composition-api'
import type { InvenioHttpOptionOptions, InvenioHttpOptions, UseInvenioOptionsComposable } from './types'
import { useHttp } from '../http/http'
import type { HttpError } from '../http/types'

/**
 *
 * @param baseUrl
 * @param options
 * @returns composable UseInvenioOptionsComposable
 *
 * Example:
 *
 * ```javascript
 * export default defineComponent({
 *   template: `<pre>{{options}}</pre>`
 *   setup(props, ctx) {
 *      const {options, load} = useInvenioOptions('/api')
 *      load('test1.json')
 *      return { options }  // will contain HTTP OPTIONS of /api/test1.json
 *   }
 * })
 */
export function useInvenioOptions(baseUrl: string, options: InvenioHttpOptionOptions): UseInvenioOptionsComposable {
  options = { ...options }

  if (options.revalidateOnFocus === undefined) {
    options.revalidateOnFocus = false
  }
  if (options.dedupingInterval === undefined) {
    options.dedupingInterval = 24 * 3600   // options should seldom change, so 24 hours timeout
  }

  const {
    stale, loading, data, error, load, loaded, reload
  } = useHttp<InvenioHttpOptions, HttpError>(
    baseUrl,
    'options',
    options
  )

  const knownFacets = computed(() => {
    if (!data.value) {
      return []
    }
    // [{ 'code': 'category', 'facet': { 'label': 'category' } }]
    return data.value.facets
  })

  return {
    load,
    reload,
    loading,
    loaded,
    stale,
    error,
    knownFacets,
    options: data
  }
}
