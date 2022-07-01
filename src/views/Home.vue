<template>
  <div class="home">
    <ul>
      <li v-for="tag in tags"
          :key="tag.id">{{ tag.name }}</li>
    </ul>
    <h1>{{ store.counter }}</h1>
    <n-button @click="store.counter++">+</n-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '../request/api'
import { PlaylistTag } from '../typings/neteasecloudmusicapi'
import { useStore } from '@/store/index'

const store = useStore()

const tags = ref<Array<PlaylistTag>>()

const getHot = async () => {
  const { status, data } = await api.playlist.hot()
  if (status === 200 && data.code === 200) {
    tags.value = data.tags
    console.log(tags.value)
  }
}

onMounted(() => {
  getHot()
})
</script>

<style scoped>
</style>
