<template>
  <div class="code-block-container">
    <!-- Header with title and action buttons -->
    <div 
      v-if="title || showCopy || $slots.actions"
      class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg"
    >
      <div class="flex items-center space-x-2">
        <h4 v-if="title" class="text-sm font-medium text-gray-900 dark:text-white">
          {{ title }}
        </h4>
        <span
          v-if="language"
          class="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
        >
          {{ language.toUpperCase() }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Custom action buttons slot -->
        <slot name="actions"></slot>
        
        <!-- Copy button -->
        <button
          v-if="showCopy && content"
          @click="handleCopy"
          :disabled="!content"
          class="btn btn-ghost text-xs p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :title="copyButtonTitle"
        >
          <ClipboardDocumentIcon class="w-4 h-4" />
          <span v-if="showCopyText" class="ml-1">{{ $t('common.copy') }}</span>
        </button>
      </div>
    </div>
    
    <!-- Code content -->
    <div 
      :class="[
        'relative',
        title || showCopy || $slots.actions ? 'rounded-b-lg' : 'rounded-lg'
      ]"
    >
      <!-- Highlighted code display -->
      <div
        v-if="content && enableHighlight"
        :class="[
          'code-block overflow-auto font-mono text-sm leading-relaxed',
          heightClass,
          paddingClass,
          backgroundClass
        ]"
        v-html="highlightedContent"
      ></div>
      
      <!-- Plain text display (fallback or when highlighting disabled) -->
      <pre
        v-else-if="content"
        :class="[
          'code-block overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap',
          heightClass,
          paddingClass,
          backgroundClass,
          'text-gray-900 dark:text-gray-100'
        ]"
      >{{ content }}</pre>
      
      <!-- Empty state -->
      <div
        v-else
        :class="[
          'flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600',
          heightClass,
          'rounded-lg'
        ]"
      >
        <div class="text-center">
          <CodeBracketIcon class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">{{ placeholder || $t('codeBlock.placeholder', 'No code to display') }}</p>
        </div>
      </div>
      
      <!-- Copy overlay for quick copy (when not showing header) -->
      <button
        v-if="showCopy && !title && !$slots.actions && content"
        @click="handleCopy"
        class="absolute top-2 right-2 btn btn-ghost text-xs p-2 bg-gray-800/80 hover:bg-gray-800 text-white rounded opacity-0 hover:opacity-100 transition-opacity"
        :title="copyButtonTitle"
      >
        <ClipboardDocumentIcon class="w-4 h-4" />
      </button>
      
      <!-- Character/line count -->
      <div
        v-if="showStats && content"
        class="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-900/80 text-white px-2 py-1 rounded"
      >
        {{ formatStats() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'
import { ClipboardDocumentIcon, CodeBracketIcon } from '@heroicons/vue/24/outline'
import hljs from 'highlight.js/lib/core'

// 根据需要注册语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import shell from 'highlight.js/lib/languages/shell'
import bash from 'highlight.js/lib/languages/bash'

// Props
interface Props {
  content: string
  language?: string
  title?: string
  placeholder?: string
  height?: 'auto' | 'sm' | 'md' | 'lg' | 'xl' | string
  enableHighlight?: boolean
  showCopy?: boolean
  showCopyText?: boolean
  showStats?: boolean
  readonly?: boolean
  copyButtonTitle?: string
  copySuccessMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'text',
  height: 'auto',
  enableHighlight: true,
  showCopy: true,
  showCopyText: false,
  showStats: false,
  readonly: true,
  copyButtonTitle: 'Copy to clipboard'
})

// Composables
const { t } = useI18n()
const { copyToClipboard } = useCopyToClipboard()

// Register highlight.js languages
onMounted(() => {
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('js', javascript)
  hljs.registerLanguage('typescript', typescript)
  hljs.registerLanguage('ts', typescript)
  hljs.registerLanguage('json', json)
  hljs.registerLanguage('xml', xml)
  hljs.registerLanguage('html', xml)
  hljs.registerLanguage('css', css)
  hljs.registerLanguage('shell', shell)
  hljs.registerLanguage('bash', bash)
})

// Computed properties
const heightClass = computed(() => {
  const heights = {
    auto: 'min-h-0',
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
    xl: 'h-96'
  }
  
  if (typeof props.height === 'string' && heights[props.height as keyof typeof heights]) {
    return heights[props.height as keyof typeof heights]
  }
  
  if (props.height.startsWith('h-') || props.height.includes('px') || props.height.includes('rem')) {
    return props.height
  }
  
  return 'min-h-0'
})

const paddingClass = computed(() => 'p-4')
const backgroundClass = computed(() => 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700')

const highlightedContent = computed(() => {
  if (!props.content || !props.enableHighlight) return ''
  
  try {
    if (props.language && props.language !== 'text') {
      const result = hljs.highlight(props.content, { language: props.language })
      return result.value
    } else {
      const result = hljs.highlightAuto(props.content)
      return result.value
    }
  } catch (error) {
    // Fallback to plain text if highlighting fails
    return props.content
  }
})

// Methods
const handleCopy = async () => {
  if (props.content) {
    await copyToClipboard(props.content, props.copySuccessMessage)
  }
}

const formatStats = () => {
  if (!props.content) return ''
  
  const lines = props.content.split('\n').length
  const chars = props.content.length
  
  return `${lines} lines, ${chars} chars`
}
</script>

<style scoped>
.code-block {
  /* Ensure proper line height and spacing */
  line-height: 1.5;
}

/* Override highlight.js styles for dark mode */
.code-block :deep(.hljs) {
  background: transparent !important;
  color: inherit;
}

/* Custom syntax highlighting colors that work with both themes */
.code-block :deep(.hljs-string) {
  @apply text-green-600 dark:text-green-400;
}

.code-block :deep(.hljs-number) {
  @apply text-blue-600 dark:text-blue-400;
}

.code-block :deep(.hljs-boolean) {
  @apply text-purple-600 dark:text-purple-400;
}

.code-block :deep(.hljs-keyword) {
  @apply text-indigo-600 dark:text-indigo-400;
}

.code-block :deep(.hljs-comment) {
  @apply text-gray-500 dark:text-gray-400 italic;
}

.code-block :deep(.hljs-variable) {
  @apply text-red-600 dark:text-red-400;
}

.code-block :deep(.hljs-function) {
  @apply text-blue-700 dark:text-blue-300;
}

.code-block :deep(.hljs-attr) {
  @apply text-orange-600 dark:text-orange-400;
}
</style> 