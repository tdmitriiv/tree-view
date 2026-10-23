import type { TreeNodeDTO } from '@@/src/types/TreeStore'
import { describe, it, expect, vi } from 'vitest'

import TreeStore from '@@/src/utils/TreeStore.ts'
import data from '@@/public/data.json'

function itemChildrenIds (store: TreeStore, item: TreeNodeDTO['parent']) {
  return store.treeNodeChildrenMap.get(item) || []
}

describe('TreeStore', () => {
  it('defined', () => {
    const spy = vi.spyOn(TreeStore.prototype, 'reindexItems')

    const store = new TreeStore([])
    expect(store).toBeDefined()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('init values', () => {
    const store = new TreeStore(data)
    
    expect(itemChildrenIds(store, null).join(' ')).toBe('1')
    expect(store.treeNodeMap.size).toBe(data.length)
    
    const parentsIds = Array.from(new Set(data.map(item => item.parent)))
    expect(store.treeNodeChildrenMap.size).toBe(parentsIds.length)
  })

  it('add item', () => {
    const store = new TreeStore([])
    expect(store.treeNodeMap.size).toBe(0)
    
    const rootItem = { id: 1, label: 'item 1', parent: null }
    store.addItem(rootItem)
    expect(itemChildrenIds(store, null).length).toBe(1)
    expect(store.treeNodeMap.size).toBe(1)
    expect(store.treeNodeMap.get(1)?.id).toBe(rootItem.id)

    const childItem = { id: 2, label: 'item 2', parent: 1 }
    store.addItem(childItem)
    expect(itemChildrenIds(store, null).length).toBe(1)
    expect(store.treeNodeMap.size).toBe(2)
    expect(store.treeNodeMap.get(2)?.id).toBe(childItem.id)
    expect(
      itemChildrenIds(store, childItem.parent).join(' ')
    ).toBe(`${childItem.id}`)
  })

  it('remove item', () => {
    const store = new TreeStore(data)
    expect(store.treeNodeMap.size).toBe(data.length)
    const removeId = 4
    expect(store.treeNodeMap.has(removeId)).toBeTruthy()
    
    store.removeItem(removeId)
    expect(store.treeNodeMap.has(removeId)).toBeFalsy()
    expect(store.treeNodeChildrenMap.has(removeId)).toBeFalsy()
    expect(store.treeNodeMap.size).toBe(5)

    store.removeItem(1)
    expect(store.treeNodeMap.size).toBe(0)
  })

  it('update item', () => {
    const updatedItem = {
      id: 8,
      label: 'updated 8',
      parent: null
    }
    const store = new TreeStore(data)
    expect(
      itemChildrenIds(store, null).length
    ).toBe(1)
    
    expect(store.treeNodeChildrenMap.get(4)?.length).toBe(2)
    store.updateItem(updatedItem)
    expect(store.treeNodeChildrenMap.get(4)?.length).toBe(1)
    expect(store.treeNodeMap.get(8)?.label).toBe(updatedItem.label)
    expect(
      itemChildrenIds(store, null).length
    ).toBe(2)
  })

  it('get all children', () => {
    const store = new TreeStore(data)
    const dataIds = data.map(({ id }) => id).filter(id => id != 1)
    expect(
      store.getAllChildren(1).every(({ id }) => dataIds.includes(id))
    ).toBeTruthy()
    expect(store.getAllChildren(8).length).toBe(0)
    
    store.addItem({
      id: 9,
      parent: 8,
      label: 'item 9'
    })
    dataIds.push(9)
    expect(
      store.getAllChildren(1).every(({ id }) => dataIds.includes(id))
    ).toBeTruthy()
  })

  it('get all parent', () => {
    const store = new TreeStore(data)
    expect(store.getAllParents(8).length).toBe(3)
  })

  it('get all', () => {
    const store = new TreeStore(data)
    const dataIds = data.map(({ id }) => id)
    expect(
      store.getAll().every(item => dataIds.includes(item.id))
    ).toBeTruthy()
  })

  it('build tree', () => {
    const store = new TreeStore(data)
    const expectedTree = [
      {
        "id": 1,
        "parent": null,
        "label": "Айтем 1",
        "children": [
          {
            "id": "91064cef",
            "parent": 1,
            "label": "Айтем 2",
            "children": [
              {
                "id": 4,
                "parent": "91064cef",
                "label": "Айтем 4",
                "children": [
                  {
                    "id": 7,
                    "parent": 4,
                    "label": "Айтем 7",
                    "children": []
                  },
                  {
                    "id": 8,
                    "parent": 4,
                    "label": "Айтем 8",
                    "children": []
                  }
                ]
              },
              {
                "id": 5,
                "parent": "91064cef",
                "label": "Айтем 5",
                "children": []
              },
              {
                "id": 6,
                "parent": "91064cef",
                "label": "Айтем 6",
                "children": []
              }
            ]
          },
          {
            "id": 3,
            "parent": 1,
            "label": "Айтем 3",
            "children": []
          }
        ]
      }
    ]
    expect(
      JSON.stringify(store.buildTree()) === JSON.stringify(expectedTree)
    ).toBeTruthy()
  })
})
