export const hardwareTypes = [
  'Cpu',
  'GpuNvidia',
  'GpuAmd',
  'GpuIntel',
  'Storage',
  'Motherboard',
  'SuperIO',
  'EmbeddedController',
  'Memory',
  'Network',
  'Cooler',
  'Psu',
  'Battery',
] as const
export type HardwareType = (typeof hardwareTypes)[number]

type SensorType =
  | 'Load'
  | 'Temperature'
  | 'Voltage'
  | 'Clock'
  | 'Fan'
  | 'Control'
  | 'Power'
  | 'Factor'
  | 'SmallData'
  | 'Throughput'

type SensorUnit =
  | '%'
  | '°C'
  | 'V'
  | 'MHz'
  | 'RPM'
  | 'W'
  | '1'
  | 'Unknown'
  | 'GB'
  | 'L/h'
  | 'dBA'
  | 'µS/cm'
  | 'Hz'
  | 'mWh'

export type SensorInfo = {
  Name: string
  Value: number
  Type: SensorType
  Unit: SensorUnit
}

export type HardwareInfo = {
  Name: string
  HardwareType: string
  Sensors: SensorInfo[]
}

export type HardwareData = {
  [key: string]: HardwareInfo
}
