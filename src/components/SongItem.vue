<template>
  <div class="song-item">
    <div>1</div>
    <img style="width:52px; height:52px"
         src="https://oss.kuriyama.top/static/nakiri.png"
         alt="nakiri" />
    <div>
      <h2>Play It Safe</h2>
      <h3>Julia Wolf</h3>
    </div>
    <div>
      <h3>Play It Safe</h3>
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

    <span>2:12</span>
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
