// @flow

/*
 * global types
 */

export interface Ref<T = any> {
  value: T;
}

/*
 * Fetcher
 */


/**
 * swrv options, see https://github.com/Kong/swrv#config-options
 */
export type SWRVOptions = {
  revalidateOnFocus: boolean,
  refreshInterval: number,
  dedupingInterval: number,
  ttl: number,
  revalidateDebounce: number,
  cache: any
}

/**
 * A default implementation of transformed error from axios that should simplify handling
 * error in callers.
 *
 * @param {string} type
 *
 *   - 'responseMissing' if the request was not delivered to the server or the server did not respond
 *   - 'notAllowed' if the client is not allowed to perform the operation (403, 405)
 *   - 'clientError' if the data supplied by client were wrong (other status codes 400-499)
 *   - 'serverError' if the data supplied by client were ok but the server failed (status codes 500-599)
 *   - 'unknown' an unknown error happened
 * @param rawError the raw error received
 * @param request  the full http request, if known
 * @param {number} status   HTTP status code
 * @param reason   payload data of the error as received from server
 * @param response the full http response, if known
 */
export type HttpError = {
  type: 'responseMissing',
  rawError: any,
  request: any
} | {
  type: 'unauthorized',
  rawError: any,
  request: any,
  status: number,
  reason: any,
  response: any
} | {
  type: 'clientError',
  rawError: any,
  request: any,
  status: number,
  reason: any,
  response: any
} | {
  type: 'serverError',
  rawError: any,
  request: any,
  status: number,
  reason: any,
  response: any
} | {
  type: 'unknown',
  rawError: any,
}

/**
 * Options passed to useFetcher composable
 */
export type FetcherOptions<ErrorType> = {
  /**
   * function responsible for converting raw error (for example from axios) to a more suitable generic error type
   * @param rawError
   */
  errorFormatter: (rawError: Ref<any>) => Ref<ErrorType>
} & SWRVOptions

/**
 * Context for fetcher function
 */
export type FetcherFunctionContext<ErrorType> = {
  /**
   * The current url without query
   */
  urlWithoutQuery: string,
  /**
   * the current query
   */
  query: any,
  /**
   * extra options passed to the useFetcher function
   */
  options: FetcherOptions<ErrorType>
}

/**
 * Fetcher function to use within useFetcher. See useFetcher for details.
 *
 * @param url url being fetched
 * @param context extra context passed
 * @param context.urlWithoutQuery  the current url without query
 * @param context.query            the current url with query
 * @param context.options          extra options passed to the useFetcher function
 */
export type FetcherFunction<DataType, ErrorType: HttpError> =
  (url: string, context: FetcherFunctionContext<ErrorType>) => Promise<DataType>


/**
 * SWRV wrapper for request module. It is a wrapper around a swrv library to split fetched
 * url into three parts: base url, module, query.
 *
 * Usage:
 *
 * ```javascript
 *   const {data, load} = useFetcher<MyDataType, HttpError>('/api', 'get', async (url) => (await axios.get(url)).data)
 *   load('test') // will load /api/test using axios
 *   // do something with data.value after the data arrives, for example show in the template
 * ```
 */
export type UseFetcher<DataType, ErrorType: HttpError> = {
  /**
   * base url of the API. Might be either a full url (__https://server/path__)
   * or an absolute path on the current server beginning with '/' (__/api__)
   */
  baseUrl: string,
  /**
   * A reference for the currently fetched api module
   */
  currentApiModule: Ref<string>,
  /**
   * Current baseUrl/module
   */
  currentApiUrl: Ref<string>,
  /**
   * Current query dict
   */
  currentApiQuery: Ref<any>,
  /**
   * Current baseUrl/module?query
   */
  currentApiUrlWithQuery: Ref<string>,
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
   * The loaded data
   */
  data: Ref<DataType>,
  /**
   * Any error received from the underlying http library
   */
  error: Ref<ErrorType>,
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
   * Pre-fetches data and exposes them via ``data`` property. An example
   * would be precaching data after they have been created and returned
   * via POST call.
   *
   * @param module    the module for which to precache data
   * @param data      the data to use
   * @param query     optional query
   */
  prefetch: (module: string, data: DataType, query?: any) => void
}
