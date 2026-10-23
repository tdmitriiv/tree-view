import { shallowRef } from 'vue'
import { useFetch } from '@vueuse/core'
import useTree from './useTree'
import delay from '@/utils/delay'

export default function useItemService () {
  const { tree, setItems } = useTree()

  const loading = shallowRef(false)

  const { data, error, execute } = useFetch<TreeNodeDTO[]>(
    '/data.json', { immediate: false }
  ).get().json()

  const fetchItems = async () => {
    loading.value = true
    
    try {
      await delay(2000)
      await execute()
      if (data.value) {
        setItems(data.value)
      }
    } finally {
      loading.value =false
    }
  }

  return {
    tree,
    fetchItems,
    loading
  }
}
