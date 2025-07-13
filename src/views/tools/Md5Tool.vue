<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('md5.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('md5.description') }}
      </p>
    </div>
    
    <div class="card p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        MD5 Tool - Coming Soon
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script> 