<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { VueUiMiniLoader, VueUiSparkline } from 'vue-data-ui'
import { useHardware } from '../store/useHardware'

import {
  getChartConfig,
  hardwareColorMap,
  lineLoaderConfig,
} from '../config/chart.config'

const { stats } = storeToRefs(useHardware())

const isReady = ref(false)

const unwatch = watch(
  stats,
  (statsData) => {
    if (statsData[0]?.sensors[0]?.data?.length > 1) {
      isReady.value = true
      unwatch()
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center" v-if="!isReady">
    <VueUiMiniLoader class="w-2/3" :config="lineLoaderConfig" />
  </div>
  <div v-else class="w-full flex flex-col gap-4 p-5">
    <!-- <button @click="updateRef++">Update</button> -->
    <div
      class="w-full"
      v-for="{ hardwareName, hardwareType, sensors } in stats"
      :key="hardwareName"
    >
      <h2>{{ hardwareName }}</h2>
      <div class="grid grid-cols-3 w-full gap-4">
        <VueUiSparkline
          v-for="({ data, sensorName, sensorUnit }, index) in sensors"
          :key="`${sensorName}-${index}`"
          ref="chart"
          :config="
            getChartConfig({
              text: sensorName,
              suffix: sensorUnit,
              color: hardwareColorMap[hardwareType],
            })
          "
          :dataset="data"
        />
      </div>
    </div>
  </div>

  <!-- <pre>
    {{ stats }}
  </pre> -->
</template>
