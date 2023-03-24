<template>
  <div>

    <GroupHeader title="Top Artists" @more-click="moreClick" />

    <n-grid cols="2 260:3" x-gap="8" y-gap="8" class="px-8">
      <n-grid-item v-for="item in props.modelValue">
        <div class="flex rounded-xl bg-slate-400 aspect-square overflow-hidden">
          <img :src="item.picUrl + '?param=80y80'" :alt="item.name">
        </div>
        <n-text class="block text-center my-2">{{ item.name }}</n-text>
      </n-grid-item>
    </n-grid>

  </div>
</template>

<script setup lang="ts">
import { Artist } from '@/utils/neteasecloudmusicapi';
import GroupHeader from './GroupHeader.vue';

const props = defineProps<{
  modelValue: Array<Artist>
}>()

const moreClick = (e: Event) => {
  console.log(e);
}

</script>
