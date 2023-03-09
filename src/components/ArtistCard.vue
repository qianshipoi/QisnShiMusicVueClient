<template>
  <n-card class="artist-card" embedded>
    <template #header>
      <n-skeleton v-if="!artist" text :repeat="1" width="80%" height="26px" />
      <template v-else>
        {{ artist.name }}
      </template>
    </template>
    <template #cover>
      <n-skeleton width="100%" v-if="!artist" :sharp="false" style="padding-top:100%" />
      <n-image :src="artist.img1v1Url" v-else object-fit="cover" :preview-disabled="true" lazy width="100%"
        @click="$router.push({ name: 'Artist', params: { id: artist?.id } })" :alt="artist.name">
        <template #placeholder>
          <n-skeleton :sharp="false" style="padding-top: 100%;" width="100%" />
        </template>
      </n-image>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { Artist } from '@/typings/neteasecloudmusicapi'
import { useThemeVars } from 'naive-ui'

type Props = {
  artist?: Artist
}

defineProps<Props>()

const themeVars = useThemeVars()
</script>

<style lang="scss" scoped>
.artist-card {
  cursor: pointer;
  transition: all ease-in-out 0.2s;

  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }

  :deep(.n-image) {
    width: 100%;
    display: flex;
    border-radius: 50%;
    aspect-ratio: 1/1;
  }
}
</style>
