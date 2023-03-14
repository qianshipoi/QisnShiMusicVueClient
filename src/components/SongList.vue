<template>
  <n-space vertical>
    <div class="song-item flex items-center rounded-md px-4 py-2" v-for="(song, index) in modelValue" :key="song.id">
      <n-h2 class="m-0 w-16 text-center">{{ (index + 1).toString().padStart(2, '0') }}</n-h2>
      <div class="rounded-lg bg-slate-400 aspect-square w-16 mx-2 overflow-hidden">
        <img :src="song.al.picUrl + '?param=64y64'" :alt="song.al.name">
      </div>
      <div class="flex-1">{{ song.name }}</div>
      <n-text class="aspect-square w-16 flex justify-center items-center">{{ formatDuration(song.dt) }}</n-text>
      <IconButton class="mx-2" />
      <IconButton class="mx-2">
        <FolderOpen />
      </IconButton>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import { Song } from '@/typings/neteasecloudmusicapi';
import { useThemeVars } from 'naive-ui';
import IconButton from './IconButton.vue';
import { FolderOpen } from '@vicons/ionicons5'

withDefaults(defineProps<{
  modelValue: Array<Song>
}>(), {
})

const themeVars = useThemeVars();

const formatDuration = (duration: number): string => {
  let m: number = 0
  let s: number = duration / 60 / 60

  if (s > 60) {
    m = s / 60
    s = s % 60
  }

  return `${Math.floor(m).toString().padStart(2, '0')}:${Math.round(s).toString().padStart(2, '0')}`
}



</script>

<style lang="scss" scoped>
.song-item {
  cursor: pointer;
  margin-top: 4px;
  transition: all ease-in-out 0.2s;

  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
}
</style>
