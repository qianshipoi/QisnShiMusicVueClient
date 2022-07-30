<template>
  <div>
    <n-space justify="center">
      <n-skeleton v-if="isBusy"
                  width="200px"
                  height="200px" />
      <n-image width="200"
               v-else
               fallback-src="https://oss.kuriyama.top/static/akua.png"
               :src="playlistDetail?.coverImgUrl"
               :alt="playlistDetail?.name"></n-image>
      <n-card size="medium"
              style="min-width:600px;max-width:800px">
        <n-skeleton v-if="isBusy"
                    style="margin:10px auto"
                    width="400px"
                    height="34px" />

        <n-h1 v-else>{{ playlistDetail?.name }}</n-h1>
        <n-skeleton text
                    v-if="isBusy"
                    :repeat="1"
                    height="24px"
                    width="160px" />
        <n-text v-else>{{playlistDetail?.creator.nickname}}</n-text>
        <div>
          <n-skeleton text
                      v-if="isBusy"
                      :repeat="1"
                      width="160px"
                      height="24px" />

          <n-text v-else>歌曲数量：{{playlistDetail?.trackCount}}</n-text>
        </div>
        <div v-if="isBusy">
          <n-skeleton text
                      :repeat="2" />
          <n-skeleton text
                      style="width: 60%" />
        </div>
        <n-ellipsis v-else
                    expand-trigger="click"
                    :tooltip="false"
                    :line-clamp="2">
          <n-text>{{playlistDetail?.description}}</n-text>
        </n-ellipsis>
      </n-card>
    </n-space>
    <ul style="margin-top:1rem"
        v-if="isBusy">
      <li v-for="item in 6"
          :key="item">
        <SongItem></SongItem>
      </li>
    </ul>
    <ul v-else
        style="margin-top:1rem">
      <li v-for="song in playlistDetail?.tracks"
          class="song-item"
          :key="song.id">
        <SongItem :song="song"
                  @play="play"></SongItem>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/request/api'
import { useMessage, useThemeVars } from 'naive-ui'
import { onMounted, ref } from 'vue-demi'
import { Artist, PlaylistDetail } from '@/typings/neteasecloudmusicapi'
import { NSpace } from 'naive-ui'
import { Play } from '@vicons/ionicons5'
import SongItem from '@/components/SongItem.vue'

const themeVars = useThemeVars()
const message = useMessage()
const route = useRoute()
const router = useRouter()
const isBusy = ref(true)
const playlistDetail = ref<PlaylistDetail>()

const formatArtists = (artists: Array<Artist>): string => {
  return artists.map((x) => x.name).join(',')
}

const getPlaylistDetail = async (id: number) => {
  isBusy.value = true
  try {
    const { status, data } = await api.playlist.detail(id)
    if (status === 200 && data.code === 200) {
      playlistDetail.value = data.playlist
    } else {
      message.error('获取歌单详细信息异常')
      router.back()
    }
  } catch (error) {
    message.error('获取歌单详细信息异常')
    router.back()
  } finally {
    isBusy.value = false
  }
}

const play = (id: number) => {
  const song = playlistDetail.value?.tracks.find((x) => x.id === id)
  message.info(`play song ${song?.name}`)
}

onMounted(() => {
  getPlaylistDetail(Number(route.params['id']))
})
</script>

<style lang="scss" scoped>
.n-ellipsis,
.n-h1,
.n-p,
.n-text {
  color: v-bind('themeVars.primaryColor');
  transition: 0.3s var(--cubic-bezier-ease-in-out);
}
</style>
