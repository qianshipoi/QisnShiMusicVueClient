<template>
  <div class="home">
    <navigation-bar></navigation-bar>
    <div style="flex: 1;background-color: #121212;">
      <ul>
        <li v-for="tag in tags"
            :key="tag.id">
          <song-item></song-item>
        </li>
      </ul>
      <h1>{{ store.counter }}</h1>
      <n-button @click="store.counter++">+</n-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../request/api'
import { PlaylistTag } from '../typings/neteasecloudmusicapi'
import { useStore } from '@/store/index'
import SongItem from '@/components/SongItem.vue'
import NavigationBar from '@/components/NavigationBar.vue'

const store = useStore()

const tags = ref<Array<PlaylistTag>>()

const getHot = async () => {
  const { status, data } = await api.playlist.hot()
  if (status === 200 && data.code === 200) {
    tags.value = data.tags
  }
}

onMounted(getHot)
</script>

<style scoped>
.home {
  display: flex;
  justify-content: space-between;
  height: 100%;
}
</style>
