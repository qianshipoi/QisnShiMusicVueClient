<script lang="ts" setup>
import { darkTheme, NConfigProvider, lightTheme } from 'naive-ui'
import NavigationBar from './components/NavigationBar.vue'
import ControlBar from './components/ControlBar.vue'
import { useMusicStore } from './store/music'
import { ref, watchEffect } from 'vue-demi'
import { useStore } from './store'

const musicStore = useMusicStore()
musicStore.$state.display = false

const mainStore = useStore()
const themeMode = ref(darkTheme)
watchEffect(() => {
  themeMode.value = mainStore.isDarkTheme ? darkTheme : lightTheme
})
</script>

<template>
  <n-config-provider :theme="themeMode">
    <n-message-provider>
      <navigation-bar></navigation-bar>
      <div style="height:6rem"></div>
      <n-scrollbar style="height: calc(100vh - 6rem);">

        <router-view v-slot="{ Component }"
                     style="margin-bottom:20px;padding:10px;">
          <keep-alive>
            <component :is="Component"
                       v-if="$route.meta.keepActive" />
          </keep-alive>
          <component :is="Component"
                     v-if="!$route.meta.keepActive" />
        </router-view>
      </n-scrollbar>
      <control-bar v-if="musicStore.$state.display"></control-bar>
      <n-global-style />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
