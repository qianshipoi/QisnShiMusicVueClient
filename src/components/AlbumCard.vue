<template>
  <n-card class="album-card"
          v-if="!album">
    <template #cover>
      <n-skeleton width="196px"
                  height="196px"
                  :sharp="false" />
      <n-skeleton text
                  style="margin:1rem"
                  width="160px"
                  height="28px" />
    </template>
  </n-card>
  <n-card v-else
          class="album-card"
          :title="album.name">
    <template #cover>
      <n-image :src="album.picUrl"
               :alt="album.name"
               preview-disabled
               style="width:14rem;height:14rem" />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { Album } from '@/typings/neteasecloudmusicapi'
import { useThemeVars } from 'naive-ui'

defineProps<{
  album?: Album
}>()

const themeVars = useThemeVars()
</script>

<style lang="scss" scoped>
.album-card {
  cursor: pointer;
  max-width: 14rem;
  transition: all ease-in-out 0.2s;
  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
}
</style>
