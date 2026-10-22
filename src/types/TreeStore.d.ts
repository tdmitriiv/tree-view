type TreeNodeDTO = {
  id: number | string,
  parent: TreeNodeDTO['id'] | null,
  label: string
}

type TreeNode = TreeNodeDTO & {
  children: TreeNode[]
}