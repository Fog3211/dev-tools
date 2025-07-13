import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false)
  
  // Getters
  const theme = computed(() => isDark.value ? 'dark' : 'light')
  
  // Actions
  const toggleTheme = () => {
    isDark.value = !isDark.value
    saveTheme()
  }
  
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    saveTheme()
  }
  
  const initializeTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    
    // Apply theme to document
    applyTheme()
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }
  
  const saveTheme = () => {
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }
  
  const applyTheme = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
  
  return {
    isDark,
    theme,
    toggleTheme,
    setTheme,
    initializeTheme
  }
}) 