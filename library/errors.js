// @flow

import { computed } from '@vue/composition-api'
import type { Ref, HttpError } from './types'

export function useDefaultErrorFormatter(rawError: any): Ref<HttpError> {
  return computed(() => {
    if (!rawError.value) {
      return null
    }
    const err = rawError.value
    let ret: HttpError
    const response = err.response
    if (response) {
      if (response.status === 403 || response.status === 405 || response.status === 401) {
        ret = {
          type: 'unauthorized',
          rawError: err,
          status: response.status,
          reason: response.data,
          request: err.request,
          response: response
        }
      } else if (response.status >= 400 && response.status < 500) {
        ret = {
          type: 'clientError',
          rawError: err,
          status: response.status,
          reason: response.data,
          request: err.request,
          response: response
        }
      } else {
        ret = {
          type: 'serverError',
          rawError: err,
          status: response.status,
          reason: response.data,
          request: err.request,
          response: response
        }
      }
    } else if (err.request) {
      ret = {
        type: 'responseMissing',
        rawError: err,
        request: err.request
      }
    } else {
      console.error('Unknown error in axios', err)
      ret = {
        type: 'unknown',
        rawError: err
      }
    }
    return ret
  })
}
