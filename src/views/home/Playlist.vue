<template>
  <div>
    Playlist : {{ route.params.id }}

    {{playlistDetail}}
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/request/api'
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue-demi'

const message = useMessage()
const route = useRoute()
const router = useRouter()
const playlistDetail = ref<any>()

const getPlaylistDetail = async (id: number) => {
  const { status, data } = await api.playlist.detail(id)
  if (status === 200 && data.code === 200) {
    playlistDetail.value = data.playlist
  } else {
    message.error('获取歌单详细信息异常')
    router.back()
  }
}

onMounted(() => {
  getPlaylistDetail(Number(route.params['id']))
})
</script>

<style scoped>
</style>
