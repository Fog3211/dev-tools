<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg pointer-events-auto border border-gray-200 dark:border-gray-700 overflow-hidden"
        :class="getNotificationClasses(notification.type)"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="getIconBgClass(notification.type)">
                <CheckCircleIcon v-if="notification.type === 'success'" class="h-5 w-5 text-white" />
                <XCircleIcon v-else-if="notification.type === 'error'" class="h-5 w-5 text-white" />
                <ExclamationTriangleIcon v-else-if="notification.type === 'warning'" class="h-5 w-5 text-white" />
                <InformationCircleIcon v-else class="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div class="ml-3 flex-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ notification.message }}
              </p>
            </div>
            
            <div class="ml-4 flex-shrink-0">
              <button
                @click="removeNotification(notification.id)"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <span class="sr-only">Close</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Store
const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)

// Methods
const removeNotification = (id: string) => {
  notificationsStore.removeNotification(id)
}

const getNotificationClasses = (type: string) => {
  const classes = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getIconBgClass = (type: string) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[type as keyof typeof classes] || classes.info
}
</script>

<style scoped>
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.notification-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 