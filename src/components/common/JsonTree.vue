<template>
  <div class="json-tree">
    <JsonTreeNode
      :data="data"
      :key-name="'root'"
      :depth="0"
      :is-root="true"
    />
  </div>
</template>

<script setup lang="ts">
import JsonTreeNode from './JsonTreeNode.vue'

// Props
defineProps<{
  data: any
}>()
</script>

<style scoped>
.json-tree {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
}
</style> 