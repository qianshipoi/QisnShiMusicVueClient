<script lang="ts" setup>
import { darkTheme, NConfigProvider, lightTheme } from 'naive-ui'
</script>

<template>
  <n-config-provider :theme="lightTheme">
    <n-message-provider>
      <n-scrollbar style="max-height: 100vh; padding:10px;">
        <router-view style="margin-bottom:20px"></router-view>
      </n-scrollbar>
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
