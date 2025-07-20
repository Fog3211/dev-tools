<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('imageUploadCdn.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('imageUploadCdn.description') }}
      </p>
    </div>
    
    <!-- Upload Area -->
    <div class="space-y-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('imageUploadCdn.uploadArea') }}
        </h3>
        
        <div
          @drop="handleFileDrop"
          @dragover.prevent
          @dragenter.prevent
          @dragleave="isDragOver = false"
          @dragend="isDragOver = false"
          class="border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200"
          :class="[
            isDragOver 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          ]"
        >
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div class="space-y-4">
            <div class="mx-auto w-16 h-16 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            
            <div class="space-y-2">
              <p class="text-lg text-gray-700 dark:text-gray-300">
                {{ t('imageUploadCdn.dragDropText') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('imageUploadCdn.pasteText') }}
              </p>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{{ t('imageUploadCdn.supportedFormats') }}</p>
              <p>{{ t('imageUploadCdn.maxFileSize') }}</p>
            </div>
            
            <button
              @click="fileInput?.click()"
              class="btn btn-primary"
            >
              {{ t('imageUploadCdn.selectFiles') }}
            </button>
          </div>
        </div>
        
        <!-- File List -->
        <div v-if="selectedFiles.length > 0" class="mt-6 space-y-4">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ t('common.selectedFiles') }} ({{ selectedFiles.length }})
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(file, index) in selectedFiles"
              :key="`${file.name}-${index}`"
              class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div class="space-y-3">
                <!-- Image Preview -->
                <div class="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                     @click="openImageModal(file)">
                  <img
                    v-if="file.preview"
                    :src="file.preview"
                    :alt="file.name"
                    class="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <!-- Click hint overlay -->
                  <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                    </svg>
                  </div>
                </div>
                
                <!-- File Info -->
                <div class="text-sm space-y-1">
                  <p class="font-medium text-gray-900 dark:text-white truncate" :title="file.name">
                    {{ file.name }}
                  </p>
                  <p class="text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                  <p v-if="file.dimensions" class="text-gray-500 dark:text-gray-400">
                    {{ file.dimensions.width }} × {{ file.dimensions.height }}
                  </p>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-between">
                  <button
                    @click="removeFile(index)"
                    class="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                  >
                    {{ t('common.remove') }}
                  </button>
                  
                  <div v-if="file.status" class="flex items-center text-sm">
                    <span v-if="file.status === 'uploading'" class="text-blue-600 dark:text-blue-400">
                      {{ t('imageUploadCdn.uploading') }}
                    </span>
                    <span v-else-if="file.status === 'success'" class="text-green-600 dark:text-green-400">
                      {{ t('imageUploadCdn.uploadSuccess') }}
                    </span>
                    <span v-else-if="file.status === 'error'" class="text-red-600 dark:text-red-400">
                      {{ t('imageUploadCdn.errors.uploadFailed') }}
                    </span>
                  </div>
                </div>
                
                <!-- CDN URL -->
                <div v-if="file.cdnUrl" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('imageUploadCdn.cdnUrl') }}
                  </label>
                  <div class="flex">
                    <input
                      :value="file.cdnUrl"
                      readonly
                      class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      @click="copyToClipboard(file.cdnUrl)"
                      class="px-3 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 text-sm"
                    >
                      {{ t('imageUploadCdn.copyUrl') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upload Button -->
        <div v-if="selectedFiles.length > 0" class="mt-6 flex justify-center space-x-4">
          <button
            @click="uploadFiles"
            :disabled="isUploading || selectedFiles.every(f => f.status === 'success')"
            class="btn btn-primary"
          >
            <span v-if="isUploading">{{ t('imageUploadCdn.uploading') }}</span>
            <span v-else>{{ t('imageUploadCdn.uploadButton') }}</span>
          </button>
          
          <button
            @click="clearFiles"
            class="btn btn-secondary"
          >
            {{ t('common.clear') }}
          </button>
        </div>
      </div>
      
      <!-- Upload History -->
      <div v-if="uploadHistory.length > 0" class="card p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('imageUploadCdn.uploadHistory') }}
          </h3>
          <button
            @click="clearHistory"
            class="btn btn-ghost btn-sm"
          >
            {{ t('imageUploadCdn.clearHistory') }}
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(item, index) in uploadHistory"
            :key="`history-${index}`"
            class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <img
                v-if="item.thumbnail"
                :src="item.thumbnail"
                :alt="item.fileName"
                class="w-10 h-10 object-cover rounded"
              />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ item.fileName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(item.uploadTime) }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                @click="copyToClipboard(item.cdnUrl)"
                class="btn btn-ghost btn-sm"
              >
                {{ t('imageUploadCdn.copyUrl') }}
              </button>
              <a
                :href="item.cdnUrl"
                target="_blank"
                class="btn btn-ghost btn-sm"
              >
                {{ t('common.preview') }}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="card p-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">
          {{ t('imageUploadCdn.noHistory') }}
        </p>
      </div>
    </div>
    
    <!-- Image Modal -->
    <div v-if="selectedImageModal" class="fixed inset-0 z-50 overflow-y-auto" @click="closeImageModal">
      <div class="flex items-center justify-center min-h-screen px-4 text-center">
        <div class="fixed inset-0 bg-black opacity-75 transition-opacity"></div>
        
        <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden" @click.stop>
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ selectedImageModal.name }}
            </h3>
            <button
              @click="closeImageModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Modal Content -->
          <div class="p-4">
            <div class="space-y-4">
              <!-- Full Size Image -->
              <div class="flex justify-center">
                <img
                  :src="selectedImageModal.originalPreview || selectedImageModal.preview"
                  :alt="selectedImageModal.name"
                  class="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>
              
              <!-- Image Details -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('common.fileName') }}:</span>
                  <p class="text-gray-600 dark:text-gray-400 truncate">{{ selectedImageModal.name }}</p>
                </div>
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('common.fileSize') }}:</span>
                  <p class="text-gray-600 dark:text-gray-400">{{ formatFileSize(selectedImageModal.size) }}</p>
                </div>
                <div v-if="selectedImageModal.dimensions">
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('imageUploadCdn.dimensions') }}:</span>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ selectedImageModal.dimensions.width }} × {{ selectedImageModal.dimensions.height }}
                  </p>
                </div>
                <div>
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('imageUploadCdn.format') }}:</span>
                  <p class="text-gray-600 dark:text-gray-400">{{ selectedImageModal.file.type }}</p>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex justify-center space-x-4">
                <button
                  v-if="selectedImageModal.cdnUrl"
                  @click="copyToClipboard(selectedImageModal.cdnUrl)"
                  class="btn btn-primary btn-sm"
                >
                  {{ t('imageUploadCdn.copyUrl') }}
                </button>
                <button
                  @click="downloadImage(selectedImageModal)"
                  class="btn btn-secondary btn-sm"
                >
                  {{ t('imageUploadCdn.downloadImage') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'

// Types
interface FileItem {
  file: File
  name: string
  size: number
  preview?: string
  originalPreview?: string
  dimensions?: { width: number; height: number }
  status?: 'uploading' | 'success' | 'error'
  cdnUrl?: string
}

interface HistoryItem {
  fileName: string
  cdnUrl: string
  thumbnail?: string
  uploadTime: Date
}

// Composables
const { t } = useI18n()
const notifications = useNotificationsStore()

// State
const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<FileItem[]>([])
const uploadHistory = ref<HistoryItem[]>([])
const isDragOver = ref(false)
const isUploading = ref(false)
const selectedImageModal = ref<FileItem | null>(null)

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Methods
const validateFile = (file: File): boolean => {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    notifications.showError(
      t('imageUploadCdn.errors.invalidFileType'),
      `${file.name} is not a supported image format`
    )
    return false
  }
  
  if (file.size > MAX_FILE_SIZE) {
    notifications.showError(
      t('imageUploadCdn.errors.fileTooLarge'),
      `${file.name} exceeds the maximum file size limit`
    )
    return false
  }
  
  return true
}

const createImagePreview = (file: File): Promise<FileItem> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        // 原始图片的预览（用于模态窗口）
        const originalPreview = e.target?.result as string
        
        // 计算新的尺寸（如果需要压缩）
        let { width, height } = img
        const maxDimension = 1920 // 最大尺寸限制
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width
            width = maxDimension
          } else {
            width = (width * maxDimension) / height
            height = maxDimension
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        // 获取压缩后的预览图
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        const fileItem: FileItem = {
          file,
          name: file.name,
          size: file.size,
          preview: compressedDataUrl,
          originalPreview: originalPreview,
          dimensions: {
            width: img.width,
            height: img.height
          }
        }
        resolve(fileItem)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

const processFiles = async (files: FileList) => {
  const validFiles = Array.from(files).filter(validateFile)
  
  for (const file of validFiles) {
    const fileItem = await createImagePreview(file)
    selectedFiles.value.push(fileItem)
  }
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    processFiles(files)
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files) {
    processFiles(files)
  }
}

const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return
  
  for (const item of Array.from(items)) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file && validateFile(file)) {
        const fileItem = await createImagePreview(file)
        selectedFiles.value.push(fileItem)
        notifications.showInfo(t('common.success'), `Pasted image: ${file.name}`)
      }
    }
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
  selectedFiles.value = []
}

// 这里是CDN上传的模拟实现，实际项目中需要替换为真实的CDN服务
const uploadTocdn = async (file: File): Promise<string> => {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // 实际项目中可以集成免费图床服务，例如：
  
  // 1. ImgBB API (免费)
  // const formData = new FormData()
  // formData.append('image', file)
  // const response = await fetch('https://api.imgbb.com/1/upload?key=YOUR_API_KEY', {
  //   method: 'POST',
  //   body: formData
  // })
  // const data = await response.json()
  // return data.data.url
  
  // 2. Cloudinary (有免费额度)
  // const formData = new FormData()
  // formData.append('file', file)
  // formData.append('upload_preset', 'YOUR_PRESET')
  // const response = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
  //   method: 'POST',
  //   body: formData
  // })
  // const data = await response.json()
  // return data.secure_url
  
  // 3. 七牛云或阿里云OSS等国内云服务
  // 需要配置相应的SDK和上传策略
  
  // 模拟生成CDN URL（实际应该调用真实的CDN API）
  const mockCdnUrl = `https://cdn.example.com/images/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  
  // 模拟可能的错误情况（10%概率失败）
  if (Math.random() < 0.1) {
    throw new Error('Upload failed')
  }
  
  return mockCdnUrl
}

const uploadFiles = async () => {
  isUploading.value = true
  
  try {
    const uploadPromises = selectedFiles.value
      .filter(fileItem => !fileItem.status || fileItem.status === 'error')
      .map(async (fileItem) => {
        fileItem.status = 'uploading'
        
        try {
          const cdnUrl = await uploadTocdn(fileItem.file)
          fileItem.cdnUrl = cdnUrl
          fileItem.status = 'success'
          
          // Add to history
          uploadHistory.value.unshift({
            fileName: fileItem.name,
            cdnUrl,
            thumbnail: fileItem.preview,
            uploadTime: new Date()
          })
          
          // Save to localStorage
          saveHistoryToStorage()
          
          notifications.showSuccess(
            t('imageUploadCdn.uploadSuccess'),
            `${fileItem.name} uploaded successfully`
          )
        } catch (error) {
          fileItem.status = 'error'
          notifications.showError(
            t('imageUploadCdn.errors.uploadFailed'),
            `Failed to upload ${fileItem.name}`
          )
        }
      })
    
    await Promise.all(uploadPromises)
  } catch (error) {
    notifications.showError(
      t('imageUploadCdn.errors.networkError'),
      'Failed to upload files'
    )
  } finally {
    isUploading.value = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    notifications.showSuccess(t('common.copied'), 'URL copied to clipboard')
  } catch (error) {
    notifications.showError(t('common.error'), 'Failed to copy to clipboard')
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  return date.toLocaleString()
}

const saveHistoryToStorage = () => {
  try {
    localStorage.setItem('imageUploadHistory', JSON.stringify(uploadHistory.value))
  } catch (error) {
    console.warn('Failed to save upload history to localStorage')
  }
}

const loadHistoryFromStorage = () => {
  try {
    const saved = localStorage.getItem('imageUploadHistory')
    if (saved) {
      const parsed = JSON.parse(saved)
      uploadHistory.value = parsed.map((item: any) => ({
        ...item,
        uploadTime: new Date(item.uploadTime)
      }))
    }
  } catch (error) {
    console.warn('Failed to load upload history from localStorage')
  }
}

const clearHistory = () => {
  uploadHistory.value = []
  localStorage.removeItem('imageUploadHistory')
  notifications.showInfo(t('common.success'), 'Upload history cleared')
}

// Modal window methods
const openImageModal = (fileItem: FileItem) => {
  selectedImageModal.value = fileItem
}

const closeImageModal = () => {
  selectedImageModal.value = null
}

const downloadImage = (fileItem: FileItem) => {
  const link = document.createElement('a')
  link.href = fileItem.originalPreview || fileItem.preview || ''
  link.download = fileItem.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  notifications.showSuccess(t('common.success'), `Downloaded ${fileItem.name}`)
}

// Event listeners
onMounted(() => {
  loadHistoryFromStorage()
  document.addEventListener('paste', handlePaste)
  document.addEventListener('dragover', (e) => {
    e.preventDefault()
    isDragOver.value = true
  })
  document.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget) {
      isDragOver.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
  document.removeEventListener('dragover', () => {})
  document.removeEventListener('dragleave', () => {})
})
</script>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>