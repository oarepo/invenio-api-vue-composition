import type { FetcherOptions, UseFetcher } from './types'
import { useFetcher } from './fetcher'
import axios from 'axios'

/**
 * A simple http wrapper around fetcher that uses axios.
 * @see useFetcher
 *
 * @param baseUrl   the base url
 * @param method
 * @param options
 * @returns {UseFetcher<DataType, ErrorType>}
 */
export function useHttp<DataType, ErrorType>(
  baseUrl: string,
  method: string,
  options: FetcherOptions<ErrorType>): UseFetcher<DataType, ErrorType> {
  return useFetcher(baseUrl, method, async (url, options) => {
    return (await axios({
      method,
      url,
      headers: options.headers
    })).data
  }, options)
}
