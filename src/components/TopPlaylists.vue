<template>
  <n-card size="huge" content-style="padding:0">
    <GroupHeader title="Global Top 50">
      <template v-slot:more>
        <n-text>See all</n-text>
      </template>
    </GroupHeader>

    <n-scrollbar x-scrollable ref="scrollbar" :on-scroll="onScroll" class="top-songs">
      <div class="relative px-6">
        <n-space :wrap="false">
          <PlaylistCard class="cursor-pointer" :model-value="playlist" v-for="playlist in modelValue"
            :key="playlist.id" />
        </n-space>
      </div>
    </n-scrollbar>
  </n-card>
</template>

<script setup lang="ts">
import { Playlist } from '@/utils/neteasecloudmusicapi';
import { NScrollbar, useThemeVars } from 'naive-ui'
import PlaylistCard from '@/components/PlaylistCard.vue'
import GroupHeader from '@/components/GroupHeader.vue'

defineProps<{
  modelValue: Array<Playlist>
}>()

const themeVars = useThemeVars()

const scrollbar = ref<InstanceType<typeof NScrollbar>>();
let leftValue: number = 0

const onScroll = (e: Event) => {
  const content = (scrollbar.value!.scrollbarInstRef!.contentRef as HTMLDivElement);
  const container = (scrollbar.value!.scrollbarInstRef!.containerRef as HTMLDivElement);

  var parentClient = container.getBoundingClientRect()
  var subClient = content.getBoundingClientRect()

  leftValue = parentClient.left - subClient.left
}

onMounted(() => {
  const content = (scrollbar.value!.scrollbarInstRef!.contentRef as HTMLDivElement);
  const container = (scrollbar.value!.scrollbarInstRef!.containerRef as HTMLDivElement);
  content.addEventListener('wheel', (event) => {
    event.preventDefault()
    leftValue += event.deltaY;
    if (leftValue < 0) {
      leftValue = 0
    }
    if (leftValue + container.clientWidth > content.clientWidth) {
      leftValue = content.clientWidth - container.clientWidth
    }
    scrollbar.value?.scrollTo({ left: leftValue, top: 0, behavior: 'smooth' })
  })
})
</script>

<style lang="scss" scoped>
:deep(.top-songs) {
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 60px;
    height: 100%;
    pointer-events: none;
    background-image: linear-gradient(to right, v-bind('themeVars.bodyColor') 20%, transparent);
    // filter: blur(20px);
    // backdrop-filter: blur(20px)
  }

  &::after {
    right: 0;
    left: auto;
    background-image: linear-gradient(to right, transparent, v-bind('themeVars.bodyColor') 80%, v-bind('themeVars.bodyColor') 100%);
  }
}
</style>
