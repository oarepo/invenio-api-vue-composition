import CompositionApi from '@vue/composition-api'
import { createLocalVue, mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import axios from 'axios'
import { sleep } from '../utils'
import { useInvenioRecord } from '../../../library'

const localVue = createLocalVue()
localVue.use(CompositionApi)

jest.mock('axios')

const optionsResponse = {
  'facets': [{ 'code': 'category', 'facet': { 'label': 'category' } }],
  'filters': [{ 'code': 'category', 'filter': { 'label': 'category' } }]
}

const record = {
  'created': '2020-10-30T11:48:10.900433+00:00',
  'id': '1',
  'links': { 'self': 'https://127.0.0.1:5000/api/records/1' },
  'metadata': {
    'category': '0',
    'contributors': [{ 'name': 'jmeno0' }],
    'control_number': '1',
    'title': 'Some title0'
  },
  'updated': '2020-10-30T11:48:10.900438+00:00'
}

describe('record', () => {
  function setupApi(url, httpGetOptions, httpOptionOptions) {
    const component = {
      template: '<div></div>',
      setup() {
        const col = useInvenioRecord(
          url, httpGetOptions, httpOptionOptions
        )
        return col
      }
    }
    const wrapper = mount(component, { localVue })

    axios.mockImplementation(async (arg) => {
      if (arg.method === 'options') {
        return Promise.resolve({ data: optionsResponse })
      } else {
        return Promise.resolve({ data: record })
      }
    })

    return wrapper
  }

  test('successful request', async () => {
    const wrapper = setupApi('https://unknown-repo.cz/api/1/')

    const recordApi = wrapper.vm
    recordApi.load('records', '1')
    expect(recordApi.record).toBeFalsy()

    await flushPromises()
    await sleep(10)

    expect(recordApi.options).toStrictEqual(
      optionsResponse
    )

    expect(recordApi.error).toBeFalsy()
    expect(recordApi.record).toStrictEqual(record)
  })
})
