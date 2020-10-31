export function key2url(key) {
  return key.split(/:(.+)/)[1]
}

const encodeReserveRE = /[!'()*]/g
const encodeReserveReplacer = (c) => '%' + c.charCodeAt(0).toString(16)
const commaRE = /%2C/g

const encode = (str) =>
  encodeURIComponent(str)
    .replace(encodeReserveRE, encodeReserveReplacer)
    .replace(commaRE, ',')

export function stringifyQuery(obj) {
  const res = obj
    ? Object.keys(obj)
      .map(key => {
        const val = obj[key]

        if (val === undefined || val === false) {
          return ''
        }

        if (val === null) {
          return ''
        }

        if (val === true) {
          return encode(key)
        }

        if (val === '') {
          return ''
        }

        if (Array.isArray(val)) {
          const result = []
          val.forEach(val2 => {
            if (val2 === undefined) {
              return
            }
            if (val2 === null) {
              result.push(encode(key))
            } else {
              result.push(encode(key) + '=' + encode(val2))
            }
          })
          return result.join('&')
        }

        return encode(key) + '=' + encode(val)
      })
      .filter(x => x.length > 0)
      .join('&')
    : null
  return res ? `?${res}` : ''
}

export function concatenateUrl(baseUrl, partOrUrl) {
  if (!partOrUrl) {
    return baseUrl
  }
  partOrUrl = partOrUrl.toString()
  if (partOrUrl.startsWith('http://') || partOrUrl.startsWith('https://')) {
    return partOrUrl
  } else if (partOrUrl.startsWith('/')) {
    const [start, end] = [baseUrl.slice(0, 8), baseUrl.slice(8)]  // end is after potential https://
    const endServer = end.split('/', 1)[0]      // up to the first / (that is end of hostname)
    return start + endServer + partOrUrl
  } else {
    return baseUrl + '/' + partOrUrl
  }
}
