import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import AgTree from '@@/src/components/AgTree.vue'

vi.mock('ag-grid-vue3', () => ({
  AgGridVue: {
    name: 'AgGridVue',
    template: '<div class="mock-grid"></div>',
    props: ['rowData', 'columnDefs', 'autoGroupColumnDef', 'loading', 'treeData', 'treeDataChildrenField'],
    emits: ['grid-ready']
  },
}))

describe('AgTree', () => {
  const mockTree: TreeNode[] = [
    { 
      id: '1',
      label: 'Group 1',
      children: [
        { id: '2', parent: '1', label: 'Item 1', children: [] }
      ],
      parent: null
    },
  ]

  it('ready emit from grid', async () => {
    const wrapper = mount(AgTree, {
      props: { loading: false, tree: mockTree },
    })

    const grid = wrapper.findComponent({ name: 'AgGridVue' })
    await grid.vm.$emit('grid-ready', { api: {}, columnApi: {} })

    await vi.waitUntil(
      () => wrapper.emitted('ready'),
      { timeout: 3000 }
    )

    expect(wrapper.emitted('ready')).toBeTruthy()
  })

  it('check AgGridVue props', () => {
    const wrapper = mount(AgTree, {
      props: { loading: true, tree: mockTree },
    })

    const grid = wrapper.findComponent({ name: 'AgGridVue' })
    expect(grid.props('loading')).toBe(true)
    expect(grid.props('rowData')).toEqual(mockTree)
    expect(grid.props('treeData')).toBe(true)
    expect(grid.props('treeDataChildrenField')).toBe('children')
  })
})
