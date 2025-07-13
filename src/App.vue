<template>
  <div id="app" :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <!-- Mobile menu backdrop -->
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        @click="toggleMobileMenu"
      ></div>
      
      <!-- Sidebar -->
      <div 
        :class="[
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <Sidebar @close="toggleMobileMenu" />
      </div>
      
      <!-- Main content wrapper -->
      <div class="lg:ml-64">
        <!-- Header -->
        <div class="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Header @toggle-menu="toggleMobileMenu" />
        </div>
        
        <!-- Main content -->
        <main class="p-4 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <router-view />
          </div>
        </main>
        
        <!-- Footer -->
        <Footer />
      </div>
    </div>
    
    <!-- Global notifications -->
    <Notifications />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'

// Import components
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Notifications from '@/components/common/Notifications.vue'

// Router setup
const route = useRoute()

// Reactive data
const isMobileMenuOpen = ref(false)

// Store setup
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const { isDark } = storeToRefs(themeStore)

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Lifecycle hooks
onMounted(() => {
  // Initialize theme
  themeStore.initializeTheme()
  
  // Initialize language
  languageStore.initializeLanguage()
  
  // Close mobile menu on route change
  watch(() => route.path, () => {
    isMobileMenuOpen.value = false
  })
})

// Watch for theme changes
watch(isDark, (newValue: boolean) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })
</script>

<style scoped>
/* Component-specific styles */
</style> 