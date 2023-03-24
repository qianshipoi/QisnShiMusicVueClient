<template>
  <n-card v-if="!song" class="wow animate__animated animate__lightSpeedInRight song-item">
    <div style="display:flex;">
      <n-skeleton lazy width="48px" height="48px" :sharp="false" />
      <div style="display:flex;flex-direction: column; justify-content: space-between; margin-left: .75rem;flex:1">
        <n-skeleton text :sharp="false" height="18px" />
        <n-skeleton text :sharp="false" width="80%" height="16px" />
      </div>
      <n-skeleton text style="margin:auto 0 auto 1rem;flex:1.5" :sharp="false" width="280px" height="20px" />
      <n-skeleton style="margin:auto 1rem" width="40px" height="32px"></n-skeleton>
      <n-skeleton text style="margin:auto 0" width="40px" height="20px"></n-skeleton>
    </div>
  </n-card>
  <n-card v-else class="wow animate__animated animate__lightSpeedInRight song-item"
    @dblclick="emit('play', song?.id ?? 0)">
    <div style="display:flex;">
      <n-image fallback-src="https://oss.kuriyama.top/static/akua.png" :src="song.album.picUrl" width="48" height="48"
        preview-disabled :alt="song.name" />
      <div class="song-base">
        <n-ellipsis :line-clamp="1" class="song-name">{{ song.name }}</n-ellipsis>
        <n-text style="font-size:14px">{{ formatArtists(song.artists) }}</n-text>
      </div>
      <n-ellipsis :line-clamp="1" class="song-album">{{ song.album.name }}</n-ellipsis>
      <n-icon :component="HeartOutline" :color="themeVars.primaryColor" style="margin:auto 1rem" :size="28"></n-icon>
      <n-text style="margin: auto 0;font-weight: 800;">{{ formatTime(song.duration) }}</n-text>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { HeartOutline } from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui'
import { Song, Artist } from '@/utils/neteasecloudmusicapi'
import { addPreZero } from '@/utils'

type Props = {
  song?: Song
}
type Emits = {
  (e: 'play', id: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const themeVars = useThemeVars()

const formatArtists = (artists: Array<Artist>): string => {
  return artists.map((x) => x.name).join(',')
}

const formatTime = (mailliseconds: number): string => {
  const time = new Date(0, 0, 0, 0, 0, 0, mailliseconds)
  return `${addPreZero(time.getMinutes().toString(), 2)}:${addPreZero(
    time.getSeconds().toString(),
    2
  )}`
}
</script>

<style lang="scss" scoped>
.song-item {
  min-height: 2rem;
  margin-bottom: 1rem;
  display: flex;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: v-bind('themeVars.hoverColor');
  }

  .n-ellipsis,
  .n-p,
  .n-text {
    color: v-bind('themeVars.primaryColor');
    transition: 0.3s var(--cubic-bezier-ease-in-out);
  }
}

.song-base {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 0.75rem;
  flex: 1;
}

:deep(.song-name) {
  font-size: 16px;
  font-weight: 600;
  color: v-bind('themeVars.primaryColor');
}

:deep(.song-album) {
  margin: auto 0 auto 1rem;
  flex: 1.5;
  font-size: 18px;
  font-weight: 800;
  text-align: left;
  color: v-bind('themeVars.primaryColor');
}
</style>
