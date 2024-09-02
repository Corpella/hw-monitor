import { invoke } from '@tauri-apps/api'
import { listen } from '@tauri-apps/api/event'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HardwareData, HardwareType } from '../types/hardware.types'

import { HardwareDataStructure, SensorData } from '../types/chart.types'

export const useHardware = defineStore('useHardware', () => {
  const activeListener = ref()

  const stats = ref<HardwareDataStructure[]>([])

  const setTemperatureSensors = (parsedData: HardwareData) => {
    for (const hardwareName in parsedData) {
      const hardwareData = parsedData[hardwareName]

      const period = new Date().toTimeString().slice(0, 8)

      const existingHardware = stats.value.find(
        (stat) => stat.hardwareName === hardwareName
      )

      const chartData: HardwareDataStructure = {
        hardwareName,
        hardwareType: hardwareData.HardwareType,
        sensors: hardwareData.Sensors.map(
          ({ Name, Unit, Value }): SensorData => ({
            sensorName: Name,
            sensorUnit: Unit === 'Unknown' ? '' : Unit,
            data: [{ period, value: Value }],
          })
        ),
      }

      if (!existingHardware) {
        chartData.sensors.length && stats.value.push(chartData)
        continue
      }

      existingHardware.sensors.forEach((sensor, index) => {
        sensor.data.push(chartData.sensors[index].data[0])
      })
    }

    // const existingHW = stats.value.find(({ name }) => name === hardwareName)

    // existingHW
    //   ? existingHW.data.push(dataElement)
    //   : stats.value.push({ name: hardwareName, data: [dataElement] })
    // }
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
