import TreeStore from '@/utils/TreeStore';
import { computed, ref } from 'vue';

export default function useTree () {
  const treeStore = new TreeStore([])
  const tree = ref<TreeNode[]>([])

  const setItems = (items: TreeNodeDTO[]) => {
    treeStore.setItems(items)
    tree.value = treeStore.buildTree()
  }

  return {
    tree,
    setItems
  }
}