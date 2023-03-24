<template>
  <div class="play-card flex flex-col justify-evenly items-center rounded-xl bg-slate-200 m-4 p-4">
    <h3 style="font-size: 18px;font-weight: 600;">标题</h3>
    <img src="http://p1.music.126.net/5noG3sFSgZk5vHl9yV_5Mw==/109951165796624203.jpg?param=240y240" alt="小中心"
      class="w-full aspect-video rounded-xl overflow-hidden object-cover" style="-webkit-user-drag:none;" />
    <span style="font-size: 16px; font-weight: 400;">小众系</span>
    <span style="font-size: 14px; opacity: .85;">名称</span>
    <div class="grid items-center w-full gap-2" style="grid-template-columns: 40px 1fr 40px;">
      <span>00:00</span>
      <div class="flex-1">
        <n-slider v-model:value="value" :step="1">
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
import { Song } from '@/utils/neteasecloudmusicapi';
import IconButton from './IconButton.vue';
import { useThemeVars } from 'naive-ui'
import { CogSharp, PlaySkipBack, PlaySkipForward, Repeat, Shuffle } from '@vicons/ionicons5'

const themeVars = useThemeVars()
const value = ref<number>(50)

</script>

<style scoped>
.play-card {
  background-color: v-bind('themeVars.dividerColor');
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #2B9B9B, #218B8B);
  color: aliceblue;
}
</style>
