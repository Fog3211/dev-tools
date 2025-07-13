import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '@/stores/notifications'

/**
 * 复制到剪贴板的 composable hook
 * 提供统一的复制功能和错误处理
 */
export function useCopyToClipboard() {
  const { t } = useI18n()
  const notifications = useNotificationsStore()

  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   * @param successMessage 可选的成功消息，默认使用通用消息
   * @returns Promise<boolean> 返回是否复制成功
   */
  const copyToClipboard = async (text: string, successMessage?: string): Promise<boolean> => {
    if (!text) {
      notifications.showError(
        t('common.error'),
        t('common.nothingToCopy', 'Nothing to copy')
      )
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      notifications.showSuccess(
        t('common.copied'),
        successMessage || t('common.copiedMessage', 'Content copied to clipboard')
      )
      return true
    } catch (error) {
      notifications.showError(
        t('common.error'),
        t('common.copyError', 'Failed to copy to clipboard')
      )
      return false
    }
  }

  /**
   * 从剪贴板读取文本
   * @param successMessage 可选的成功消息
   * @returns Promise<string | null> 返回读取的文本或null
   */
  const pasteFromClipboard = async (successMessage?: string): Promise<string | null> => {
    try {
      const text = await navigator.clipboard.readText()
      if (successMessage) {
        notifications.showSuccess(
          t('common.pasted', 'Pasted'),
          successMessage
        )
      }
      return text
    } catch (error) {
      notifications.showError(
        t('common.error'),
        t('common.pasteError', 'Failed to paste from clipboard')
      )
      return null
    }
  }

  return {
    copyToClipboard,
    pasteFromClipboard
  }
} 