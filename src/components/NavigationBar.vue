<template>
  <n-card class="navigation-bar">
    <n-button type="primary"
              size="medium"
              @click="changeTheme">
      <n-icon :component="Play">
      </n-icon>
    </n-button>

  </n-card>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { Play } from '@vicons/ionicons5'
const store = useStore()
const changeTheme = () => {
  store.$state.isDarkTheme = !store.$state.isDarkTheme
}
</script>

<style scoped>
.navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  height: 6rem;
}
</style>
