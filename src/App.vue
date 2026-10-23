<script setup lang="ts">
import useItemService from '@/composables/useItemService'
import AgTree from '@/components/AgTree.vue'

const { fetchItems, loading, tree } = useItemService()
</script>

<template>
  <ag-tree
    :loading="loading"
    :tree="tree"
    @ready="fetchItems"
  />
</template>

<style scoped></style>
