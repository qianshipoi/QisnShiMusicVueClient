<template>
  <div>
    <n-space justify="center">
      <n-skeleton v-if="isBusy"
                  width="280px"
                  height="280px" />

      <n-image width="280"
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
        <n-card>
          <div style="display:flex;">
            <n-skeleton v-if="isBusy"
                        lazy
                        width="48px"
                        height="48px"
                        :sharp="false" />
            <div style="display:flex;flex-direction: column; justify-content: space-between; margin-left: .75rem;flex:1">
              <n-skeleton text
                          :sharp="false"
                          height="18px" />
              <n-skeleton text
                          :sharp="false"
                          width="80%"
                          height="16px" />
            </div>
            <n-skeleton text
                        style="margin:auto 0 auto 1rem;flex:1.5"
                        :sharp="false"
                        width="280px"
                        height="20px" />
            <n-icon :component="Play"
                    style="margin:auto 1rem"
                    :size="28"></n-icon>
            <n-text style="margin: auto 0;font-weight: 800;">00:00</n-text>
          </div>
        </n-card>
      </li>
    </ul>
    <ul v-else
        style="margin-top:1rem">
      <li v-for="song in playlistDetail?.tracks"
          class="song-item"
          :key="song.id">
        <n-card>
          <div style="display:flex;">
            <n-image fallback-src="https://oss.kuriyama.top/static/akua.png"
                     :src="song.al.picUrl"
                     width="48"
                     height="48"
                     preview-disabled
                     :alt="song.name" />
            <div style="display:flex;flex-direction: column; justify-content: space-between;align-items: flex-start; margin-left: .75rem;flex:1">
              <n-ellipsis :line-clamp="1"
                          style="font-size:16px;font-weight: 600;">{{ song.name }}</n-ellipsis>
              <n-text style="font-size:14px">{{ formatArtists(song.ar) }}</n-text>
            </div>
            <n-ellipsis :line-clamp="1"
                        style="margin:auto 0 auto 1rem;flex:1.5;font-size:18px; font-weight: 800;text-align: left;">{{ song.al.name }}</n-ellipsis>
            <n-icon :component="Play"
                    style="margin:auto 1rem"
                    :size="28"></n-icon>
            <n-text style="margin: auto 0;font-weight: 800;">00:00</n-text>
          </div>
        </n-card>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/request/api'
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue-demi'
import { Artist, PlaylistDetail } from '@/typings/neteasecloudmusicapi'
import { NSpace } from 'naive-ui'
import { Play } from '@vicons/ionicons5'
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

onMounted(() => {
  getPlaylistDetail(Number(route.params['id']))
})
</script>

<style lang="scss" scoped>
.song-item {
  min-height: 2rem;
  margin-bottom: 1rem;
}
</style>
