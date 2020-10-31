import CompositionApi from '@vue/composition-api'
import { useFetcher } from '../../../library/http/fetcher'
import { createLocalVue, mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(CompositionApi)

describe('request composable works', () => {
  test('successful request', async () => {
    const component = {
      template: '<div></div>',
      setup() {
        const req = useFetcher(
          'https://google.com',
          'get',
          (url) => ({
            test: true,
            url: url
          })
        )
        return req
      }
    }
    const wrapper = mount(component, { localVue })
    wrapper.vm.load('aaa')

    expect(wrapper.vm.currentApiUrl).toBe('https://google.com/aaa')
    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(wrapper.vm.stale).toBe(false)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.data).toStrictEqual({
      test: true,
      url: 'https://google.com/aaa'
    })
  })

  test('client error', async () => {
    const component = {
      template: '<div></div>',
      setup() {
        const req = useFetcher(
          'https://google.com/clientError',
          'get',
          async () => {
            throw { request: { blah: true } }
          }
        )
        return req
      }
    }
    const wrapper = mount(component, { localVue })
    wrapper.vm.load('aaa')

    expect(wrapper.vm.currentApiUrl).toBe('https://google.com/clientError/aaa')
    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.data).toBe(undefined)
    expect(wrapper.vm.error).toStrictEqual({
      rawError: { request: { blah: true } },
      type: 'responseMissing',
      request: { blah: true }
    })
  })


  test('server error 400', async () => {
    const component = {
      template: '<div></div>',
      setup() {
        const req = useFetcher(
          'https://google.com/serverError400',
          'get',
          async () => {
            throw { response: { status: 400, data: {blah: true} }, request: 'test' }
          }
        )
        return req
      }
    }
    const wrapper = mount(component, { localVue })
    wrapper.vm.load('aaa')

    expect(wrapper.vm.currentApiUrl).toBe('https://google.com/serverError400/aaa')
    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.data).toBe(undefined)
    expect(wrapper.vm.error).toStrictEqual({
      rawError: { response: { status: 400, data: {blah: true} }, request: 'test' },
      type: 'clientError',
      request: 'test',
      response: { status: 400, data: {blah: true} },
      status: 400,
      reason: {blah: true}
    })
  })

  test('server error unauthorized', async () => {
    const component = {
      template: '<div></div>',
      setup() {
        const req = useFetcher(
          'https://google.com/serverError403',
          'get',
          async () => {
            throw { response: { status: 403, data: {blah: true} }, request: 'test' }
          }
        )
        return req
      }
    }
    const wrapper = mount(component, { localVue })
    wrapper.vm.load('aaa')

    expect(wrapper.vm.currentApiUrl).toBe('https://google.com/serverError403/aaa')
    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.data).toBe(undefined)
    expect(wrapper.vm.error).toStrictEqual({
      rawError: { response: { status: 403, data: {blah: true} }, request: 'test' },
      type: 'unauthorized',
      request: 'test',
      response: { status: 403, data: {blah: true} },
      status: 403,
      reason: {blah: true}
    })
  })


  test('server error 500', async () => {
    const component = {
      template: '<div></div>',
      setup() {
        const req = useFetcher(
          'https://google.com/serverError500',
          'get',
          async () => {
            throw { response: { status: 510, data: {blah: true} }, request: 'test' }
          }
        )
        return req
      }
    }
    const wrapper = mount(component, { localVue })
    wrapper.vm.load('aaa')

    expect(wrapper.vm.currentApiUrl).toBe('https://google.com/serverError500/aaa')
    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(true)

    await flushPromises()

    expect(wrapper.vm.stale).toBe(true)
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.data).toBe(undefined)
    expect(wrapper.vm.error).toStrictEqual({
      rawError: { response: { status: 510, data: {blah: true} }, request: 'test' },
      type: 'serverError',
      request: 'test',
      response: { status: 510, data: {blah: true} },
      status: 510,
      reason: {blah: true}
    })
  })
})
