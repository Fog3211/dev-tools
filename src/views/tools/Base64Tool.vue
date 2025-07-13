<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('base64.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('base64.description') }}
      </p>
    </div>
    
    <!-- Controls -->
    <div class="flex flex-wrap gap-4 justify-center">
      <button
        @click="encode"
        class="btn btn-primary"
        :disabled="!inputText"
      >
        {{ t('common.encode') }}
      </button>
      
      <button
        @click="decode"
        class="btn btn-secondary"
        :disabled="!inputText"
      >
        {{ t('common.decode') }}
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
            @click="pasteFromClipboard"
            class="btn btn-ghost btn-sm"
          >
            {{ t('common.paste') }}
          </button>
        </div>
        
        <textarea
          v-model="inputText"
          :placeholder="t('base64.textPlaceholder')"
          class="textarea h-64 font-mono text-sm"
        ></textarea>
      </div>
      
      <!-- Output -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('common.output') }}
          </h2>
          <button
            @click="copyToClipboard"
            class="btn btn-ghost btn-sm"
            :disabled="!outputText"
          >
            {{ t('common.copy') }}
          </button>
        </div>
        
        <div class="relative">
          <textarea
            v-model="outputText"
            readonly
            class="textarea h-64 font-mono text-sm bg-gray-50 dark:bg-gray-700"
            :placeholder="operation === 'encode' ? t('base64.encodedResult') : t('base64.decodedResult')"
          ></textarea>
        </div>
      </div>
    </div>
    
    <!-- File Upload -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('base64.fileInput') }}
      </h3>
      
      <div class="space-y-4">
        <div
          @drop="handleFileDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
        >
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div class="space-y-2">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('common.dropFile') }}
            </p>
            <button
              @click="fileInput?.click()"
              class="btn btn-secondary"
            >
              {{ t('base64.selectFile') }}
            </button>
          </div>
        </div>
        
        <div v-if="selectedFile" class="text-sm text-gray-600 dark:text-gray-300">
          <p><strong>{{ t('common.fileName') }}:</strong> {{ selectedFile.name }}</p>
          <p><strong>{{ t('common.fileSize') }}:</strong> {{ formatFileSize(selectedFile.size) }}</p>
          <p><strong>{{ t('common.fileType') }}:</strong> {{ selectedFile.type || 'Unknown' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'
import { Base64 } from 'js-base64'

// Composables
const { t } = useI18n()
const notifications = useNotificationsStore()

// State
const inputText = ref('')
const outputText = ref('')
const operation = ref<'encode' | 'decode'>('encode')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

// Methods
const encode = () => {
  try {
    outputText.value = Base64.encode(inputText.value)
    operation.value = 'encode'
    notifications.showSuccess(t('common.success'))
  } catch (error) {
    notifications.showError(t('common.error'), 'Failed to encode')
  }
}

const decode = () => {
  try {
    outputText.value = Base64.decode(inputText.value)
    operation.value = 'decode'
    notifications.showSuccess(t('common.success'))
  } catch (error) {
    notifications.showError(t('common.error'), 'Failed to decode')
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  selectedFile.value = null
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    notifications.showSuccess(t('common.copied'))
  } catch (error) {
    notifications.showError(t('common.error'), 'Failed to paste from clipboard')
  }
}

const copyToClipboard = async () => {
  if (!outputText.value) return
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    notifications.showSuccess(t('common.copied'))
  } catch (error) {
    notifications.showError(t('common.error'), 'Failed to copy to clipboard')
  }
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
    processFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) {
    selectedFile.value = file
    processFile(file)
  }
}

const processFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (result) {
      // Convert to base64
      const base64 = btoa(result as string)
      outputText.value = base64
      operation.value = 'encode'
      notifications.showSuccess(t('base64.fileEncoded'))
    }
  }
  reader.readAsBinaryString(file)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
/* Component-specific styles */
</style> 