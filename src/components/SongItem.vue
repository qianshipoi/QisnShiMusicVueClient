<template>
  <div class="song-item">
    <n-text>1</n-text>
    <img style="width:52px; height:52px"
         src="https://oss.kuriyama.top/static/nakiri.png"
         alt="nakiri" />
    <div>
      <n-h3>Play It Safe</n-h3>
      <n-h4>Julia Wolf</n-h4>
    </div>
    <div>
      <n-h4>Play It Safe</n-h4>
    </div>
    <n-button quaternary
              circle
              type="primary">
      <template #icon>
        <n-icon :size="28">
          <HeartOutline />
        </n-icon>
      </template>
    </n-button>

    <n-text>2:12</n-text>
    <n-button quaternary
              circle
              type="primary">
      <template #icon>
        <n-icon :size="28">
          <EllipsisVertical />
        </n-icon>
      </template>
    </n-button>

  </div>
</template>

<script setup lang="ts">
import { HeartOutline, EllipsisVertical } from '@vicons/ionicons5'
</script>

<style lang="scss" scoped>
.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: lighten($default-color, 40);
  }
}
</style>
