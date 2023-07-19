<template>
  <n-space vertical>
    <section class="song-item flex items-center rounded-md px-4 py-2   wow animate__animated animate__fadeInUp"
      v-for="(song, index) in modelValue" :key="song.id">
      <n-h2 class="m-0 w-16 text-center">{{ (index + 1).toString().padStart(2, '0') }}</n-h2>
      <div class="rounded-lg bg-slate-400 aspect-square w-16 mx-2 overflow-hidden">
        <img v-lazy="getAlumb(song).picUrl + '?param=64y64'"  :alt="getAlumb(song).name">
      </div>
      <div class="flex-1">{{ song.name }}</div>
      <n-text
        class="aspect-square w-16 flex justify-center items-center">{{ formatDuration(song.dt ?? song.duration) }}</n-text>
      <IconButton class="mx-2" @click="emits('play', song)" />
      <IconButton class="mx-2">
        <FolderOpen />
      </IconButton>
    </section>
  </n-space>
</template>

<script setup lang="ts">
import { Album, Song } from '@/utils/neteasecloudmusicapi';
import { useThemeVars } from 'naive-ui';
import IconButton from './IconButton.vue';
import { FolderOpen } from '@vicons/ionicons5'
import WOW from 'wow.js';
defineProps<{
  modelValue: Array<Song>
}>()

const emits = defineEmits<{
  (e: 'play', treck: Song): void,
}>()

onMounted(() => {
  new WOW({
    boxClass: "wow", // 我理解为wow自带类名
    animateClass: "animate__animated", // 看成animate的类名
    offset: 0, //元素距浏览器底部偏移量
    mobile: true, // 是否在移动端奏效
    live: true, // 是否热更新元素
    scrollContainer: '.n-scrollbar-container',
    callback: function (box) {
      // the callback is fired every time an animation is started
      // the argument that is passed in is the DOM node being animated
    },
    resetAnimation: true, // reset animation on end (default is true)
  }).init();
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

const getAlumb = (song: Song): Album => {
  return song.al ?? song.album
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
