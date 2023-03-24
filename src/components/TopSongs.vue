<template>
  <n-card content-style="padding:8px">

    <GroupHeader title="Top Songs">
      <template v-slot:more>
        <n-text>See all</n-text>
      </template>
    </GroupHeader>

    <SongList :model-value="modelValue" />

  </n-card>
</template>

<script setup lang="ts">
import { Song } from '@/utils/neteasecloudmusicapi';
import GroupHeader from './GroupHeader.vue';
import SongList from './SongList.vue';

defineProps<{
  modelValue: Array<Song>
}>()

</script>
