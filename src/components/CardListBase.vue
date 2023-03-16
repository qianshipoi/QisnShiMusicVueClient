<template>
  <n-grid :x-gap="16" :y-gap="16" :cols="24" item-responsive responsive="screen">
    <template v-if="!data">
      <n-grid-item span="12 s:8 m:6 l:4 xl:3" v-for="item in skeletonCount" :key="item">
        <slot :slot-scope="item"></slot>
      </n-grid-item>
    </template>
    <n-grid-item v-else class="wow animated animate__animated animate__bounceInUp" data-wow-duration="1s"
      span="12 s:8 m:6 l:4 xl:3" v-for="item in data" :key="item.id">
      <slot :item="item"></slot>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { Playlist } from '@/typings/neteasecloudmusicapi';

type Props = {
  data?: Array<Playlist>
  skeletonCount: number
  isBusy: boolean
  name: string
}
defineProps<Props>();
</script>
