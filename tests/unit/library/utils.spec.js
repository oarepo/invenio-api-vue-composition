import { concatenateUrl, key2url, stringifyQuery } from '../../../library/utils'

describe('key2url works', () => {
  test('simple split', () => {
    expect(key2url('get:blah')).toBe('blah')
  })
  test('real url', () => {
    expect(key2url('get:http://google.com')).toBe('http://google.com')
  })
  test('multiple colons', () => {
    expect(key2url('get:http://google.com?q=blah:value')).toBe('http://google.com?q=blah:value')
  })
})

describe('stringifyQuery works', () => {
  test('non-null values', () => {
    expect(stringifyQuery({
      test: '1234',
      test2: 1234,
      test3: '$&+/:;=?@',
      test4: '"<>#%{}|\\^[]`'
    })).toBe('?test=1234&test2=1234&test3=%24%26%2B%2F%3A%3B%3D%3F%40&test4=%22%3C%3E%23%25%7B%7D%7C%5C%5E%5B%5D%60')
  })

  test('falsy value', () => {
    expect(stringifyQuery({
      test: false,
      test2: true
    })).toBe('?test2')
  })

  test('null value', () => {
    expect(stringifyQuery({
      test: null
    })).toBe('')
  })
})


describe('concatenate url', () => {
  test('url with part beginning with slash', () => {
    expect(concatenateUrl('http://google.com/aaa', '/bbb')).toBe('http://google.com/bbb')
  })
  test('url with part not beginning with slash', () => {
    expect(concatenateUrl('http://google.com/aaa', 'bbb')).toBe('http://google.com/aaa/bbb')
  })
  test('url with full http url', () => {
    expect(concatenateUrl('http://google.com/aaa', 'http://bing.com')).toBe('http://bing.com')
  })
  test('url with full https url', () => {
    expect(concatenateUrl('http://google.com/aaa', 'https://bing.com')).toBe('https://bing.com')
  })
})
