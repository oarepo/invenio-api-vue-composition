import CompositionApi from '@vue/composition-api'
import { createLocalVue, mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import { useInvenioCollection } from '../../../library'
import axios from 'axios'
import { sleep } from '../utils'

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
const listResponse = {
  'aggregations': {
    'category': {
      'buckets': [
        { 'doc_count': 1, 'key': '0' }
      ],
      'doc_count_error_upper_bound': 0,
      'sum_other_doc_count': 0
    }
  },
  'hits': {
    'hits': [
      record
    ], 'total': 20
  },
  'links': {
    'next': 'https://127.0.0.1:5000/api/records/?size=1&page=2',
    'self': 'https://127.0.0.1:5000/api/records/?size=1&page=1'
  }
}


describe('collection', () => {
  function setupApi(url, httpGetOptions, httpOptionOptions) {
    const component = {
      template: '<div></div>',
      setup() {
        const col = useInvenioCollection(
          url, httpGetOptions, httpOptionOptions
        )
        return col
      }
    }
    const wrapper = mount(component, { localVue })

    axios.mockImplementation(async (arg) => {
        if (arg.method === 'options') {
          return Promise.resolve({data: optionsResponse})
        } else {
          return Promise.resolve({data: listResponse})
        }
    })
    return wrapper
  }

  test('successful request', async () => {
    const wrapper = setupApi('https://unknown-repo.cz/api/1/')

    wrapper.vm.load('records')
    await flushPromises()
    await sleep(10)

    expect(wrapper.vm.options).toStrictEqual(
      optionsResponse
    )

    expect(wrapper.vm.collectionCode).toBe('records')
    expect(wrapper.vm.error).toBeFalsy()
    expect(wrapper.vm.records).toStrictEqual([
      record
    ])
    expect(wrapper.vm.records[0].links.ui).toStrictEqual({
      name: 'record-records',
      params: {
        id: '1'
      }
    })
    expect(wrapper.vm.facets).toStrictEqual(
      [
        {
          'code': 'category',
          'facet': {
            'label': 'category'
          },
          'buckets': [
            { 'doc_count': 1, 'key': '0' }
          ],
          'doc_count_error_upper_bound': 0,
          'sum_other_doc_count': 0
        }])
  })
})
