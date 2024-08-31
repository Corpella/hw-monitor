import { VueUiSparklineConfig, VueUiXyConfig } from 'vue-data-ui'

export const getChartConfig = ({
  text = 'Title',
  suffix = '',
}): VueUiSparklineConfig => ({
  type: 'line',
  style: {
    backgroundColor: '#242424',
    fontFamily: 'inherit',
    chartWidth: 290,
    animation: { show: true, animationFrames: 360 },
    line: { color: '#c91b0e', strokeWidth: 3, smooth: true },
    bar: { borderRadius: 3, color: '#c91b0e' },
    zeroLine: { color: '#505050', strokeWidth: 1 },
    plot: { show: true, radius: 4, stroke: '#FFFFFF', strokeWidth: 1 },
    verticalIndicator: {
      show: true,
      strokeWidth: 1.5,
      color: '#c91b0e',
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
    area: { show: true, useGradient: true, opacity: 30, color: '#c91b0e' },
  },
})
