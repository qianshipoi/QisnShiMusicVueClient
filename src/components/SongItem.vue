<template>
  <div class="song-item">
    <n-text>1</n-text>
    <img style="width:52px; height:52px"
         src="https://oss.kuriyama.top/static/nakiri.png"
         alt="nakiri" />
    <div>
      <n-p>Play It Safe</n-p>
      <n-p>Julia Wolf</n-p>
    </div>
    <div>
      <n-p>Play It Safe</n-p>
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
  height: 80px;
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
