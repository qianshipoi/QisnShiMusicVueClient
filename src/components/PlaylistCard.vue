<template>
  <n-card v-if="!playlist"
          class="playlist-card">
    <template #cover>
      <n-skeleton width="196px"
                  height="196px" />
      <n-skeleton text
                  :repeat="1"
                  style="margin:1rem"
                  width="160px"
                  height="26px" />
    </template>
  </n-card>
  <n-card v-else
          class="playlist-card"
          :title="playlist.name">
    <template #cover>
      <img :src="playlist.coverImgUrl"
           @click="$router.push({name:'Playlist', params:{id: playlist?.id }})"
           style="width:14rem;height:14rem"
           :alt="playlist.name" />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { Playlist } from '../typings/neteasecloudmusicapi'

defineProps<{
  playlist?: Playlist
}>()

const themeVars = useThemeVars()
</script>

<style lang="scss" scoped>
.playlist-card {
  cursor: pointer;
  max-width: 14rem;
  transition: all ease-in-out 0.2s;
  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
}
</style>
