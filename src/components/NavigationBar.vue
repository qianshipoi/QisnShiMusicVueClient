<template>
  <div class="navigation-bar">
    <n-menu mode="horizontal" style="width: 50%;" :options="menuOptions" />
    <search-box v-if="$route.name !== 'Search'"></search-box>
    <n-button @click="switchLang">Lang</n-button>

    <n-button type="primary" strong secondary circle style="margin-left:1rem" size="medium" @click="changeTheme">
      <n-icon :component="themeModeIcon" :size="22">
      </n-icon>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import {
  Moon,
  Sunny,
  Home,
  TvOutline as TvOutlineIcon
} from '@vicons/ionicons5'
import { useThemeVars, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { Component } from 'vue'
import SearchBox from './SearchBox.vue'
import { RouterLink } from 'vue-router'
import useLocale from '@/hook/useLocale'

const store = useStore()
const themeVars = useThemeVars()
const {
  i18n: { t },
  currentLocale,
  changeLocale
} = useLocale()

const switchLang = () => {
  if (currentLocale.value === 'zh-CN') {
    changeLocale('en-US')
  } else {
    changeLocale('zh-CN')
  }
}

const themeModeIcon = shallowRef<Component>(Sunny)

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Home'
          }
        },
        { default: () => t('nav.home') }
      ),
    key: 'go-back-home',
    icon: renderIcon(Home)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Found'
          }
        },
        { default: () => t('nav.found') }
      ),
    key: 'go-back-home',
    icon: renderIcon(TvOutlineIcon)
  }
]

watchEffect(() => {
  themeModeIcon.value = store.isDarkTheme ? Moon : Sunny
})

const changeTheme = () => {
  store.$patch((state) => (state.isDarkTheme = !state.isDarkTheme))
}
</script>

<style lang="scss" scoped>
.navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  height: 6rem;
  box-sizing: border-box;
  box-shadow: 0 2px 4px v-bind('themeVars.primaryColor');
}
</style>
