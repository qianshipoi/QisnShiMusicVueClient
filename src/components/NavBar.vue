<template>
  <div class="flex justify-between items-center h-16 px-4 ">
    <h1 class="title">QS</h1>
    <n-input v-model:value="searchText" type="text" placeholder="搜索..." class="max-w-md" clearable></n-input>
    <n-button type="primary" size="medium" @click="themeChange">切换</n-button>
  </div>
</template>

<script setup lang="ts">
import { ipcRenderer } from 'electron';
import { useStore } from "@/store";

const store = useStore()

const searchText = ref<string>()

let isDark: boolean = false

const themeChange = async () => {
  ipcRenderer.invoke("dark-mode:change", isDark ? "light" : "dark");

  store.$patch(state => state.isDarkTheme = !isDark)

  isDark = !isDark
}

</script>

<style lang="scss" scoped>
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
