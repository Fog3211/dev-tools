<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {{ t('home.title') }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
        {{ t('home.subtitle') }}
      </p>
      <p class="text-gray-500 dark:text-gray-400 max-w-4xl mx-auto">
        {{ t('home.description') }}
      </p>
    </div>
    
    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="feature in features"
        :key="feature.key"
        class="card p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
            <component :is="feature.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t(`home.features.${feature.key}`) }}
          </h3>
        </div>
        <p class="text-gray-600 dark:text-gray-300">
          {{ t(`home.features.${feature.key}Desc`) }}
        </p>
      </div>
    </div>
    
    <!-- Tool Categories -->
    <div class="space-y-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center">
        {{ t('home.toolCategories') }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="category in categories"
          :key="category.key"
          class="card p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
              <component :is="category.icon" class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t(`home.categories.${category.key}`) }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ t(`home.categories.${category.key}Desc`) }}
          </p>
          
          <!-- Tool List -->
          <div class="space-y-2">
            <router-link
              v-for="tool in category.tools"
              :key="tool.path"
              :to="tool.path"
              class="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div class="flex items-center">
                <component :is="tool.icon" class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t(`tools.${tool.key}`) }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  WifiIcon,
  LanguageIcon,
  MoonIcon,
  ShieldCheckIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  LinkIcon,
  KeyIcon,
  IdentificationIcon,
  ClockIcon,
  SwatchIcon,
  PaintBrushIcon,
  PhotoIcon,
  QrCodeIcon,
  BarsArrowDownIcon,
  MapPinIcon,
  DocumentIcon,
  ChartBarIcon,
  CreditCardIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline'

// Composables
const { t } = useI18n()

// Features data
const features = [
  { key: 'offline', icon: WifiIcon },
  { key: 'multiLanguage', icon: LanguageIcon },
  { key: 'darkMode', icon: MoonIcon },
  { key: 'privacy', icon: ShieldCheckIcon },
  { key: 'performance', icon: BoltIcon },
  { key: 'mobile', icon: DevicePhoneMobileIcon }
]

// Categories data
const categories = [
  {
    key: 'development',
    icon: CodeBracketIcon,
    tools: [
      { key: 'json', path: '/json', icon: CodeBracketIcon },
      { key: 'base64', path: '/base64', icon: DocumentTextIcon },
      { key: 'md5', path: '/md5', icon: FingerPrintIcon },
      { key: 'url', path: '/url', icon: LinkIcon },
      { key: 'jwt', path: '/jwt', icon: KeyIcon },
      { key: 'uuid', path: '/uuid', icon: IdentificationIcon },
      { key: 'creditCardGenerator', path: '/credit-card-generator', icon: CreditCardIcon }
    ]
  },
  {
    key: 'time',
    icon: ClockIcon,
    tools: [
      { key: 'timestamp', path: '/timestamp', icon: ClockIcon }
    ]
  },
  {
    key: 'color',
    icon: SwatchIcon,
    tools: [
      { key: 'colorPicker', path: '/color-picker', icon: SwatchIcon },
      { key: 'colorConverter', path: '/color-converter', icon: PaintBrushIcon }
    ]
  },
  {
    key: 'image',
    icon: PhotoIcon,
    tools: [
      { key: 'svg', path: '/svg', icon: PhotoIcon },
      { key: 'qrCode', path: '/qr-code', icon: QrCodeIcon },
      { key: 'barcode', path: '/barcode', icon: BarsArrowDownIcon },
      { key: 'imageUploadCdn', path: '/image-upload-cdn', icon: CloudArrowUpIcon }
    ]
  },
  {
    key: 'location',
    icon: MapPinIcon,
    tools: [
      { key: 'geohash', path: '/geohash', icon: MapPinIcon }
    ]
  },
  {
    key: 'content',
    icon: DocumentIcon,
    tools: [
      { key: 'markdown', path: '/markdown', icon: DocumentIcon },
      { key: 'mermaid', path: '/mermaid', icon: ChartBarIcon }
    ]
  }
]
</script>

<style scoped>
/* Component-specific styles */
</style> 