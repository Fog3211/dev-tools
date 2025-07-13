<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('tools.curlBuilder') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('curlBuilder.description') }}
      </p>
    </div>

    <!-- Configuration Section -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('curlBuilder.requestConfig') }}
      </h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Configuration -->
        <div class="space-y-4">
          <!-- Method and URL -->
          <div class="space-y-3">
            <div class="flex space-x-3">
              <div class="w-32">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('curlBuilder.method') }}
                </label>
                <select 
                  v-model="request.method" 
                  class="input text-sm"
                  @change="generateCurl"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ t('curlBuilder.url') }}
                </label>
                <input
                  v-model="request.url"
                  type="url"
                  :placeholder="t('curlBuilder.urlPlaceholder')"
                  class="input w-full"
                  @input="generateCurl"
                />
              </div>
            </div>
          </div>

          <!-- Headers -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('curlBuilder.headers') }}
              </label>
              <button
                @click="addHeader"
                class="btn btn-ghost text-xs"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                {{ t('curlBuilder.addHeader') }}
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(header, index) in request.headers"
                :key="index"
                class="flex space-x-2"
              >
                <input
                  v-model="header.key"
                  :placeholder="t('curlBuilder.headerKey')"
                  class="input flex-1 text-sm"
                  @input="generateCurl"
                />
                <input
                  v-model="header.value"
                  :placeholder="t('curlBuilder.headerValue')"
                  class="input flex-1 text-sm"
                  @input="generateCurl"
                />
                <button
                  @click="removeHeader(index)"
                  class="btn btn-ghost text-xs p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Query Parameters -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('curlBuilder.queryParams') }}
              </label>
              <button
                @click="addQueryParam"
                class="btn btn-ghost text-xs"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                {{ t('curlBuilder.addParam') }}
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(param, index) in request.queryParams"
                :key="index"
                class="flex space-x-2"
              >
                <input
                  v-model="param.key"
                  :placeholder="t('curlBuilder.paramKey')"
                  class="input flex-1 text-sm"
                  @input="generateCurl"
                />
                <input
                  v-model="param.value"
                  :placeholder="t('curlBuilder.paramValue')"
                  class="input flex-1 text-sm"
                  @input="generateCurl"
                />
                <button
                  @click="removeQueryParam(index)"
                  class="btn btn-ghost text-xs p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Data/Body Section -->
        <div class="space-y-4">
          <!-- Body Type Selection -->
          <div v-if="methodSupportsBody">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('curlBuilder.bodyType') }}
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="request.bodyType"
                  type="radio"
                  value="none"
                  class="mr-2"
                  @change="generateCurl"
                />
                {{ t('curlBuilder.noBody') }}
              </label>
              <label class="flex items-center">
                <input
                  v-model="request.bodyType"
                  type="radio"
                  value="json"
                  class="mr-2"
                  @change="generateCurl"
                />
                JSON
              </label>
              <label class="flex items-center">
                <input
                  v-model="request.bodyType"
                  type="radio"
                  value="form"
                  class="mr-2"
                  @change="generateCurl"
                />
                {{ t('curlBuilder.formData') }}
              </label>
              <label class="flex items-center">
                <input
                  v-model="request.bodyType"
                  type="radio"
                  value="raw"
                  class="mr-2"
                  @change="generateCurl"
                />
                {{ t('curlBuilder.rawText') }}
              </label>
            </div>
          </div>

          <!-- JSON Body -->
          <div v-if="methodSupportsBody && request.bodyType === 'json'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('curlBuilder.jsonBody') }}
            </label>
            <textarea
              v-model="request.jsonBody"
              :placeholder="t('curlBuilder.jsonPlaceholder')"
              class="textarea h-48 font-mono text-sm"
              @input="generateCurl"
            ></textarea>
            <div class="flex space-x-2 mt-2">
              <button
                @click="formatJson"
                class="btn btn-ghost text-xs"
                :disabled="!request.jsonBody"
              >
                {{ t('curlBuilder.formatJson') }}
              </button>
              <button
                @click="pasteJson"
                class="btn btn-ghost text-xs"
              >
                {{ t('common.paste') }}
              </button>
            </div>
          </div>

          <!-- Form Data -->
          <div v-if="methodSupportsBody && request.bodyType === 'form'">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('curlBuilder.formData') }}
              </label>
              <button
                @click="addFormField"
                class="btn btn-ghost text-xs"
              >
                <PlusIcon class="w-4 h-4 mr-1" />
                {{ t('curlBuilder.addField') }}
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(field, index) in request.formData"
                :key="index"
                class="flex space-x-2"
              >
                <input
                  v-model="field.key"
                  :placeholder="t('curlBuilder.fieldKey')"
                  class="input flex-1 text-sm"
                  @input="generateCurl"
                />
                <input
                  v-model="field.value"
                  :placeholder="t('curlBuilder.fieldValue')"
                  class="input flex-1 text-sm"
                  @input="generateCurl"
                />
                <button
                  @click="removeFormField(index)"
                  class="btn btn-ghost text-xs p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Raw Text Body -->
          <div v-if="methodSupportsBody && request.bodyType === 'raw'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('curlBuilder.rawBody') }}
            </label>
            <textarea
              v-model="request.rawBody"
              :placeholder="t('curlBuilder.rawPlaceholder')"
              class="textarea h-48 font-mono text-sm"
              @input="generateCurl"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-4 justify-center">
      <button
        @click="generateCurl"
        class="btn btn-primary"
      >
        <CommandLineIcon class="w-4 h-4 mr-2" />
        {{ t('curlBuilder.generate') }}
      </button>
      
      <button
        @click="clearAll"
        class="btn btn-ghost"
      >
        <TrashIcon class="w-4 h-4 mr-2" />
        {{ t('common.clear') }}
      </button>
      
      <button
        @click="loadExample"
        class="btn btn-secondary"
      >
        <DocumentDuplicateIcon class="w-4 h-4 mr-2" />
        {{ t('curlBuilder.loadExample') }}
      </button>
    </div>

    <!-- Generated cURL Output -->
    <div v-if="generatedCurl" class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('curlBuilder.generatedCurl') }}
      </h3>
      
      <CodeBlock
        :content="generatedCurl"
        language="bash"
        :title="t('curlBuilder.curlCommand')"
        height="lg"
        :show-copy="true"
        :show-copy-text="true"
        :show-stats="true"
        :copy-success-message="t('curlBuilder.curlCopied')"
      />
    </div>

    <!-- Examples Section -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('curlBuilder.examples') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(example, index) in examples"
          :key="index"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          @click="loadExampleData(example)"
        >
          <div class="flex items-start justify-between mb-2">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ example.title }}</h4>
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
              {{ example.method }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ example.description }}</p>
          <code class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
            {{ example.url }}
          </code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'
import CodeBlock from '@/components/common/CodeBlock.vue'
import {
  PlusIcon,
  TrashIcon,
  CommandLineIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

// Composables
const { t } = useI18n()
const { pasteFromClipboard } = useCopyToClipboard()

// Types
interface HeaderParam {
  key: string
  value: string
}

interface QueryParam {
  key: string
  value: string
}

interface FormField {
  key: string
  value: string
}

interface RequestConfig {
  method: string
  url: string
  headers: HeaderParam[]
  queryParams: QueryParam[]
  bodyType: 'none' | 'json' | 'form' | 'raw'
  jsonBody: string
  formData: FormField[]
  rawBody: string
}

// State
const request = reactive<RequestConfig>({
  method: 'GET',
  url: '',
  headers: [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'User-Agent', value: 'curl/7.68.0' }
  ],
  queryParams: [],
  bodyType: 'none',
  jsonBody: '',
  formData: [],
  rawBody: ''
})

const generatedCurl = ref('')

// Computed
const methodSupportsBody = computed(() => {
  return ['POST', 'PUT', 'PATCH'].includes(request.method)
})

// Examples data
const examples = [
  {
    title: t('curlBuilder.examples.jsonPost', 'JSON POST Request'),
    description: t('curlBuilder.examples.jsonPostDesc', 'Create a new user with JSON data'),
    method: 'POST',
    url: 'https://api.example.com/users',
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer your-token-here' }
    ],
    bodyType: 'json',
    jsonBody: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }, null, 2)
  },
  {
    title: t('curlBuilder.examples.getWithParams', 'GET with Query Parameters'),
    description: t('curlBuilder.examples.getWithParamsDesc', 'Fetch users with pagination'),
    method: 'GET',
    url: 'https://api.example.com/users',
    queryParams: [
      { key: 'page', value: '1' },
      { key: 'limit', value: '10' },
      { key: 'sort', value: 'name' }
    ],
    headers: [
      { key: 'Authorization', value: 'Bearer your-token-here' }
    ]
  },
  {
    title: t('curlBuilder.examples.formPost', 'Form Data POST'),
    description: t('curlBuilder.examples.formPostDesc', 'Submit form data'),
    method: 'POST',
    url: 'https://api.example.com/submit',
    bodyType: 'form',
    formData: [
      { key: 'username', value: 'johndoe' },
      { key: 'password', value: 'secret123' },
      { key: 'remember', value: 'true' }
    ]
  },
  {
    title: t('curlBuilder.examples.deleteRequest', 'DELETE Request'),
    description: t('curlBuilder.examples.deleteRequestDesc', 'Delete a specific resource'),
    method: 'DELETE',
    url: 'https://api.example.com/users/123',
    headers: [
      { key: 'Authorization', value: 'Bearer your-token-here' }
    ]
  }
]

// Methods
const addHeader = () => {
  request.headers.push({ key: '', value: '' })
}

const removeHeader = (index: number) => {
  request.headers.splice(index, 1)
  generateCurl()
}

const addQueryParam = () => {
  request.queryParams.push({ key: '', value: '' })
}

const removeQueryParam = (index: number) => {
  request.queryParams.splice(index, 1)
  generateCurl()
}

const addFormField = () => {
  request.formData.push({ key: '', value: '' })
}

const removeFormField = (index: number) => {
  request.formData.splice(index, 1)
  generateCurl()
}

const generateCurl = () => {
  if (!request.url.trim()) {
    generatedCurl.value = ''
    return
  }

  let curl = `curl -X ${request.method}`
  
  // Build URL with query parameters
  let finalUrl = request.url
  const validParams = request.queryParams.filter(p => p.key.trim() && p.value.trim())
  if (validParams.length > 0) {
    const params = validParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
    const separator = finalUrl.includes('?') ? '&' : '?'
    finalUrl += separator + params.join('&')
  }
  
  curl += ` "${finalUrl}"`
  
  // Add headers
  const validHeaders = request.headers.filter(h => h.key.trim() && h.value.trim())
  validHeaders.forEach(header => {
    curl += ` \\\n  -H "${header.key}: ${header.value}"`
  })
  
  // Add body data
  if (methodSupportsBody.value && request.bodyType !== 'none') {
    if (request.bodyType === 'json' && request.jsonBody.trim()) {
      // Ensure Content-Type is set for JSON
      const hasContentType = validHeaders.some(h => h.key.toLowerCase() === 'content-type')
      if (!hasContentType) {
        curl += ` \\\n  -H "Content-Type: application/json"`
      }
      const escapedJson = request.jsonBody.replace(/"/g, '\\"')
      curl += ` \\\n  -d "${escapedJson}"`
    } else if (request.bodyType === 'form') {
      const validFormData = request.formData.filter(f => f.key.trim() && f.value.trim())
      if (validFormData.length > 0) {
        validFormData.forEach(field => {
          curl += ` \\\n  -d "${field.key}=${field.value}"`
        })
      }
    } else if (request.bodyType === 'raw' && request.rawBody.trim()) {
      const escapedBody = request.rawBody.replace(/"/g, '\\"')
      curl += ` \\\n  -d "${escapedBody}"`
    }
  }
  
  generatedCurl.value = curl
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(request.jsonBody)
    request.jsonBody = JSON.stringify(parsed, null, 2)
    generateCurl()
  } catch (error) {
    // Invalid JSON, do nothing
  }
}

const pasteJson = async () => {
  const text = await pasteFromClipboard()
  if (text) {
    request.jsonBody = text
    generateCurl()
  }
}

const clearAll = () => {
  request.method = 'GET'
  request.url = ''
  request.headers = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'User-Agent', value: 'curl/7.68.0' }
  ]
  request.queryParams = []
  request.bodyType = 'none'
  request.jsonBody = ''
  request.formData = []
  request.rawBody = ''
  generatedCurl.value = ''
}

const loadExample = () => {
  loadExampleData(examples[0])
}

const loadExampleData = (example: any) => {
  request.method = example.method
  request.url = example.url
  request.headers = [...example.headers]
  request.queryParams = [...(example.queryParams || [])]
  request.bodyType = example.bodyType || 'none'
  request.jsonBody = example.jsonBody || ''
  request.formData = [...(example.formData || [])]
  request.rawBody = example.rawBody || ''
  generateCurl()
}

// Initialize
generateCurl()
</script>

<style scoped>
/* Component-specific styles */
</style> 