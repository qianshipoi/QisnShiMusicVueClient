<template>
  <n-card v-if="!artist"
          class="artist-card">
    <template #cover>
      <n-skeleton width="100%"
                  style="padding-top:100%;border-radius: 50%;"
                  :sharp="false" />
      <n-skeleton text
                  :repeat="1"
                  style="margin:1rem"
                  width="160px"
                  height="26px" />
    </template>
  </n-card>
  <n-card v-else
          class="artist-card"
          :title="artist.name">
    <template #cover>
      <img :src="artist.img1v1Url"
           @click="$router.push({name:'Artist', params:{id: artist?.id }})"
           style="width:100%;border-radius: 50%;"
           :alt="artist.name" />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { Artist } from '@/typings/neteasecloudmusicapi'
import { useThemeVars } from 'naive-ui'

defineProps<{
  artist?: Artist
}>()

const themeVars = useThemeVars()
</script>

<style lang="scss" scoped>
.artist-card {
  cursor: pointer;
  transition: all ease-in-out 0.2s;
  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
}
</style>
