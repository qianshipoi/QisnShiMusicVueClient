<template>
  <div>
    <n-input-group>
      <n-input placeholder="input content to search"
               v-model:value="content"
               :style="{ width: '30%', textAlign:'left'}"
               autofocus
               @keypress.enter="search" />
      <n-button type="primary"
                @click="search"
                ghost>
        搜索
      </n-button>
    </n-input-group>
    <n-space v-if="isBusy"
             justify="space-between">
      <album-card v-for="item in 10"
                  :key="item"></album-card>
    </n-space>
    <n-space v-else
             justify="space-between">
      <album-card :album="album"
                  v-for="album in albums"
                  :key="album.id"></album-card>
    </n-space>

  </div>
</template>

<script setup lang="ts">
import { useMessage, useThemeVars } from 'naive-ui'
import { onMounted, ref, watchEffect } from 'vue-demi'
import { useRoute } from 'vue-router'
import { api } from '@/request/api'
import { Album } from '@/typings/neteasecloudmusicapi'
import AlbumCard from '@/components/AlbumCard.vue'

const route = useRoute()
const message = useMessage()
const themeVars = useThemeVars()
const content = ref<string>()
const isBusy = ref(false)
watchEffect(() => {
  content.value = route.query['content']?.toString()
})

onMounted(() => {
  if (route.query['content']) {
    search()
  }
})

const albums = ref<Array<Album>>()

const search = async () => {
  if (content.value !== undefined) {
    isBusy.value = true
    try {
      const { status, data } = await api.playlist.search(
        content.value,
        undefined,
        0,
        10
      )
      if (status === 200 && data.code === 200) {
        albums.value = data.result.albums
      } else {
        message.error(data.msg)
      }
    } finally {
      isBusy.value = false
    }
  }
}
</script>

<style lang="scss" scoped>
.n-text {
  color: v-bind('themeVars.primaryColor');
}
</style>
