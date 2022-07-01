<script lang="ts" setup>
import { darkTheme, NConfigProvider } from 'naive-ui'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-scrollbar style="max-height: 100vh; padding:10px;">
      <router-link to="/">
        <n-a>首页</n-a>
      </router-link>
      <router-link to="/about">
        <n-a>关于</n-a>
      </router-link>
      <router-view style="margin-bottom:20px"></router-view>
    </n-scrollbar>
    <n-global-style />
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
