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
    <n-text>{{albums}}</n-text>
  </div>
</template>

<script setup lang="ts">
import { useMessage, useThemeVars } from 'naive-ui'
import { ref, watchEffect } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/request/api'
import { Album } from '@/typings/neteasecloudmusicapi'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const themeVars = useThemeVars()
const content = ref<string>()
watchEffect(() => {
  content.value = route.query['content']?.toString()
})

const albums = ref<Array<Album>>()

const search = async () => {
  if (content.value !== undefined) {
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
  }
}
</script>

<style lang="scss" scoped>
.n-text {
  color: v-bind('themeVars.primaryColor');
}
</style>
