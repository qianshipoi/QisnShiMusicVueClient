<template>
  <n-card class="album-card" embedded>
    <template #header>
      <n-skeleton v-if="!album" text :repeat="1" width="80%" height="26px" />
      <template v-else>
        {{ album.name }}
      </template>
    </template>
    <template #cover>
      <n-skeleton width="100%" v-if="!album" :sharp="false" style="padding-top:100%" />
      <n-image :src="album.picUrl" v-else :preview-disabled="true" lazy width="100%"
        @click="$router.push({ name: 'Album', params: { id: album?.id } })" :alt="album.name">
        <template #placeholder>
          <n-skeleton :sharp="false" style="padding-top: 100%;" width="100%" />
        </template>
      </n-image>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { Album } from '@/utils/neteasecloudmusicapi'
import { useThemeVars } from 'naive-ui'

type Props = {
  album?: Album
}

defineProps<Props>()

const themeVars = useThemeVars()
</script>

<style lang="scss" scoped>
.album-card {
  cursor: pointer;
  transition: all ease-in-out 0.2s;

  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }

  :deep(.n-image) {
    width: 100%;
    display: flex;
    aspect-ratio: 1/1;
  }
}
</style>
