import CompositionApi from '@vue/composition-api'
import { createLocalVue, mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { useInvenioOptions } from '../../../library'
import axios from 'axios'

const localVue = createLocalVue()
localVue.use(CompositionApi)

jest.mock('axios')

describe('options', () => {
  test('successful request', async () => {
    const component = {
      template: '<div></div>',
      setup() {
        const col = useInvenioOptions(
          'https://unknown-repo.cz/api/'
        )
        return col
      }
    }
    const wrapper = mount(component, { localVue })
    const optionsResponse = {
      'facets': [[{ 'code': 'category', 'facet': { 'label': 'category' } }]],
      'filters': [[{ 'code': 'category', 'filter': { 'label': 'category' } }]]
    }
    axios.mockResolvedValueOnce({
      // mocked response from oarepo-ui
      data: optionsResponse
    })
    wrapper.vm.load('records')

    await flushPromises()

    expect(wrapper.vm.loading).toBeFalsy()
    expect(wrapper.vm.error).toBeFalsy()
    expect(wrapper.vm.options).toStrictEqual(optionsResponse)

    // load again - should use the cached value and raise no error even though mocked axios would throw one
    wrapper.vm.load('records')
    await flushPromises()
    expect(wrapper.vm.loading).toBeFalsy()
    expect(wrapper.vm.error).toBeFalsy()
    expect(wrapper.vm.options).toStrictEqual(optionsResponse)
  })
})
