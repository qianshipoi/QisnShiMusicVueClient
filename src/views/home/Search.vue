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
    <n-collapse :default-expanded-names="['1','2','3']"
                display-directive="show">
      <n-collapse-item title="专辑"
                       name="1">
        <card-list-base :data="searchResult.albums"
                        :skeleton-count="10"
                        name="id"
                        :is-busy="isBusy">
          <template #default="{ item }">
            <album-card :album="item"></album-card>
          </template>
        </card-list-base>
      </n-collapse-item>
      <n-collapse-item title="歌单"
                       name="2">
        <card-list-base :data="searchResult.playlists"
                        :skeleton-count="10"
                        name="id"
                        :is-busy="isBusy">
          <template #default="{ item }">
            <playlist-card :playlist="item"></playlist-card>
          </template>
        </card-list-base>
      </n-collapse-item>
      <n-collapse-item title="艺人"
                       name="3">
        <card-list-base :data="searchResult.artists"
                        name="id"
                        :skeleton-count="10"
                        :is-busy="isBusy">
          <template #default="{ item }">
            <artist-card :artist="item"></artist-card>
          </template>
        </card-list-base>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup lang="ts">
import { useMessage, useThemeVars } from 'naive-ui'
import { onMounted, reactive, ref, watchEffect } from 'vue-demi'
import { useRoute } from 'vue-router'
import { api, SearchType } from '@/request/api'
import { Album, Artist, Playlist } from '@/typings/neteasecloudmusicapi'
import AlbumCard from '@/components/AlbumCard.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import ArtistCard from '@/components/ArtistCard.vue'
import { useUrlSearchParams } from '@vueuse/core'
import CardListBase from '@/components/CardListBase.vue'

const params = useUrlSearchParams('history')
const route = useRoute()
const message = useMessage()
const themeVars = useThemeVars()
const content = ref<string>()
const isBusy = ref(false)

const searchResult = reactive<{
  albums: Array<Album>
  playlists: Array<Playlist>
  artists: Array<Artist>
}>({
  albums: [],
  playlists: [],
  artists: []
})

const searchBase = async (
  content: string,
  limit: number,
  type: SearchType,
  successedCallbackfn: (data: any) => void
) => {
  const { data } = await api.playlist.search(content, limit, 0, type)
  if (data.code !== 200) {
    message.error(data.msg)
    return
  }

  successedCallbackfn && successedCallbackfn(data)
}

const search = async () => {
  if (content.value) {
    isBusy.value = true
    try {
      await searchBase(content.value!, 10, 10, (data) => {
        searchResult.albums = data.result.albums
      })
      await searchBase(content.value!, 10, 100, (data) => {
        searchResult.artists = data.result.artists
      })
      await searchBase(content.value!, 10, 1000, (data) => {
        searchResult.playlists = data.result.playlists
      })
    } finally {
      isBusy.value = false
    }
  }
}

watchEffect(() => {
  content.value && (params.content = content.value)
})

onMounted(() => {
  content.value = route.query['content']?.toString()
  content.value && search()
})
</script>

<style lang="scss" scoped>
.n-text {
  color: v-bind('themeVars.primaryColor');
}
</style>
