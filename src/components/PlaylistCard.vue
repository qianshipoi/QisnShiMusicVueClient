<template>
  <n-card class="playlist-card" embedded>
    <div class="relative w-48 aspect-square rounded-2xl bg-pink-200 overflow-hidden">
      <img @click.self="emits('click')" :src="modelValue.coverImgUrl + '?param=180y180'" :alt="modelValue.name"
        style="-webkit-user-drag: none;">
      <IconButton @click.prevent="emits('play')" class="absolute right-6 bottom-6 w-12" />
    </div>
    <n-h4 @click="emits('click')" class="w-48 mx-0 my-2 cursor-pointer">{{ modelValue.name }}</n-h4>
    <p class="whitespace-pre-wrap; w-48">{{ modelValue.desceiption }}</p>
  </n-card>
</template>

<script setup lang="ts">
import { Playlist } from '@/utils/neteasecloudmusicapi';
import { useThemeVars } from 'naive-ui'
import IconButton from './IconButton.vue';

defineProps<{
  modelValue: Playlist
}>()

const emits = defineEmits<{
  (e: 'play'): void,
  (e: 'click'): void
}>()

const themeVars = useThemeVars()
</script>
<style lang="scss" scoped>
.playlist-card {
  cursor: pointer;
  margin-top: 4px;
  transition: all ease-in-out 0.2s;

  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
}
</style>
