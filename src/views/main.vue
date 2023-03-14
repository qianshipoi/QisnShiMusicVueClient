<template>
  <n-layout class="h-full">
    <n-layout-header bordered>
      <NavBar />
    </n-layout-header>
    <n-layout has-sider style="height:calc(100% - 64px);">
      <n-layout-sider bordered collapse-mode="width" class="h-full" :collapsed-width="64" :width="240"
        :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu :collapsed="collapsed" :value="currentMenu" @update-value="updateCurrentMenu" :collapsed-width="64"
          :collapsed-icon-size="22" :options="menuOptions" />
      </n-layout-sider>
      <n-layout class="relative h-full">
        <n-scrollbar>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" :key="$route.name" v-if="$route.meta.keepActive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepActive" />
          </router-view>
          <Transition name="playbar-animate">
            <PlayBar v-if="displayPlaybar" />
          </Transition>
          <n-back-top />
        </n-scrollbar>
        <!-- <n-scrollbar :class="['main-scrollbar', store.isDarkTheme ? 'bg-black' : 'bg-white']">

        </n-scrollbar> -->
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { Settings, Apps, GlobeSharp } from '@vicons/ionicons5'
import PlayBar from '@/components/PlayBar.vue'
import NavBar from '@/components/NavBar.vue'
import { useStore } from '@/store'
import { useMusicStore } from '@/store/music'
import useLocale from '@/hook/useLocale'

const mainStore = useStore()
const musicStote = useMusicStore()
const route = useRoute()
const { i18n: { t } } = useLocale();

watch(() => route.name, (newVal) => {
  if (newVal?.toString() === "Home") {
    mainStore.$patch((state) => state.displayPlayBar = false);
  } else {
    mainStore.$patch((state) => state.displayPlayBar = true);
  }
}, {
  immediate: true
})

const displayPlaybar = computed(() => mainStore.displayPlayBar && musicStote.display)


function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menu = [
  { name: 'Home', title: () => t('nav.home'), icon: Apps },
  { name: 'Found', title: () => t('nav.found'), icon: GlobeSharp },
  { name: 'Settings', title: () => t('nav.settings'), icon: Settings }
]
const menuOptions: MenuOption[] = []
menu.forEach(item => {
  menuOptions.push({
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: item.name
          }
        },
        { default: () => item.title() }
      ),
    key: item.name,
    icon: renderIcon(item.icon)
  })
})


const collapsed = ref(false)
const currentMenu = ref<string>(route.name as string);

const updateCurrentMenu = (e: string) => {
  currentMenu.value = e;
}

</script>

<style scoped>
.playbar-animate-enter-active {
  animation: zoomIn 0.6s;
}

.playbar-animate-leave-active {
  animation: zoomOut 0.6s;
}
</style>
