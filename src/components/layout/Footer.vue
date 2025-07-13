<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Copyright -->
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('footer.copyright') }}
        </div>
        
        <!-- Version and Made with -->
        <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ t('footer.version') }}</span>
          <span>{{ t('footer.madeWith') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Composables
const { t } = useI18n()
</script>

<style scoped>
/* Component-specific styles */
</style> 