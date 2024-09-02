import { VueUiSparklineDatasetItem } from 'vue-data-ui'
import { HardwareType } from './hardware.types'

export type SensorData = {
  sensorName: string
  sensorUnit: string
  data: VueUiSparklineDatasetItem[]
}

export type HardwareDataStructure = {
  hardwareName: string
  hardwareType: HardwareType
  sensors: SensorData[]
}
