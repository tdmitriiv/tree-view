class TreeStore {
  constructor (private data: TreeNodeDTO[]) {}

  getAll (): TreeNode[] {
    return []
  }

  getItem (id: TreeNodeDTO['id']): TreeNodeDTO {
    return {} as TreeNodeDTO
  }

  getAllChildren (id: TreeNodeDTO['id']): TreeNodeDTO[] {
    return []
  }

  getAllParents (id: TreeNodeDTO['id']): TreeNodeDTO[] {
    return []
  }

  setItems (items: TreeNodeDTO) {}

  addItem (item: TreeNodeDTO) {}

  removeItem (id: TreeNodeDTO['id']) {}

  updateItem (item: TreeNodeDTO) {}
}
