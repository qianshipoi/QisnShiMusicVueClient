<template>
  <div class="navigation-bar">
    <n-space>

    </n-space>

    <search-box></search-box>
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
import { useThemeVars , NSpace} from 'naive-ui'
import { shallowRef, watchEffect } from 'vue-demi'
import SearchBox from './SearchBox.vue'

const themeModeIcon = shallowRef(Sunny)
const store = useStore()
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
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  height: 6rem;
  box-sizing: border-box;
  box-shadow: 0 2px 4px v-bind('themeVars.primaryColor');
}
</style>
