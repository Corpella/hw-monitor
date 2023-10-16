<script setup lang="ts">
import { useHardware } from './store/useHardware'
import Home from './views/Home.vue'

const { startMonitoring } = useHardware()

startMonitoring(1000)
</script>

<template>
  <Home />
</template>
