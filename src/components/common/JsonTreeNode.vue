<template>
  <div class="json-tree-node">
    <div class="flex items-start">
      <!-- Toggle button for objects/arrays -->
      <button
        v-if="isExpandable"
        @click="toggle"
        class="flex-shrink-0 w-4 h-4 mr-1 mt-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ChevronRightIcon v-if="!isExpanded" class="w-4 h-4" />
        <ChevronDownIcon v-else class="w-4 h-4" />
      </button>
      <div v-else class="w-4 mr-1"></div>
      
      <!-- Key name -->
      <span v-if="!isRoot" class="text-blue-600 dark:text-blue-400 mr-2">
        "{{ keyName }}":
      </span>
      
      <!-- Value -->
      <div class="flex-1">
        <!-- Primitive values -->
        <span v-if="!isExpandable" :class="getValueClass(data)">
          {{ formatValue(data) }}
        </span>
        
        <!-- Object/Array preview -->
        <div v-else>
          <span :class="getValueClass(data)">
            {{ getPreview(data) }}
          </span>
          
          <!-- Expanded content -->
          <div v-if="isExpanded" class="ml-4 mt-1 border-l border-gray-200 dark:border-gray-700 pl-4">
            <JsonTreeNode
              v-for="(value, key) in data"
              :key="key"
              :data="value"
              :key-name="key"
              :depth="depth + 1"
              :is-root="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps<{
  data: any
  keyName: string | number
  depth: number
  isRoot?: boolean
}>()

// State
const isExpanded = ref(props.depth < 2) // Auto-expand first 2 levels

// Computed
const isExpandable = computed(() => {
  return typeof props.data === 'object' && props.data !== null
})

// Methods
const toggle = () => {
  isExpanded.value = !isExpanded.value
}

const getValueClass = (value: any) => {
  const type = typeof value
  const classes: Record<string, string> = {
    string: 'text-green-600 dark:text-green-400',
    number: 'text-blue-600 dark:text-blue-400',
    boolean: 'text-purple-600 dark:text-purple-400',
    object: value === null ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300',
    undefined: 'text-gray-500 dark:text-gray-400',
    bigint: 'text-blue-600 dark:text-blue-400',
    symbol: 'text-gray-500 dark:text-gray-400',
    function: 'text-gray-500 dark:text-gray-400'
  }
  return classes[type] || 'text-gray-700 dark:text-gray-300'
}

const formatValue = (value: any) => {
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'undefined') {
    return 'undefined'
  }
  return String(value)
}

const getPreview = (value: any) => {
  if (Array.isArray(value)) {
    return `Array(${value.length})`
  }
  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value)
    return `Object(${keys.length})`
  }
  return String(value)
}
</script>

<style scoped>
.json-tree-node {
  margin-bottom: 2px;
}
</style> 