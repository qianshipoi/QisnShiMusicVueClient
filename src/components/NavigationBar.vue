<template>
  <div class="navigation-bar">
    <n-menu mode="horizontal"
            style="width: 50%;"
            :options="menuOptions" />
    <search-box v-if="$route.name !== 'Search'"></search-box>
    <n-button type="primary"
              strong
              secondary
              circle
              size="medium"
              @click="changeTheme">
      <n-icon :component="themeModeIcon"
              :size="22">
      </n-icon>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { Moon, Sunny } from '@vicons/ionicons5'
import { useThemeVars, NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { ref, Component, h, shallowRef, watchEffect } from 'vue'
import SearchBox from './SearchBox.vue'
import { Home } from '@vicons/ionicons5'
import { RouterLink } from 'vue-router'

const themeModeIcon = shallowRef(Sunny)
const store = useStore()

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
        { default: () => '首页' }
      ),
    key: 'go-back-home',
    icon: renderIcon(Home)
  }
]

watchEffect(() => {
  themeModeIcon.value = store.isDarkTheme ? Moon : Sunny
})
const changeTheme = () => {
  store.$state.isDarkTheme = !store.$state.isDarkTheme
}
const themeVars = useThemeVars()
</script>

<style scoped>
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
