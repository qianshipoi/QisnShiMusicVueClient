<template>
  <div class="playlists">
    <n-tabs type="segment" :value="selectedTagId" :on-update:value="tabsChanged" animated>
      <n-tab-pane :name="tag.id" v-for="tag in tags" display-directive="show:lazy" :key="tag.id"
        :tab="t(`home.cats.${tag.name}`)">
        <card-list-base :data="tag.playlists" name="id" :skeleton-count="10"
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
import { api } from '@/request/api'
import { PlaylistTag, Playlist } from '@/typings/neteasecloudmusicapi'
import { useMessage } from 'naive-ui'
import PlaylistCard from '@/components/PlaylistCard.vue'
import CardListBase from '@/components/CardListBase.vue'
import { useStore } from '@/store'
import useLocale from '@/hook/useLocale'

const message = useMessage()
const mainStore = useStore()
const {
  i18n: { t }
} = useLocale()
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
      tag.playlists = data.playlists.map((playlist: Playlist) =>
        formatPlaylistImage(playlist)
      )
      message.success('获取数据成功' + tag.name)
    }
  } finally {
    isBusy.value = false
  }
}

function formatPlaylistImage(
  playlist: Playlist,
  w: number = 200,
  h: number = 200
): Playlist {
  if (playlist.coverImgUrl) {
    playlist.coverImgUrl += `?param=${w}y${h}`
  }
  return playlist
}

onMounted(getHot)
</script>

<style lang="scss" scoped>
.playlists {
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
    display: v-bind('mainStore.isLargeScreen ? `flex` : `block`');
  }
}
</style>
