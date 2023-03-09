<template>
  <div class="control-bar">
    <img src="https://oss.kuriyama.top/static/akua.png" style="width:4rem; height: 4rem; border-radius: 0.75rem;"
      alt="封面">
    <n-space class="buttons">
      <n-button tertiary :color="themeVars.primaryColor" circle>
        <template #icon>
          <n-icon :size="22" :component="PlaySkipBack">
          </n-icon>
        </template>
      </n-button>
      <n-button tertiary :color="themeVars.primaryColor" size="large" @click="playOrPauseClick" circle>
        <template #icon>
          <n-icon :size="28" :component="playPauseButtonIcon">
          </n-icon>
        </template>
      </n-button>
      <n-button tertiary :color="themeVars.primaryColor" circle>
        <template #icon>
          <n-icon :size="22" :component="PlaySkipForward">
          </n-icon>
        </template>
      </n-button>
      <n-slider style="width:20rem;" v-model:value="playProgress">
        <template #thumb>
          <n-icon-wrapper :size="24" :border-radius="12">
            <n-icon :size="12" :component="MusicalNotes" />
          </n-icon-wrapper>
        </template>
      </n-slider>
      <n-slider style="width:6rem;margin: 10px;" v-model:value="volume">
        <template #thumb>
          <n-icon-wrapper :size="24" :border-radius="12">
            <n-icon :size="12" :component="volumeIcon" />
          </n-icon-wrapper>
        </template>
      </n-slider>
    </n-space>
    <n-text class="lyrics-text">
      Play It Safe</n-text>
  </div>
</template>

<script setup lang="ts">
import {
  PlaySkipBack,
  Pause,
  Play,
  PlaySkipForward,
  MusicalNotes,
  VolumeLow,
  VolumeHigh,
  VolumeMedium
} from '@vicons/ionicons5'
import { Component } from 'vue'
import { useMessage, useThemeVars } from 'naive-ui'

const message = useMessage()
const themeVars = useThemeVars()

const playProgress = ref(0)
const volume = ref(0)
const isPlaying = ref(false)
const playPauseButtonIcon = shallowRef<Component>(Play)

watchEffect(() => {
  playPauseButtonIcon.value = isPlaying.value ? Pause : Play
})

const playOrPauseClick = (): void => {
  isPlaying.value = !isPlaying.value
  message.success('play status:' + isPlaying.value)
}

const volumeIcon = computed(() => {
  let result = VolumeLow
  if (volume.value > 30) {
    result = VolumeMedium
  } else if (volume.value > 60) {
    result = VolumeHigh
  }
  return result
})
</script>

<style lang="scss" scoped>
.control-bar {
  position: fixed;
  left: 0;
  bottom: 1rem;
  display: flex;
  align-items: center;
  margin: 0 1rem 0 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: skyblue;
  width: calc(100% - 2rem);
  height: 6rem;
  box-sizing: border-box;
  box-shadow: 0 4px 10px skyblue;
}

.buttons {
  margin-left: 2rem;
  display: flex;
  align-items: center;

  &>button {
    margin: 0 0.5rem;
  }
}

.lyrics-text {
  flex: 1;
  font-size: 2rem;
  font-weight: 800;
}
</style>
