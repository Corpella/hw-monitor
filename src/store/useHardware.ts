import { listen } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHardware = defineStore('useHardware', () => {

  const activeListener = ref()

  const stats = ref<any[]>([])

  const setStats = (newStats: any) => {
    stats.value.length > 20 && stats.value.unshift()

    stats.value.push(newStats)
  }

  const startMonitoring = async (pollingRate: number) => {
    //FIXME: remove previous listener or refactor the invoker to only override the polling param
    await appWindow.emit('start_monitoring', { pollingRate })

    activeListener.value && activeListener.value()

    activeListener.value = await listen(
      'monitoring_data',
      ({ event, payload }) => {
        console.log({ event, payload })
        setStats(payload)
      }
    )
  }

  return { stats, startMonitoring }
})