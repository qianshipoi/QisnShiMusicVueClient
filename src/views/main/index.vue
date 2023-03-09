<template>
  <n-grid responsive="screen" class="h-full" item-responsive>
    <n-grid-item span="24 m:18" class="p-4">
      <n-space vertical>
        <TopPlaylists :model-value="playlists" />
        <TopSongs :model-value="songs" />
      </n-space>

    </n-grid-item>
    <n-grid-item span="0 m:6">
      <div class="h-full" :style="{
        'border-left': `1px solid ${themeVars.borderColor}`
      }">
        <n-space :vertical="true">
          <TopArtists :model-value="artists" />
          <PlayCard />
        </n-space>

      </div>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import TopArtists from '@/components/TopArtists.vue';
import TopSongs from '@/components/TopSongs.vue'
import PlayCard from '@/components/PlayCard.vue'
import TopPlaylists from '@/components/TopPlaylists.vue';
import { api } from '@/request/api';
import { Artist, Playlist, Song } from '@/typings/neteasecloudmusicapi';
import { useThemeVars } from 'naive-ui'

const playlists = shallowRef<Array<Playlist>>([])
const artists = shallowRef<Array<Artist>>([]);
const songs = ref<Array<Song>>([]);

const themeVars = useThemeVars()

onMounted(async () => {
  getArtists();
  getSongs();
  getHot()
})

const getHot = async () => {
  const { data } = await api.playlist.topPlaylistHighquality('华语')
  playlists.value = data.playlists as Array<Playlist>
}

const getArtists = async () => {
  const { data } = await api.playlist.topArtists({ limit: 6 })
  artists.value = data.artists
}

const getSongs = async () => {
  const { data } = await api.playlist.topSong(7)

  const songsData = (data.data as Array<Song>)

  songsData.splice(0, 6).forEach(item => {
    songs.value.push(item)
  })
}

</script>
