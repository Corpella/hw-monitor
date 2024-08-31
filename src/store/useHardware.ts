import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { HardwareData, HardwareType } from '../types/hardware.types'

import { VueUiSparklineDatasetItem } from 'vue-data-ui'

export const useHardware = defineStore('useHardware', () => {
  const activeListener = ref()

  const maxValue = 30

  const stats = reactive<Record<string, VueUiSparklineDatasetItem[]>>({})

  const setTemperatureSensors = (parsedData: HardwareData) => {
    for (const hardwareName in parsedData) {
      const hardwareData = parsedData[hardwareName]
      // Initial implementation, retrieve only temps
      const tempSensor = hardwareData.Sensors.find(
        ({ Type, Name }) => Name === 'GPU Hot Spot' || Type === 'Temperature'
      )

      if (!tempSensor) continue

      const dataElement: VueUiSparklineDatasetItem = {
        period: new Date().toTimeString().slice(0, 8),
        value: tempSensor.Value as number,
      }

      if (!(hardwareName in stats)) {
        stats[hardwareName] = [dataElement]
        return
      }

      stats[hardwareName][maxValue] && stats[hardwareName].shift()

      stats[hardwareName].push(dataElement)

      // console.log({ stats })
    }
  }

  const setStats = (newStats: string) => {
    // TODO: add max data logic to prevent overflow
    const parsedData = JSON.parse(newStats) as HardwareData
    // console.log({ parsedData })

    setTemperatureSensors(parsedData)
  }

  const startMonitoring = async ({
    hardwareTypes,
    pollingRate,
  }: {
    hardwareTypes: HardwareType[]
    pollingRate: number
  }) => {
    invoke('init_process', {
      hardwareType: hardwareTypes.join(','),
      pollingRate,
    })
    activeListener.value && activeListener.value()

    activeListener.value = await listen<{ message: string }>(
      'monitoring_data',
      ({ payload: { message } }) => {
        setStats(message)
      }
    )
  }

  return { stats, startMonitoring }
})
