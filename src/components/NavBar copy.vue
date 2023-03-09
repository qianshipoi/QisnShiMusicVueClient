<template>
  <div class="h-12 w-full bg-white flex justify-between px-4 py-2"
    :class="[store.isDarkTheme ? 'bg-black' : 'bg-white']" v-if="!store.isLargeScreen">
    <n-icon size="28" @click="openMenu">
      <MenuIcon></MenuIcon>
    </n-icon>
    <n-icon size="28">
      <SearchIcon></SearchIcon>
    </n-icon>

    <n-drawer v-model:show="displayMenu" style="padding:0" placement="left">
      <n-drawer-content title="Free Music List">
        <n-menu :default-value="menuDefaultValue" :options="menuOptions" @update:value="handleUpdateValue" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import useLocale from '@/hook/useLocale'
import router from '@/route'
import { useStore } from '@/store'
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  HomeOutline as HomeIcon,
  HeartOutline as HeartOutlineIcon,
  List as ListIcon,
  Settings as SettingsIcon
} from '@vicons/ionicons5'
import { MenuOption, NIcon, useMessage } from 'naive-ui'
import { Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const store = useStore()
const displayMenu = ref(false)
const message = useMessage()

const { i18n: { t } } = useLocale()

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
    key: 'home',
    icon: renderIcon(HomeIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Favorite'
          }
        },
        { default: () => t('nav.favorite') }
      ),
    key: 'favorite',
    icon: renderIcon(HeartOutlineIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Playlists'
          }
        },
        { default: () => t('nav.playlists') }
      ),
    key: 'playlists',
    icon: renderIcon(ListIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Settings'
          }
        },
        { default: () => t('nav.settings') }
      ),
    key: 'settings',
    icon: renderIcon(SettingsIcon)
  }
]
const route = useRoute()

const menuDefaultValue = ref(route.name?.toString().toLocaleLowerCase())

const handleUpdateValue = (key: string, item: MenuOption) => {
  menuDefaultValue.value = key
  displayMenu.value = false
}

const openMenu = () => {
  displayMenu.value = true
}
</script>

<style lang="scss" scoped>
:deep(.n-drawer-body > .n-drawer-body-content-wrapper) {
  padding: 0;
}
</style>
