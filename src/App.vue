<script setup lang="ts">
import useItemService from '@/composables/useItemService'

const { fetchItems, loading, tree } = useItemService()
</script>

<template>
  <h1>You did it!</h1>
  isFetching {{ loading }}
  <pre>{{ tree }}</pre>
  <button @click="fetchItems">load</button>
</template>

<style scoped></style>
