<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <!-- Logo/Brand -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">DevTools</h1>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
      <!-- Home -->
      <router-link to="/" class="sidebar-link" :class="{ active: route.path === '/' }">
        <HomeIcon class="w-5 h-5 mr-3" />
        {{ t('nav.home') }}
      </router-link>
      
      <!-- Developer Tools -->
      <div class="space-y-1">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ t('nav.devTools') }}
        </div>
        
        <router-link to="/json" class="sidebar-link" :class="{ active: route.path === '/json' }">
          <CodeBracketIcon class="w-5 h-5 mr-3" />
          {{ t('tools.json') }}
        </router-link>
        
        <router-link to="/base64" class="sidebar-link" :class="{ active: route.path === '/base64' }">
          <DocumentTextIcon class="w-5 h-5 mr-3" />
          {{ t('tools.base64') }}
        </router-link>
        
        <router-link to="/md5" class="sidebar-link" :class="{ active: route.path === '/md5' }">
          <FingerPrintIcon class="w-5 h-5 mr-3" />
          {{ t('tools.md5') }}
        </router-link>
        
        <router-link to="/url" class="sidebar-link" :class="{ active: route.path === '/url' }">
          <LinkIcon class="w-5 h-5 mr-3" />
          {{ t('tools.url') }}
        </router-link>
        
        <router-link to="/curl" class="sidebar-link" :class="{ active: route.path === '/curl' }">
          <CommandLineIcon class="w-5 h-5 mr-3" />
          {{ t('tools.curl') }}
        </router-link>
        
        <router-link to="/curl-builder" class="sidebar-link" :class="{ active: route.path === '/curl-builder' }">
          <WrenchScrewdriverIcon class="w-5 h-5 mr-3" />
          {{ t('tools.curlBuilder') }}
        </router-link>
        
        <router-link to="/jwt" class="sidebar-link" :class="{ active: route.path === '/jwt' }">
          <KeyIcon class="w-5 h-5 mr-3" />
          {{ t('tools.jwt') }}
        </router-link>
        
        <router-link to="/uuid" class="sidebar-link" :class="{ active: route.path === '/uuid' }">
          <IdentificationIcon class="w-5 h-5 mr-3" />
          {{ t('tools.uuid') }}
        </router-link>
        
        <router-link to="/credit-card-generator" class="sidebar-link" :class="{ active: route.path === '/credit-card-generator' }">
          <CreditCardIcon class="w-5 h-5 mr-3" />
          {{ t('tools.creditCardGenerator') }}
        </router-link>
      </div>
      
      <!-- Time Tools -->
      <div class="space-y-1">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ t('nav.timeTools') }}
        </div>
        
        <router-link to="/timestamp" class="sidebar-link" :class="{ active: route.path === '/timestamp' }">
          <ClockIcon class="w-5 h-5 mr-3" />
          {{ t('tools.timestamp') }}
        </router-link>
      </div>
      
      <!-- Color Tools -->
      <div class="space-y-1">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ t('nav.colorTools') }}
        </div>
        
        <router-link to="/color-picker" class="sidebar-link" :class="{ active: route.path === '/color-picker' }">
          <SwatchIcon class="w-5 h-5 mr-3" />
          {{ t('tools.colorPicker') }}
        </router-link>
        
        <router-link to="/color-converter" class="sidebar-link" :class="{ active: route.path === '/color-converter' }">
          <PaintBrushIcon class="w-5 h-5 mr-3" />
          {{ t('tools.colorConverter') }}
        </router-link>
      </div>
      
      <!-- Image Tools -->
      <div class="space-y-1">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ t('nav.imageTools') }}
        </div>
        
        <router-link to="/svg" class="sidebar-link" :class="{ active: route.path === '/svg' }">
          <PhotoIcon class="w-5 h-5 mr-3" />
          {{ t('tools.svg') }}
        </router-link>
        
        <router-link to="/qr-code" class="sidebar-link" :class="{ active: route.path === '/qr-code' }">
          <QrCodeIcon class="w-5 h-5 mr-3" />
          {{ t('tools.qrCode') }}
        </router-link>
        
        <router-link to="/barcode" class="sidebar-link" :class="{ active: route.path === '/barcode' }">
          <BarsArrowDownIcon class="w-5 h-5 mr-3" />
          {{ t('tools.barcode') }}
        </router-link>
        
        <router-link to="/image-upload-cdn" class="sidebar-link" :class="{ active: route.path === '/image-upload-cdn' }">
          <CloudArrowUpIcon class="w-5 h-5 mr-3" />
          {{ t('tools.imageUploadCdn') }}
        </router-link>
      </div>
      
      <!-- Location Tools -->
      <div class="space-y-1">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ t('nav.locationTools') }}
        </div>
        
        <router-link to="/geohash" class="sidebar-link" :class="{ active: route.path === '/geohash' }">
          <MapPinIcon class="w-5 h-5 mr-3" />
          {{ t('tools.geohash') }}
        </router-link>
      </div>
      
      <!-- Content Tools -->
      <div class="space-y-1">
        <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {{ t('nav.contentTools') }}
        </div>
        
        <router-link to="/markdown" class="sidebar-link" :class="{ active: route.path === '/markdown' }">
          <DocumentIcon class="w-5 h-5 mr-3" />
          {{ t('tools.markdown') }}
        </router-link>
        
        <router-link to="/mermaid" class="sidebar-link" :class="{ active: route.path === '/mermaid' }">
          <ChartBarIcon class="w-5 h-5 mr-3" />
          {{ t('tools.mermaid') }}
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
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
  CommandLineIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline'

// Props
defineProps<{
  modelValue?: boolean
}>()

// Emits
defineEmits<{
  close: []
}>()

// Composables
const { t } = useI18n()
const route = useRoute()
</script>

<style scoped>
/* Component-specific styles */
</style> 