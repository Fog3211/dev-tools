<template>
  <svg
    :class="className"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- Large "A" -->
    <path d="M6 20L9 12L12 20M7.5 17H10.5" />
    
    <!-- Small "a" -->
    <circle cx="17" cy="16" r="2" />
    <path d="M19 14v6" />
    <path d="M17 14h2" />
    
    <!-- Underline for emphasis -->
    <line x1="6" y1="22" x2="21" y2="22" stroke-width="1" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: 'w-5 h-5'
})
</script> 