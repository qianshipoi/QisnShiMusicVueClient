<template>
  <n-space :vertical="true">
    <n-space align="center">
      <n-text>{{ t('settings.lang') }}</n-text>
      <n-select :value="selectedLocale" size="medium" :options="options" v-on:update-value="updateLocaleHandle" />
    </n-space>
    <n-space>
      <n-text>{{ t('settings.theme') }}</n-text>
      {{ t('settings.dark') }}
      <n-switch v-model:value="store.isDarkTheme" size="medium" />
      {{ t('settings.light') }}
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import useLocale from "@/hook/useLocale";
import { useStore } from "@/store";

const store = useStore()

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
const {
  i18n: { t },
  currentLocale,
  changeLocale
} = useLocale()

const selectedLocale = ref(currentLocale.value)

const updateLocaleHandle = (newVal: string) => {
  if (selectedLocale.value === newVal) return;
  selectedLocale.value = newVal
  changeLocale(newVal)
}

</script>

<style scoped>
</style>
