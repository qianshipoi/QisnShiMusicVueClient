<template>
  <n-space :vertical="true">
    <n-space align="center">
      <n-text>{{ t('settings.lang') }}</n-text>
      <n-select :value="selectedLocale" size="medium" :options="options" v-on:update-value="updateLocaleHandle" />
    </n-space>
    <n-space>
      <n-text>{{ t('settings.theme') }}</n-text>
      <n-select v-model:value="mainStore.currentTheme" size="medium" :options="themeOptions" />
    </n-space>

    <n-button @click="openNewWindow">打开新窗口</n-button>
  </n-space>
</template>

<script setup lang="ts">
import useLocale from "@/hook/useLocale";
import { useStore } from "@/store";
import { useIpcRenderer } from "@vueuse/electron";
const ipcRenderer = useIpcRenderer();

const mainStore = useStore()
const {
  i18n: { t },
  currentLocale,
  changeLocale
} = useLocale()

const options = [
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en-US'
  }
]

const themeOptions = [
  { label: 'dark', value: 'dark' },
  { label: 'light', value: 'light' },
  { label: 'system', value: 'system' }
]

const selectedLocale = ref(currentLocale.value)

const updateLocaleHandle = (newVal: string) => {
  if (selectedLocale.value === newVal) return;
  selectedLocale.value = newVal
  changeLocale(newVal)
}

const openNewWindow = () => {
  ipcRenderer.send("window-new", {
    route: "/helloworld",
    width: 500,
    height: 500,
  });
}

</script>
