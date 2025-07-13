<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('tools.curl') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('curlTool.description') }}
      </p>
    </div>

    <!-- Input Section -->
    <div class="card p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('curlTool.inputLabel') }}
          </label>
          <textarea
            v-model="inputCurl"
            :placeholder="t('curlTool.inputPlaceholder')"
            class="textarea h-32 font-mono text-sm"
            @input="parseAndFilter"
          ></textarea>
        </div>

        <!-- Filter Options -->
        <div class="border-t pt-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {{ t('curlTool.filterOptions') }}
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.cookies"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.cookies') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.userAgent"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.userAgent') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.referer"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.referer') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.accept"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.accept') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.authorization"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.authorization') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.contentType"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.contentType') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.customHeaders"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.customHeaders') }}</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="filters.data"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                @change="parseAndFilter"
              >
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('curlTool.data') }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Output Section -->
    <div class="card p-6" v-if="outputCurl || parseError">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('curlTool.outputLabel') }}
          </label>
          <div class="flex space-x-2">
            <button
              @click="copyToClipboard"
              :disabled="!outputCurl"
              class="btn btn-secondary text-xs"
            >
              <ClipboardDocumentIcon class="w-4 h-4 mr-1" />
              {{ t('common.copy') }}
            </button>
            <button
              @click="clearAll"
              class="btn btn-ghost text-xs"
            >
              <TrashIcon class="w-4 h-4 mr-1" />
              {{ t('common.clear') }}
            </button>
          </div>
        </div>

        <!-- Error display -->
        <div v-if="parseError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ t('curlTool.parseError') }}
              </h3>
              <p class="text-sm text-red-700 dark:text-red-300 mt-1">{{ parseError }}</p>
            </div>
          </div>
        </div>

        <!-- Parsed curl output -->
        <div v-if="outputCurl">
          <textarea
            v-model="outputCurl"
            readonly
            class="textarea h-32 font-mono text-sm bg-gray-50 dark:bg-gray-700"
          ></textarea>
        </div>

        <!-- Parsed information display -->
        <div v-if="parsedInfo && !parseError" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Method and URL -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('curlTool.method') }}:</span>
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                  {{ parsedInfo.method }}
                </span>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('curlTool.url') }}:</span>
                <p class="text-sm text-gray-900 dark:text-gray-100 font-mono break-all">{{ parsedInfo.url }}</p>
              </div>
            </div>

            <!-- Headers count -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('curlTool.headers') }}:</span>
                <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                  {{ parsedInfo.headerCount }}
                </span>
              </div>
              <div v-if="parsedInfo.hasData" class="flex items-center space-x-2">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('curlTool.hasData') }}:</span>
                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">
                  {{ t('common.yes') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Examples Section -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('curlTool.examples') }}
      </h3>
      <div class="space-y-4">
        <div v-for="(example, index) in examples" :key="index" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ example.title }}</h4>
            <button
              @click="loadExample(example.curl)"
              class="btn btn-ghost text-xs"
            >
              {{ t('curlTool.loadExample') }}
            </button>
          </div>
          <pre class="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 rounded p-2 overflow-x-auto">{{ example.curl }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'
import {
  ClipboardDocumentIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const notifications = useNotificationsStore()

// Reactive data
const inputCurl = ref('')
const outputCurl = ref('')
const parseError = ref('')
const parsedInfo = ref<{
  method: string
  url: string
  headerCount: number
  hasData: boolean
} | null>(null)

// Filter options
const filters = reactive({
  cookies: false,
  userAgent: false,
  referer: false,
  accept: false,
  authorization: true,
  contentType: true,
  customHeaders: false,
  data: true
})

// Example curl commands
const examples = [
  {
    title: 'GET Request with Headers',
    curl: `curl -X GET "https://api.example.com/users" \\
  -H "Authorization: Bearer token123" \\
  -H "Content-Type: application/json" \\
  -H "User-Agent: MyApp/1.0" \\
  -H "Accept: application/json"`
  },
  {
    title: 'POST Request with Data',
    curl: `curl -X POST "https://api.example.com/users" \\
  -H "Authorization: Bearer token123" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","email":"john@example.com"}'`
  },
  {
    title: 'Request with Cookies',
    curl: `curl -X GET "https://example.com/api/data" \\
  -H "Cookie: session=abc123; user_pref=dark_mode" \\
  -H "Referer: https://example.com/" \\
  -H "User-Agent: Mozilla/5.0"`
  }
]

// Parse curl command
function parseCurlCommand(curlStr: string) {
  try {
    parseError.value = ''
    
    if (!curlStr.trim()) {
      outputCurl.value = ''
      parsedInfo.value = null
      return
    }

    // Basic curl command validation
    if (!curlStr.includes('curl')) {
      throw new Error(t('curlTool.errors.notCurlCommand'))
    }

    // Extract URL - look for URL patterns first
    let url = ''
    
    // Try to find URL with quotes
    const quotedUrlMatch = curlStr.match(/["'](https?:\/\/[^"']+)["']/)
    if (quotedUrlMatch) {
      url = quotedUrlMatch[1]
    } else {
      // Try to find URL without quotes
      const unquotedUrlMatch = curlStr.match(/\s(https?:\/\/[^\s\\]+)/)
      if (unquotedUrlMatch) {
        url = unquotedUrlMatch[1]
      } else {
        // Try to find URL after curl command, excluding options
        const curlUrlMatch = curlStr.match(/curl\s+(?:(?:-[^\s]+(?:\s+[^\s-][^\s]*)?)\s+)*(?:["']?)([^\s"'-]+(?:\/[^\s"'\\]*)*)(?:["']?)/)
        if (curlUrlMatch && curlUrlMatch[1].includes('.')) {
          url = curlUrlMatch[1]
        }
      }
    }
    
    if (!url) {
      throw new Error(t('curlTool.errors.noUrlFound'))
    }
    
    // Extract method
    const methodMatch = curlStr.match(/-X\s+(\w+)/)
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET'
    
    // Extract headers
    const headerMatches = curlStr.match(/-H\s+["']([^"']+)["']/g) || []
    const headers: Record<string, string> = {}
    
    headerMatches.forEach(headerMatch => {
      const headerContent = headerMatch.match(/-H\s+["']([^"']+)["']/)?.[1]
      if (headerContent) {
        const [key, ...valueParts] = headerContent.split(':')
        if (key && valueParts.length > 0) {
          headers[key.trim().toLowerCase()] = valueParts.join(':').trim()
        }
      }
    })
    
    // Extract data
    const dataMatch = curlStr.match(/-d\s+["']([^"']+)["']/) ||
                     curlStr.match(/--data\s+["']([^"']+)["']/) ||
                     curlStr.match(/--data-raw\s+["']([^"']+)["']/)
    const hasData = !!dataMatch
    
    // Build filtered curl command
    let filteredCurl = `curl -X ${method} "${url}"`
    
    // Add filtered headers
    const filteredHeaders: string[] = []
    
    Object.entries(headers).forEach(([key, value]) => {
      const headerKey = key.toLowerCase()
      
      if (headerKey.includes('cookie') && !filters.cookies) return
      if (headerKey.includes('user-agent') && !filters.userAgent) return
      if (headerKey.includes('referer') && !filters.referer) return
      if (headerKey.includes('accept') && !filters.accept) return
      if (headerKey.includes('authorization') && !filters.authorization) return
      if (headerKey.includes('content-type') && !filters.contentType) return
      
      // Custom headers filter
      const isStandardHeader = [
        'cookie', 'user-agent', 'referer', 'accept', 
        'authorization', 'content-type', 'host', 'connection'
      ].some(standard => headerKey.includes(standard))
      
      if (!isStandardHeader && !filters.customHeaders) return
      
      filteredHeaders.push(`  -H "${key}: ${value}"`)
    })
    
    if (filteredHeaders.length > 0) {
      filteredCurl += ' \\\n' + filteredHeaders.join(' \\\n')
    }
    
    // Add data if enabled
    if (hasData && filters.data && dataMatch) {
      filteredCurl += ` \\\n  -d '${dataMatch[1]}'`
    }
    
    outputCurl.value = filteredCurl
    parsedInfo.value = {
      method,
      url,
      headerCount: Object.keys(headers).length,
      hasData
    }
    
  } catch (error) {
    parseError.value = error instanceof Error ? error.message : t('curlTool.errors.parseError')
    outputCurl.value = ''
    parsedInfo.value = null
  }
}

// Parse and filter curl command
function parseAndFilter() {
  parseCurlCommand(inputCurl.value)
}

// Copy to clipboard
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(outputCurl.value)
    notifications.showSuccess(
      t('common.copied'),
      t('curlTool.copiedMessage')
    )
  } catch (error) {
    notifications.showError(
      t('common.error'),
      t('common.copyError')
    )
  }
}

// Clear all
function clearAll() {
  inputCurl.value = ''
  outputCurl.value = ''
  parseError.value = ''
  parsedInfo.value = null
}

// Load example
function loadExample(exampleCurl: string) {
  inputCurl.value = exampleCurl
  parseAndFilter()
}
</script>

<style scoped>
/* Component-specific styles */
</style> 