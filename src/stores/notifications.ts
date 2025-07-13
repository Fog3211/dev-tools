import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  timestamp: number
}

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([])
  
  // Actions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      timestamp: Date.now(),
      duration: 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAll = () => {
    notifications.value = []
  }
  
  const showSuccess = (title: string, message?: string) => {
    return addNotification({
      type: 'success',
      title,
      message
    })
  }
  
  const showError = (title: string, message?: string) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000
    })
  }
  
  const showWarning = (title: string, message?: string) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000
    })
  }
  
  const showInfo = (title: string, message?: string) => {
    return addNotification({
      type: 'info',
      title,
      message
    })
  }
  
  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}) 