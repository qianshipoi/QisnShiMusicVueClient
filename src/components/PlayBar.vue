<template>
  <div
    class="play-bar fixed left-0 bottom-0 right-0 z-10 grid gap-4 justify-center items-center mx-10 my-6 px-6 py-2 h-20 rounded-xl shadow-lg">
    <img class="aspect-square bg-slate-300"
      src="http://p1.music.126.net/5noG3sFSgZk5vHl9yV_5Mw==/109951165796624203.jpg?param=240y240" alt="小中心" />
    <h1>标题</h1>
    <div class="grid items-center w-full gap-2" style="grid-template-columns: 40px 1fr 40px;">
      <span>00:00</span>
      <div class="flex-1">
        <n-slider :step="1">
          <template #thumb>
            <n-icon-wrapper :size="24" :border-radius="12">
              <n-icon :size="18" :component="CogSharp" />
            </n-icon-wrapper>
          </template>
        </n-slider>
      </div>
      <span>03:20</span>
    </div>
    <div class="flex justify-evenly w-full items-center">
      <IconButton class="w-8 h-8" :size="16">
        <template #default>
          <Repeat />
        </template>
      </IconButton>
      <IconButton class="w-8 h-8" :size="16">
        <template #default>
          <PlaySkipBack />
        </template>
      </IconButton>
      <IconButton />
      <IconButton class="w-8 h-8" :size="16">
        <template #default>
          <PlaySkipForward />
        </template>
      </IconButton>
      <IconButton class="w-8 h-8" :size="16">
        <template #default>
          <Shuffle />
        </template>
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import IconButton from './IconButton.vue';
import { CogSharp, PlaySkipBack, PlaySkipForward, Repeat, Shuffle } from '@vicons/ionicons5'
const themeVars = useThemeVars()
</script>

<style scoped>
.play-bar {
  background-color: var(--n-color);
  border: 1px solid v-bind('themeVars.borderColor');
  grid-template-columns: 56px 1fr 4fr 240px;
}
</style>
