<script setup lang="ts">
import { useHardware } from './store/useHardware'
import Home from './views/Home.vue'

const { startMonitoring } = useHardware()

startMonitoring({
  pollingRate: 3,
  hardwareTypes: ['GpuNvidia', 'Cpu', 'Psu', 'Motherboard'],
})
</script>

<template>
  <Home />
</template>
