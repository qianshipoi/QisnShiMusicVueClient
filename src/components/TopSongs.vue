<template>
  <n-card content-style="padding:8px">

    <GroupHeader title="Top Songs">
      <template v-slot:more>
        <n-text>See all</n-text>
      </template>
    </GroupHeader>

    <n-space vertical>
      <div class="flex items-center rounded-md song-item px-4 py-2" v-for="(song, index) in modelValue" :key="song.id">
        <n-h2 class="m-0 w-16 text-center">{{ (index + 1).toString().padStart(2, '0') }}</n-h2>
        <div class="rounded-lg bg-slate-400 aspect-square w-16 mx-2 overflow-hidden">
          <img :src="song.album.picUrl + '?param=64y64'" :alt="song.album.name">
        </div>
        <div class="flex-1">{{ song.name }}</div>
        <n-text class="aspect-square w-16 flex justify-center items-center">{{ formatDuration(song.duration) }}</n-text>
        <IconButton class="mx-2" />
        <IconButton class="mx-2">
          <FolderOpen />
        </IconButton>
      </div>
    </n-space>

  </n-card>
</template>

<script setup lang="ts">
import { Song } from '@/typings/neteasecloudmusicapi';
import GroupHeader from './GroupHeader.vue';
import IconButton from './IconButton.vue';
import { FolderOpen } from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui'

defineProps<{
  modelValue: Array<Song>
}>()

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
