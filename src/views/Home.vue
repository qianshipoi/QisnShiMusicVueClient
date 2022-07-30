<template>
  <div class="home">
    <n-tabs type="segment"
            :value="selectedTagId"
            :on-update:value="tabsChanged"
            animated>
      <n-tab-pane :name="tag.id"
                  v-for="tag in tags"
                  display-directive="show:lazy"
                  :key="tag.id"
                  :tab="tag.name">
        <card-list-base :data="tag.playlists"
                        name="id"
                        :skeleton-count="10"
                        :is-busy="isBusy && tag.playlists?.length === 0">
          <template #default="{ item }">
            <playlist-card :playlist="item"></playlist-card>
          </template>
        </card-list-base>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { api } from '../request/api'
import { PlaylistTag } from '../typings/neteasecloudmusicapi'
import { useMessage } from 'naive-ui'
import PlaylistCard from '@/components/PlaylistCard.vue'
import { useMediaQuery } from '@vueuse/core'
import CardListBase from '@/components/CardListBase.vue'

const isLargeScreen = useMediaQuery('(min-width: 500px)')
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
  overflow: hidden;
  :deep(.n-tabs) {
    width: 100%;
  }
  :deep(.n-tabs-nav) {
    width: 100%;
  }
  :deep(.n-tabs .n-tabs-rail) {
    display: v-bind('isLargeScreen ? `flex` : `block`');
  }
}
</style>
