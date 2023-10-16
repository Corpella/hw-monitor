<script setup lang="ts">
import { useHardware } from '../store/useHardware'

const statsStore = useHardware()
</script>

<template>
  <pre>
    {{ statsStore.stats }}
  </pre>
</template>
