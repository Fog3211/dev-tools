<template>
  <div class="fixed top-4 right-4 z-50 space-y-4">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
        :class="getNotificationClasses(notification.type)"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <CheckCircleIcon v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" />
              <XCircleIcon v-else-if="notification.type === 'error'" class="h-6 w-6 text-red-400" />
              <ExclamationTriangleIcon v-else-if="notification.type === 'warning'" class="h-6 w-6 text-yellow-400" />
              <InformationCircleIcon v-else class="h-6 w-6 text-blue-400" />
            </div>
            
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ notification.message }}
              </p>
            </div>
            
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
    success: 'border-l-4 border-green-400',
    error: 'border-l-4 border-red-400',
    warning: 'border-l-4 border-yellow-400',
    info: 'border-l-4 border-blue-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style> 