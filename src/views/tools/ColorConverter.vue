<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('tools.colorConverter') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('colorConverter.description') }}
      </p>
    </div>

    <!-- Input Section -->
    <div class="card p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('colorConverter.inputLabel') }}
          </label>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <input
                v-model="inputColor"
                type="text"
                :placeholder="t('colorConverter.inputPlaceholder')"
                class="input w-full"
                @input="convertColor"
              />
            </div>
            <!-- Color picker input -->
            <div class="flex justify-center sm:justify-start">
              <input
                v-model="pickerColor"
                type="color"
                class="w-12 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer bg-transparent"
                @input="onColorPick"
                :title="t('colorConverter.pickColor')"
              />
            </div>
          </div>
        </div>

        <!-- Error display -->
        <div v-if="parseError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div class="flex items-start space-x-2">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p class="text-sm text-red-700 dark:text-red-300">{{ parseError }}</p>
          </div>
        </div>

        <!-- Supported formats info -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
            {{ t('colorConverter.supportedFormats') }}
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
            <div><strong>HEX:</strong> #ff0000, #f00</div>
            <div><strong>RGB:</strong> rgb(255, 0, 0)</div>
            <div><strong>RGBA:</strong> rgba(255, 0, 0, 0.5)</div>
            <div><strong>HSL:</strong> hsl(0, 100%, 50%)</div>
            <div><strong>HSLA:</strong> hsla(0, 100%, 50%, 0.5)</div>
            <div><strong>{{ t('colorConverter.namedColors') }}:</strong> red, blue, white</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Color Preview and Results -->
    <div v-if="convertedColor && !parseError" class="space-y-4">

      <!-- Output Formats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- HEX -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">HEX</h4>
            <button
              @click="copyToClipboard(convertedColor.hex())"
              class="btn btn-ghost text-xs p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="t('common.copy')"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="space-y-2">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
              {{ convertedColor.hex() }}
            </div>
            <div v-if="canShortenHex(convertedColor.hex())" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
              {{ shortenHex(convertedColor.hex()) }}
            </div>
          </div>
        </div>

        <!-- RGB -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">RGB</h4>
            <button
              @click="copyToClipboard(formatRGB(convertedColor.rgb()))"
              class="btn btn-ghost text-xs p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="t('common.copy')"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="space-y-2">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
              {{ formatRGB(convertedColor.rgb()) }}
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border text-gray-600 dark:text-gray-400">
              {{ convertedColor.rgb().join(', ') }}
            </div>
          </div>
        </div>

        <!-- RGBA -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">RGBA</h4>
            <button
              @click="copyToClipboard(formatRGBA(convertedColor.rgba()))"
              class="btn btn-ghost text-xs p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="t('common.copy')"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
            {{ formatRGBA(convertedColor.rgba()) }}
          </div>
        </div>

        <!-- HSL -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">HSL</h4>
            <button
              @click="copyToClipboard(convertedColor.css('hsl'))"
              class="btn btn-ghost text-xs p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="t('common.copy')"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="space-y-2">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
              {{ convertedColor.css('hsl') }}
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border text-gray-600 dark:text-gray-400">
              {{ formatHSL(convertedColor.hsl()) }}
            </div>
          </div>
        </div>

        <!-- HSLA -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">HSLA</h4>
            <button
              @click="copyToClipboard(convertedColor.css('hsla'))"
              class="btn btn-ghost text-xs p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="t('common.copy')"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
            {{ convertedColor.css('hsla') }}
          </div>
        </div>

        <!-- HSV -->
        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-900 dark:text-white">HSV</h4>
            <button
              @click="copyToClipboard(formatHSV(convertedColor.hsv()))"
              class="btn btn-ghost text-xs p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :title="t('common.copy')"
            >
              <ClipboardDocumentIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm border">
            {{ formatHSV(convertedColor.hsv()) }}
          </div>
        </div>
      </div>

      <!-- Color Harmonies -->
      <div class="card p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('colorConverter.harmonies') }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Complementary -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('colorConverter.complementary') }}
            </h4>
            <div class="flex gap-2">
              <div
                v-for="(color, index) in [convertedColor, getComplementary()]"
                :key="`comp-${index}`"
                class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-transform hover:scale-105"
                :style="{ backgroundColor: color.hex() }"
                @click="loadColor(color.hex())"
                :title="color.hex()"
              ></div>
            </div>
          </div>

          <!-- Triadic -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('colorConverter.triadic') }}
            </h4>
            <div class="flex gap-2">
              <div
                v-for="(color, index) in getTriadic()"
                :key="`tri-${index}`"
                class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-transform hover:scale-105"
                :style="{ backgroundColor: color.hex() }"
                @click="loadColor(color.hex())"
                :title="color.hex()"
              ></div>
            </div>
          </div>

          <!-- Analogous -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('colorConverter.analogous') }}
            </h4>
            <div class="flex gap-2">
              <div
                v-for="(color, index) in getAnalogous()"
                :key="`ana-${index}`"
                class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer transition-transform hover:scale-105"
                :style="{ backgroundColor: color.hex() }"
                @click="loadColor(color.hex())"
                :title="color.hex()"
              ></div>
            </div>
          </div>

          <!-- Monochromatic -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('colorConverter.monochromatic') }}
            </h4>
            <div class="flex gap-2 overflow-x-auto">
              <div
                v-for="(color, index) in getMonochromatic()"
                :key="`mono-${index}`"
                class="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0 transition-transform hover:scale-105"
                :style="{ backgroundColor: color.hex() }"
                @click="loadColor(color.hex())"
                :title="color.hex()"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Examples Section -->
    <div class="card p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('colorConverter.examples') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <button
          v-for="example in examples"
          :key="example.value"
          @click="loadColor(example.value)"
          class="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
        >
          <div
            class="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 mb-2 shadow-sm"
            :style="{ backgroundColor: example.preview }"
          ></div>
          <span class="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">{{ example.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'
import chroma from 'chroma-js'
import {
  ClipboardDocumentIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const notifications = useNotificationsStore()

// Reactive data
const inputColor = ref('#3B82F6')
const pickerColor = ref('#3B82F6')
const convertedColor = ref<any>(null)
const parseError = ref('')

// Example colors
const examples = [
  { label: 'Primary Blue', value: '#3B82F6', preview: '#3B82F6' },
  { label: 'Success Green', value: '#10B981', preview: '#10B981' },
  { label: 'Warning Orange', value: '#F59E0B', preview: '#F59E0B' },
  { label: 'Danger Red', value: '#EF4444', preview: '#EF4444' },
  { label: 'Purple', value: '#8B5CF6', preview: '#8B5CF6' },
  { label: 'Pink', value: '#EC4899', preview: '#EC4899' },
  { label: 'Indigo', value: '#6366F1', preview: '#6366F1' },
  { label: 'Teal', value: '#14B8A6', preview: '#14B8A6' },
  { label: 'Crimson', value: 'crimson', preview: 'crimson' },
  { label: 'Transparent Red', value: 'rgba(255,0,0,0.5)', preview: 'rgba(255,0,0,0.5)' },
  { label: 'HSL Blue', value: 'hsl(210, 100%, 50%)', preview: 'hsl(210, 100%, 50%)' },
  { label: 'CSS Gray', value: 'lightgray', preview: 'lightgray' }
]

// Convert color function
function convertColor() {
  try {
    parseError.value = ''
    
    if (!inputColor.value.trim()) {
      convertedColor.value = null
      return
    }

    // Try to parse with chroma.js
    const color = chroma(inputColor.value.trim())
    convertedColor.value = color
    
    // Update color picker
    pickerColor.value = color.hex()
    
  } catch (error) {
    parseError.value = t('colorConverter.errors.invalidColor')
    convertedColor.value = null
  }
}

// Handle color picker input
function onColorPick() {
  inputColor.value = pickerColor.value
  convertColor()
}

// Load example color
function loadColor(colorValue: string) {
  inputColor.value = colorValue
  convertColor()
}

// Copy to clipboard
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    notifications.showSuccess(
      t('common.copied'),
      t('colorConverter.copiedMessage')
    )
  } catch (error) {
    notifications.showError(
      t('common.error'),
      t('common.copyError')
    )
  }
}

// Check if hex can be shortened
function canShortenHex(hex: string): boolean {
  if (hex.length !== 7) return false
  const match = hex.match(/^#(.)\1(.)\2(.)\3$/)
  return match !== null
}

// Shorten hex format
function shortenHex(hex: string): string {
  if (!canShortenHex(hex)) return hex
  return hex.replace(/^#(.)\1(.)\2(.)\3$/, '#$1$2$3')
}

// Format RGB values
function formatRGB(rgb: number[]): string {
  const r = Math.round(rgb[0])
  const g = Math.round(rgb[1])
  const b = Math.round(rgb[2])
  return `rgb(${r}, ${g}, ${b})`
}

// Format RGBA values
function formatRGBA(rgba: number[]): string {
  const r = Math.round(rgba[0])
  const g = Math.round(rgba[1])
  const b = Math.round(rgba[2])
  const a = rgba[3]
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// Format HSL values
function formatHSL(hsl: number[]): string {
  const h = Math.round(hsl[0] || 0)
  const s = Math.round(hsl[1] * 100)
  const l = Math.round(hsl[2] * 100)
  return `${h}°, ${s}%, ${l}%`
}

// Format HSV values
function formatHSV(hsv: number[]): string {
  const h = Math.round(hsv[0] || 0)
  const s = Math.round(hsv[1] * 100)
  const v = Math.round(hsv[2] * 100)
  return `hsv(${h}, ${s}%, ${v}%)`
}

// Color harmony functions
function getComplementary() {
  if (!convertedColor.value) return chroma('#000000')
  const hsl = convertedColor.value.hsl()
  return chroma.hsl((hsl[0] + 180) % 360, hsl[1], hsl[2])
}

function getTriadic() {
  if (!convertedColor.value) return [chroma('#000000'), chroma('#000000'), chroma('#000000')]
  const hsl = convertedColor.value.hsl()
  return [
    convertedColor.value,
    chroma.hsl((hsl[0] + 120) % 360, hsl[1], hsl[2]),
    chroma.hsl((hsl[0] + 240) % 360, hsl[1], hsl[2])
  ]
}

function getAnalogous() {
  if (!convertedColor.value) return []
  const hsl = convertedColor.value.hsl()
  return [
    chroma.hsl((hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]),
    convertedColor.value,
    chroma.hsl((hsl[0] + 30) % 360, hsl[1], hsl[2])
  ]
}

function getMonochromatic() {
  if (!convertedColor.value) return []
  const hsl = convertedColor.value.hsl()
  return [
    chroma.hsl(hsl[0], hsl[1], Math.max(0, hsl[2] - 0.3)),
    chroma.hsl(hsl[0], hsl[1], Math.max(0, hsl[2] - 0.15)),
    convertedColor.value,
    chroma.hsl(hsl[0], hsl[1], Math.min(1, hsl[2] + 0.15)),
    chroma.hsl(hsl[0], hsl[1], Math.min(1, hsl[2] + 0.3))
  ]
}

// Initialize
onMounted(() => {
  convertColor()
})
</script>

<style scoped>
.checkerboard-pattern {
  background-image: 
    linear-gradient(45deg, #ccc 25%, transparent 25%), 
    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #ccc 75%), 
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}
</style>
