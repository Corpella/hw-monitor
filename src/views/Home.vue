<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VueUiSparkline } from 'vue-data-ui'
import { useHardware } from '../store/useHardware'

import { getChartConfig } from '../config/chart.config'

const { stats } = storeToRefs(useHardware())
</script>

<template>
  <div
    class="w-full h-screen p-10 grid grid-cols-3 gap-4"
    v-if="Object.keys(stats).length"
  >
    <VueUiSparkline
      v-for="(data, name) of stats"
      :key="name"
      :config="getChartConfig({ text: name, suffix: '°' })"
      :dataset="data"
    />
  </div>

  <!-- <pre>
    {{ stats }}
  </pre> -->
</template>
