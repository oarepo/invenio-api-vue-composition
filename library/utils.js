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

export function concatenateUrl(baseUrl, ...parts) {
  for (let part of parts) {
    part = part.toString()
    if (part.startsWith('http://') || part.startsWith('https://')) {
      baseUrl = part
      continue
    }
    if (part.startsWith('/')) {
      const burlStart = baseUrl.substr(0, 8)
      const burlRest = baseUrl.substr(8).split('/', 1)
      baseUrl = burlStart + burlRest[0] + part
    } else if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/' + part
    } else {
      baseUrl = baseUrl + part
    }
  }
  return baseUrl
}
