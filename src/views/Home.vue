<template>
  <div class="home">
    <n-tabs type="segment"
            :value="selectedTagId"
            :on-update:value="tabsChanged"
            animated>
      <n-tab-pane :name="tag.id"
                  v-for="tag in tags"
                  :key="tag.id"
                  :tab="tag.name">
        <n-space v-if="isBusy"
                 justify="space-between">
          <playlist-card v-for="item in 10"
                         :key="item"></playlist-card>
        </n-space>

        <n-space v-else
                 justify="space-between">
          <playlist-card v-for="playlist in tag.playlists"
                         :key="playlist.id"
                         :playlist="playlist"></playlist-card>
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, watch } from 'vue'
import { api } from '../request/api'
import { PlaylistTag } from '../typings/neteasecloudmusicapi'
import { useStore } from '@/store/index'
import SongItem from '@/components/SongItem.vue'
import NavigationBar from '@/components/NavigationBar.vue'
import ControlBar from '@/components/ControlBar.vue'
import { useMessage, useThemeVars } from 'naive-ui'
import { useMusicStore } from '@/store/music'
import PlaylistCard from '@/components/PlaylistCard.vue'

const musicStore = useMusicStore()
const store = useStore()
const themeVars = useThemeVars()
const message = useMessage()
const tags = ref<Array<PlaylistTag>>()
const selectedTagId = ref<number>()
const isBusy = ref(false)

watchEffect(() => {
  if (tags.value && tags.value.length > 0) {
    selectedTagId.value = tags.value[0].id
    getPlaylist(tags.value[0])
  }
})

const tabsChanged = (val: number) => {
  const tag = tags.value?.find((x) => x.id == val)
  selectedTagId.value = tag?.id
  if (tag && (!tag.playlists || tag.playlists.length === 0)) {
    getPlaylist(tag)
  }
}

const getHot = async () => {
  isBusy.value = true
  try {
    const { status, data } = await api.playlist.hot()
    if (status === 200 && data.code === 200) {
      tags.value = data.tags
    }
  } finally {
    isBusy.value = false
  }
}

const getPlaylist = async (tag: PlaylistTag) => {
  isBusy.value = true
  try {
    const { status, data } = await api.playlist.topPlaylistHighquality(
      tag.name,
      undefined,
      undefined
    )
    if (status === 200 && data.code === 200) {
      tag.playlists = data.playlists
      message.success('获取数据成功' + tag.name)
    }
  } finally {
    isBusy.value = false
  }
}

onMounted(getHot)
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: space-between;
  height: 100%;
}
</style>
