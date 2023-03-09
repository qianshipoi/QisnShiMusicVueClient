<template>
  <div class="fixed bottom-0 left-0 right-0 h-16 bg-red-300
  rounded-sm flex flex-col">
    <n-slider v-model:value="progressValue" class="-mt-2">
      <template #thumb>
        <n-icon-wrapper :size="24" :border-radius="12">
          <n-icon :size="18" :component="MusicalNoteSharp" />
        </n-icon-wrapper>
      </template>
    </n-slider>

    <div class="px-2 flex items-center justify-between">
      <img src="https://oss.kuriyama.top/static/akua.png" class="w-12 h-12 rounded-lg" />
      <div class="flex  flex-col">
        <n-h2 class="text-lg m-0">wine royalty free vlog music</n-h2>
        <n-p class="m-0">Lukrembo</n-p>
      </div>
      <div class="flex justify-between items-center w-20">
        <n-icon :size="20">
          <PlaySkipBack />
        </n-icon>
        <n-icon :size="24">
          <Play v-if="!isPlaying" />
          <Pause v-else />
        </n-icon>
        <n-icon :size="20">
          <PlaySkipForward />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MusicalNoteSharp, PlaySkipBack, Play, Pause, PlaySkipForward } from '@vicons/ionicons5'

const progressValue = ref(0)
const isPlaying = ref(false)

</script>

<style scoped>
</style>
