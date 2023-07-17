<script lang="ts" setup>
import {
  darkTheme,
  NConfigProvider,
  lightTheme,
  useThemeVars,
  zhCN,
  enUS,
  dateZhCN,
  dateEnUS
} from 'naive-ui'
import { useStore } from './store'
import WOW from 'wow.js'
import { useMediaQuery } from '@vueuse/core'
import { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import useLocale from './hook/useLocale'
import { ipcRenderer } from 'electron';

const themeVars = useThemeVars()
const mainStore = useStore()
const { currentLocale } = useLocale()

const local = ref(zhCN)
const dateLocal = ref(dateZhCN)

watch(
  () => currentLocale.value,
  (newVal) => {
    if (newVal === 'zh-CN') {
      local.value = zhCN
      dateLocal.value = dateZhCN
    } else {
      local.value = enUS
      dateLocal.value = dateEnUS
    }
  }
)

onMounted(() => {
  nextTick(() => {
    new WOW({
      animateClass: 'animated',
      scrollContainer: '.main-scrollbar > .n-scrollbar-container',
      offset: -400
    }).init()
  })
})

const themeMode = ref<BuiltInGlobalTheme>(darkTheme)

const isLargeScreen = useMediaQuery('(min-width: 500px)')

ipcRenderer.on('theme-changed', (e, isDark: boolean) => {
  mainStore.$patch(state => state.isDark = isDark)
})

type Theme = 'dark' | 'light' | 'system'

watch(() => mainStore.currentTheme, (newVal: Theme) => {
  ipcRenderer.invoke("dark-mode:change", newVal);
}, {
  immediate: true
})

watchEffect(() => {
  mainStore.$patch((x) => (x.isLargeScreen = isLargeScreen.value))
})

watchEffect(() => {
  themeMode.value = mainStore.isDark ? darkTheme : lightTheme
})
</script>

<template>
  <n-config-provider :theme="themeMode" class="h-full" :locale="mainStore.local" :date-locale="mainStore.dateLocal">
    <n-message-provider>
      <n-loading-bar-provider>
        <router-view></router-view>
        <n-global-style />
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: sans-serif, Avenir, Helvetica, Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.bg-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  filter: v-bind('mainStore.isDark ? `brightness(20%)` : `brightness(1)`');
  object-fit: cover;
  width: 100vw;
  height: 100vh;
}

.n-h1,
.n-h2,
.n-h3,
.n-h4,
.n-h5,
.n-h6,
.n-p,
.n-text,
.n-ellipsis {
  color: v-bind('themeVars.primaryColor');
  transition: 0.3s var(--cubic-bezier-ease-in-out);
}
</style>
