<script setup lang="ts">
import { markRaw } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule, type ColDef, type AutoGroupColumnDef } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule])

const { loading = false, tree = [] } = defineProps<{
  loading: boolean
  tree: TreeNode[]
}>()

const emit = defineEmits(['ready'])

function onGridReady () {
  emit('ready')
}

const treeColumns = markRaw<ColDef[]>([
  { 
    headerName: '№ п/п',
    valueGetter: (p) => {
      return p.node ? Number(p.node.key) + 1 : ''
    },
    pinned: 'left',
    width: 80
  },
  { 
    headerName: 'Наименование',
    field: 'label',
    flex: 1
  }
])

const autoGroupColumnDef = markRaw<AutoGroupColumnDef>({
  headerName: "Категория",
  field: "label",
  cellRendererParams: {
    suppressCount: true,
  },
  valueGetter: (p) => p.data.children.length > 0 ? 'Группа' : 'Элемент'
});
</script>

<template>
  <ag-grid-vue
    :row-data="tree"
    :column-defs="treeColumns"
    :auto-group-column-def="autoGroupColumnDef"
    :loading="loading"
    :tree-data="true"
    :tree-data-children-field="'children'"
    style="width: 100%; height: 500px"
    @grid-ready="onGridReady"
  />
</template>

<style scoped>

</style>