<template>
  <n-grid :x-gap="16"
          :y-gap="16"
          :cols="24"
          item-responsive
          responsive="screen">
    <template v-if="!data">
      <n-grid-item span="12 s:8 m:6 l:4 xl:3"
                   v-for="item in skeletonCount"
                   :key="item">
        <slot :slot-scope="item"></slot>
      </n-grid-item>
    </template>
    <n-grid-item v-else
                 span="12 s:8 m:6 l:4 xl:3"
                 v-for="item in data"
                 :key="item[name]">
      <slot :item="item"></slot>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
defineProps<{
  data?: Array<any>
  skeletonCount: number
  isBusy: boolean
  name: string
}>()
</script>
