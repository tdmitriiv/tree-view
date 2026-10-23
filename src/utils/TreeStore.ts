export default class TreeStore {
  treeNodeMap: Map<TreeNodeDTO['id'], TreeNode>
  treeNodeChildrenMap: Map<TreeNodeDTO['parent'], TreeNodeDTO['id'][]> = new Map()

  constructor (data: TreeNodeDTO[]) {
    this.treeNodeMap = new Map()
    this.reindexItems(data)
  }

  getAll (): TreeNodeDTO[] {
    return Array.from(this.treeNodeMap.values())
  }

  buildTree (): TreeNode[] {
    const map: Map<TreeNode['id'], TreeNode> = new Map(this.treeNodeMap)
    const tree: TreeNode[] = []

    map.forEach((value, key) =>{
      const node = map.get(key)!
      if (node.parent) {
        map.get(node.parent)!.children.push(node)
      } else {
        tree.push(node)
      }
    })

    return tree
  }

  getItem (id: TreeNodeDTO['id']): TreeNodeDTO {
    return this.treeNodeMap.get(id)!
  }

  getAllChildren (id: TreeNodeDTO['id']): TreeNodeDTO[] {
    const result: TreeNodeDTO[] = []
    const children = this.treeNodeChildrenMap.get(id)
    if (!children) { return result }

    const childrenStack: TreeNodeDTO['id'][] = [...children] 

    while (childrenStack.length) {
      const currentChildId = childrenStack.pop() || ''
      const currentNode = this.treeNodeMap.get(currentChildId)
      result.push(currentNode!)
      
      const currentNodeChildren = this.treeNodeChildrenMap.get(currentChildId) || []
      childrenStack.push(...currentNodeChildren)  
    }

    return result
  }

  getAllParents (id: TreeNodeDTO['id']): TreeNodeDTO[] {
    const result: TreeNodeDTO[] = []
    let parentId = this.treeNodeMap.get(id)?.parent
    
    while (parentId) {
      const parentNode = this.treeNodeMap.get(parentId)

      if (parentNode) {
        result.push(parentNode)
      }

      parentId = parentNode?.parent
    }

    return result
  }

  setItems (items: TreeNodeDTO[]) {
    this.reindexItems(items)
  }

  addItem (item: TreeNodeDTO) {
    this.indexItem(item)
  }

  removeItem (deleteId: TreeNodeDTO['id']) {
    const deleteNode = this.treeNodeMap.get(deleteId)
    if (!deleteNode) {
      return
    }

    // удаляем связь с родителем
    this.deleteChildFromItem(deleteNode.parent, deleteId)

    // чистим текущий элемент и всех детей
    this.getAllChildren(deleteId)
      .map(item => item.id)
      .concat(deleteId)
      .forEach(id => {
        this.treeNodeChildrenMap.delete(id)
        this.treeNodeMap.delete(id)
      })
  }

  updateItem (item: TreeNodeDTO) {
    const currentNode = this.treeNodeMap.get(item.id)
    
    if (!currentNode) {
      return
    }

    // свапаем родителей, если изменились
    if (currentNode.parent !== item.parent) {
      this.deleteChildFromItem(currentNode.parent, currentNode.id)

      this.addChildToItem(item.parent, item.id)
    }

    // обновляем элемент
    this.treeNodeMap.set(item.id, {
      ...item,
      children: []
    })
  }

  reindexItems (items: TreeNodeDTO[]) {
    this.treeNodeChildrenMap.clear()
    this.treeNodeMap.clear()

    for (let item of items) {
      this.indexItem(item)
    }
  }

  indexItem (item: TreeNodeDTO) {
    this.treeNodeMap.set(item.id, {
      ...item,
      children: []
    })

    if (!this.treeNodeChildrenMap.has(item.parent)) {
      this.treeNodeChildrenMap.set(item.parent, [item.id])
      return
    }

    this.treeNodeChildrenMap.get(item.parent)?.push(item.id)
  }

  deleteChildFromItem (itemId: TreeNodeDTO['parent'], deleteId: TreeNodeDTO['id']) {
    const parentChildren = (this.treeNodeChildrenMap.get(itemId) || []).filter((item) => item !== deleteId)
    this.treeNodeChildrenMap.set(itemId, parentChildren)
  }

  addChildToItem (itemId: TreeNodeDTO['parent'], childId: TreeNodeDTO['id']) {
    this.treeNodeChildrenMap.get(itemId)?.push(childId)
  }
}
