import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  // State
  const currentLanguage = ref('en')
  
  // Getters
  const supportedLanguages = computed(() => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ])
  
  const currentLanguageInfo = computed(() => 
    supportedLanguages.value.find(lang => lang.code === currentLanguage.value)
  )
  
  // Actions
  const setLanguage = (language: string) => {
    if (supportedLanguages.value.some(lang => lang.code === language)) {
      currentLanguage.value = language
      localStorage.setItem('locale', language)
      
      // Update i18n locale
      const { locale } = useI18n()
      locale.value = language
      
      // Update document language
      document.documentElement.setAttribute('lang', language)
      
      // Update page title based on language
      updatePageTitle()
    }
  }
  
  const initializeLanguage = () => {
    let targetLanguage = 'en' // 默认英文
    
    // 首先检查localStorage是否有保存的语言设置
    const savedLanguage = localStorage.getItem('locale')
    if (savedLanguage && supportedLanguages.value.some(lang => lang.code === savedLanguage)) {
      targetLanguage = savedLanguage
    } else {
      // 如果没有保存的设置，检测浏览器语言
      const browserLanguage = navigator.language.toLowerCase()
      
      // 支持多种中文变体检测
      if (browserLanguage.startsWith('zh') || browserLanguage.includes('chinese')) {
        targetLanguage = 'zh'
      } else if (browserLanguage.startsWith('en')) {
        targetLanguage = 'en'
      } else {
        // 其他语言默认使用英文
        targetLanguage = 'en'
      }
    }
    
    // 应用语言设置
    currentLanguage.value = targetLanguage
    
    const { locale } = useI18n()
    locale.value = targetLanguage
    document.documentElement.setAttribute('lang', targetLanguage)
    localStorage.setItem('locale', targetLanguage)
    
    updatePageTitle()
  }
  
  const updatePageTitle = () => {
    const { t } = useI18n()
    document.title = t('home.title')
  }
  
  const toggleLanguage = () => {
    const nextLanguage = currentLanguage.value === 'en' ? 'zh' : 'en'
    setLanguage(nextLanguage)
  }
  
  return {
    currentLanguage,
    supportedLanguages,
    currentLanguageInfo,
    setLanguage,
    initializeLanguage,
    toggleLanguage
  }
}) 