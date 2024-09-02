import { VueUiMiniLoaderConfig, VueUiSparklineConfig } from 'vue-data-ui'
import { HardwareType } from '../types/hardware.types'

export const getChartConfig = ({
  text = 'Title',
  suffix = '',
  color = '#c91b0e',
}): VueUiSparklineConfig => ({
  type: 'line',
  style: {
    backgroundColor: '#242424',
    fontFamily: 'inherit',
    chartWidth: 290,
    animation: { show: true, animationFrames: 360 },
    line: { color, strokeWidth: 3, smooth: true },
    bar: { borderRadius: 3, color },
    zeroLine: { color: '#505050', strokeWidth: 1 },
    plot: { show: true, radius: 4, stroke: '#FFFFFF', strokeWidth: 1 },
    verticalIndicator: {
      show: true,
      strokeWidth: 1.5,
      color,
      strokeDasharray: 3,
    },
    dataLabel: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      position: 'left',
      fontSize: 48,
      bold: true,
      color: '#CCCCCC',
      roundingValue: 1,
      valueType: 'latest',
      prefix: '',
      suffix,
    },
    title: {
      show: true,
      textAlign: 'left',
      color: '#FAFAFA',
      fontSize: 16,
      bold: true,
      text,
    },
    area: { show: true, useGradient: true, opacity: 30, color },
  },
})

export const lineLoaderConfig: VueUiMiniLoaderConfig = {
  type: 'bar',
  bar: {
    gutterColor: '#CCCCCC',
    gutterOpacity: 0.3,
    gutterBlur: 0,
    trackHueRotate: 360,
    trackBlur: 1,
    trackColor: '#42d392',
  },
}

export const hardwareColorMap: Record<HardwareType, string> = {
  Cpu: '#FF5733', // A strong, warm color representing processing power
  GpuNvidia: '#76B900', // Nvidia's signature green
  GpuAmd: '#FF4500', // AMD's Radeon red-orange
  GpuIntel: '#0071C5', // Intel's characteristic blue
  Storage: '#FFD700', // Gold, representing valuable data storage
  Motherboard: '#8A2BE2', // A deep purple, symbolizing complexity and connectivity
  SuperIO: '#1E90FF', // Dodger blue, representing control and communication
  EmbeddedController: '#20B2AA', // Light sea green, suggesting embedded systems
  Memory: '#32CD32', // Lime green, representing fast, volatile memory
  Network: '#4682B4', // Steel blue, symbolizing network connectivity
  Cooler: '#00CED1', // Dark turquoise, representing cooling systems
  Psu: '#FFA500', // Orange, indicating power supply
  Battery: '#FF6347', // Tomato red, symbolizing energy and charge
}
