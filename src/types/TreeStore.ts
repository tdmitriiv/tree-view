export type TreeNodeDTO = {
  id: number | string,
  parent: TreeNodeDTO['id'] | null,
  label: string
}

export type TreeNode = TreeNodeDTO & {
  children: TreeNode[]
}