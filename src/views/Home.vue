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
        <n-space justify="space-between">
          <n-card v-for="playlist in tag.playlists"
                  class="playlist-card"
                  :title="playlist.name"
                  :key="playlist.id">
            <template #cover>
              <img :src="playlist.coverImgUrl"
                   style="width:14rem;height:14rem"
                   :alt="playlist.name" />
            </template>
          </n-card>
        </n-space>
      </n-tab-pane>
    </n-tabs>
    <control-bar></control-bar>
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

const store = useStore()
const themeVars = useThemeVars()
const message = useMessage()
const tags = ref<Array<PlaylistTag>>()
const selectedTagId = ref<number>()

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
  const { status, data } = await api.playlist.hot()
  if (status === 200 && data.code === 200) {
    tags.value = data.tags
  }
}

const getPlaylist = async (tag: PlaylistTag) => {
  const { status, data } = await api.playlist.topPlaylistHighquality(
    tag.name,
    undefined,
    undefined
  )
  if (status === 200 && data.code === 200) {
    tag.playlists = data.playlists
    message.success('获取数据成功' + tag.name)
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
.playlist-card {
  cursor: pointer;
  max-width: 14rem;
  transition: all ease-in-out 0.2s;
  &:hover {
    transform: perspective(1px) scale(1.01);
    box-shadow: 0 2px 10px v-bind('themeVars.primaryColor');
  }
}
</style>
