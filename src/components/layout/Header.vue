<template>
  <header class="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <!-- Mobile menu button -->
      <button
        @click="$emit('toggle-menu')"
        class="lg:hidden btn btn-ghost p-2 flex items-center justify-center"
        type="button"
        aria-label="Open sidebar"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
      
      <!-- Page title -->
      <div class="hidden lg:block">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ getPageTitle() }}
        </h1>
      </div>
      
      <!-- Right side controls -->
      <div class="flex items-center space-x-2">
        <!-- Language Switcher -->
        <div class="relative">
          <button
            @click="toggleLanguageMenu"
            class="btn btn-ghost p-2 relative flex items-center justify-center"
            type="button"
            aria-label="Switch language"
          >
            <LanguageIcon class="w-5 h-5" />
            <ChevronDownIcon class="w-4 h-4 ml-1" />
          </button>
          
          <div
            v-if="showLanguageMenu"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="py-2">
              <button
                v-for="language in supportedLanguages"
                :key="language.code"
                @click="changeLanguage(language.code)"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                :class="{ 'bg-gray-100 dark:bg-gray-700': currentLanguage === language.code }"
              >
                <span class="mr-3 text-lg leading-none">{{ language.flag }}</span>
                <span class="leading-normal">{{ language.name }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="btn btn-ghost p-2 flex items-center justify-center"
          type="button"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <SunIcon v-if="isDark" class="w-5 h-5" />
          <MoonIcon v-else class="w-5 h-5" />
        </button>
        
        <!-- Settings -->
        <button
          class="btn btn-ghost p-2 flex items-center justify-center"
          type="button"
          aria-label="Settings"
        >
          <Cog6ToothIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'
import {
  Bars3Icon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  LanguageIcon
} from '@heroicons/vue/24/outline'

// Emits
defineEmits<{
  'toggle-menu': []
}>()

// Composables
const { t } = useI18n()
const route = useRoute()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

// State
const { isDark } = storeToRefs(themeStore)
const { currentLanguage, supportedLanguages, currentLanguageInfo } = storeToRefs(languageStore)
const showLanguageMenu = ref(false)

// Methods
const toggleTheme = () => {
  themeStore.toggleTheme()
}

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

const changeLanguage = (language: string) => {
  languageStore.setLanguage(language)
  showLanguageMenu.value = false
}

const getPageTitle = () => {
  const routeToTitleMap: Record<string, string> = {
    '/': t('nav.home'),
    '/json': t('tools.json'),
    '/base64': t('tools.base64'),
    '/md5': t('tools.md5'),
    '/url': t('tools.url'),
    '/curl': t('tools.curl'),
    '/jwt': t('tools.jwt'),
    '/uuid': t('tools.uuid'),
    '/timestamp': t('tools.timestamp'),
    '/color-picker': t('tools.colorPicker'),
    '/color-converter': t('tools.colorConverter'),
    '/svg': t('tools.svg'),
    '/qr-code': t('tools.qrCode'),
    '/barcode': t('tools.barcode'),
    '/geohash': t('tools.geohash'),
    '/markdown': t('tools.markdown'),
    '/mermaid': t('tools.mermaid')
  }
  
  return routeToTitleMap[route.path] || t('nav.home')
}

// Click outside to close language menu
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showLanguageMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Component-specific styles */
</style> 