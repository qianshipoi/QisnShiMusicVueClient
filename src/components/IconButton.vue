<template>
  <div
    class="flex justify-center items-center cursor-pointer rounded-lg w-12 aspect-square bg-white hover:bg-slate-100  hover:opacity-90 transition-all duration-300 shadow-lg">
    <n-icon :size="size" :color="themeVars.primaryColor">
      <slot>
        <Play />
      </slot>
    </n-icon>
  </div>
</template>

<script setup lang="ts">
import { Play } from '@vicons/ionicons5'
import { useThemeVars } from 'naive-ui';

withDefaults(defineProps<{
  size?: number
}>(), {
  size: 24
})

const themeVars = useThemeVars()
</script>
