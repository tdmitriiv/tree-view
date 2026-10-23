import { describe, it, expect, vi, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '@@/src/App.vue'

const loadingRef = { value: false }
const treeRef = { value: [] as TreeNode[] }
const fetchItemsMock = vi.fn()

vi.mock('@/composables/useItemService', () => ({
  default: () => ({
    fetchItems: fetchItemsMock,
    loading: loadingRef,
    tree: treeRef,
  }),
}))

vi.mock('@/components/AgTree.vue', () => ({
  default: {
    name: 'AgTree',
    props: ['loading', 'tree'],
    emits: ['ready'],
    template: '<div class="mock-tree"></div>',
  },
}))

describe('App', () => {
  beforeEach(() => {
    fetchItemsMock.mockClear()
  })

  it('check ag tree props', () => {
    loadingRef.value = true
    treeRef.value = [{ id: '1', label: 'Root', children: [], parent: null }]

    const wrapper = mount(App)
    const grid = wrapper.findComponent({ name: 'AgTree' })

    expect(grid.props('loading')).toEqual({ value: true })
    expect(grid.props('tree')).toEqual(treeRef)
  })

  it('fetch items on AgTree ready', async () => {
    const wrapper = mount(App)
    const grid = wrapper.findComponent({ name: 'AgTree' })
    await grid.vm.$emit('ready')

    expect(fetchItemsMock).toHaveBeenCalledTimes(1)
  })
})
