<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('json.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('json.description') }}
      </p>
    </div>
    
    <!-- Controls -->
    <div class="flex flex-wrap gap-4 justify-center">
      <button
        @click="formatJson"
        class="btn btn-primary"
        :disabled="!inputJson"
      >
        {{ t('json.beautify') }}
      </button>
      
      <button
        @click="minifyJson"
        class="btn btn-secondary"
        :disabled="!inputJson"
      >
        {{ t('json.minify') }}
      </button>
      
      <button
        @click="validateJson"
        class="btn btn-secondary"
        :disabled="!inputJson"
      >
        {{ t('json.validate') }}
      </button>
      
      <button
        @click="clearAll"
        class="btn btn-ghost"
      >
        {{ t('common.clear') }}
      </button>
    </div>
    
    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('common.input') }}
          </h2>
          <button
            @click="handlePaste"
            class="btn btn-ghost btn-sm"
          >
            {{ t('common.paste') }}
          </button>
        </div>
        
        <div class="relative">
          <textarea
            v-model="inputJson"
            :placeholder="t('json.placeholder')"
            class="textarea h-96 font-mono text-sm"
            @input="handleInput"
          ></textarea>
          
          <!-- Character count -->
          <div class="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400">
            {{ inputJson.length }} characters
          </div>
        </div>
      </div>
      
      <!-- Output -->
      <div class="space-y-4">
        <CodeBlock
          :content="outputJson"
          language="json"
          :title="t('common.output')"
          height="xl"
          :placeholder="t('json.formatted')"
          :show-copy="true"
          :show-copy-text="true"
          :show-stats="true"
          :copy-success-message="t('json.copiedMessage', 'JSON copied to clipboard')"
        />
      </div>
    </div>
    
    <!-- Validation Status -->
    <div v-if="validationStatus" class="card p-4">
      <div class="flex items-center">
        <CheckCircleIcon
          v-if="validationStatus.isValid"
          class="w-5 h-5 text-green-500 mr-2"
        />
        <XCircleIcon
          v-else
          class="w-5 h-5 text-red-500 mr-2"
        />
        <span
          :class="[
            'font-medium',
            validationStatus.isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
          ]"
        >
          {{ validationStatus.isValid ? t('json.valid') : t('json.invalid') }}
        </span>
      </div>
      
      <div v-if="validationStatus.error" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ validationStatus.error }}
      </div>
    </div>
    
    <!-- JSON Tree View -->
    <div v-if="jsonTree" class="card p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('json.tree') }}
      </h3>
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto max-h-96">
        <JsonTree :data="jsonTree" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import JsonTree from '@/components/common/JsonTree.vue'
import CodeBlock from '@/components/common/CodeBlock.vue'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'

// Composables
const { t } = useI18n()
const notifications = useNotificationsStore()

// State
const inputJson = ref('')
const outputJson = ref('')
const validationStatus = ref<{
  isValid: boolean
  error?: string
} | null>(null)
const jsonTree = ref<any>(null)

// Composables
const { pasteFromClipboard, copyToClipboard } = useCopyToClipboard()

// Methods
const formatJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, 2)
    jsonTree.value = parsed
    validationStatus.value = { isValid: true }
    notifications.showSuccess(t('json.formatted'))
  } catch (error) {
    validationStatus.value = {
      isValid: false,
      error: (error as Error).message
    }
    notifications.showError(t('common.error'), t('common.invalidInput'))
  }
}

const minifyJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
    jsonTree.value = parsed
    validationStatus.value = { isValid: true }
    notifications.showSuccess(t('json.minified'))
  } catch (error) {
    validationStatus.value = {
      isValid: false,
      error: (error as Error).message
    }
    notifications.showError(t('common.error'), t('common.invalidInput'))
  }
}

const validateJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value)
    jsonTree.value = parsed
    validationStatus.value = { isValid: true }
    notifications.showSuccess(t('json.valid'))
  } catch (error) {
    validationStatus.value = {
      isValid: false,
      error: (error as Error).message
    }
    notifications.showError(t('json.invalid'), (error as Error).message)
  }
}

const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  validationStatus.value = null
  jsonTree.value = null
}

const handlePaste = async () => {
  const text = await pasteFromClipboard()
  if (text) {
    inputJson.value = text
  }
}

const handleCopy = async () => {
  if (outputJson.value) {
    await copyToClipboard(outputJson.value, t('json.copiedMessage', 'JSON copied to clipboard'))
  }
}

const handleInput = () => {
  // Clear validation status when input changes
  validationStatus.value = null
  jsonTree.value = null
}
</script>

<style scoped>
/* Component-specific styles */
</style> 