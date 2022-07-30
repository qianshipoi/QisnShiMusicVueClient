<template>
  <n-card class="playlist-card">
    <template #header>
      <n-skeleton v-if="!playlist"
                  text
                  :repeat="1"
                  width="80%"
                  height="26px" />
      <template v-else>
        {{ playlist.name }}
      </template>
    </template>
    <template #cover>
      <n-skeleton width="100%"
                  v-if="!playlist"
                  :sharp="false"
                  style="padding-top:100%" />
      <n-image :src="playlist.coverImgUrl"
               v-else
               :preview-disabled="true"
               lazy
               width="100%"
               @click="$router.push({name:'Playlist', params:{id: playlist?.id }})"
               :alt="playlist.name">
        <template #placeholder>
          <n-skeleton :sharp="false"
                      style="padding-top: 100%;"
                      width="100%" />
        </template>
      </n-image>
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
  transition: all ease-in-out 0.2s;
  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
  :deep(.n-image) {
    width: 100%;
    display: flex;
  }
}
</style>
