<template>
  <div class="nav-bar flex justify-between items-center h-16 px-4 ">
    <h1 class="title">QS</h1>
    <n-input v-model:value="searchText" type="text" placeholder="搜索..." class="max-w-md" clearable></n-input>
    <n-select class="w-64" v-model:value="currentTheme" size="medium" :options="themeOptions" />

    <n-button-group size="small">
      <n-button strong secondary @click="minimize">
        <template #icon>
          <n-icon :size="24">
            <Remove />
          </n-icon>
        </template>
      </n-button>
      <n-button strong secondary @click="toggleFullScreen">
        <template #icon>
          <n-icon :size="24">
            <Expand />
          </n-icon>
        </template>
      </n-button>
      <n-button strong secondary type="error" @click="close">
        <template #icon>
          <n-icon :size="24">
            <Close />
          </n-icon>
        </template>
      </n-button>
    </n-button-group>

  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { useStore } from "@/store";
import { Close, Expand, Remove } from '@vicons/ionicons5'
import { useStorage } from '@vueuse/core';

const mainStore = useStore()

const searchText = ref<string>()

type Theme = 'dark' | 'light' | 'system'

ipcRenderer.on('theme-changed', (e, isDark: boolean) => {
  mainStore.$patch(state => state.isDarkTheme = isDark)
})

const currentTheme = useStorage<Theme>('theme', 'system')
const themeOptions = [
  { label: 'dark', value: 'dark' },
  { label: 'light', value: 'light' },
  { label: 'system', value: 'system' }
]

watch(() => currentTheme.value, (newVal: 'dark' | 'light' | 'system') => {
  ipcRenderer.invoke("dark-mode:change", newVal);
}, {
  immediate: true
})

const close = () => {
  ipcRenderer.send('window-close')
}

let isFullScreen = false

const toggleFullScreen = () => {
  isFullScreen ? unmaximize() : maximize()
  isFullScreen = !isFullScreen
}

const maximize = () => {
  ipcRenderer.send('contrl-window', 'maximize')
}

const unmaximize = () => {
  ipcRenderer.send('contrl-window', 'restore')
}

const minimize = () => {
  ipcRenderer.send('window-minimize')
}

</script>

<style lang="scss" scoped>
.nav-bar {
  -webkit-app-region: drag;
  user-select: none;
}

.n-select,
.n-input,
button {
  -webkit-app-region: no-drag;
}

.title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: .25rem;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent
}
</style>
