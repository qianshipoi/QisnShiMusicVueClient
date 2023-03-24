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
import { Artist, Playlist, Song } from '@/utils/neteasecloudmusicapi';
import { useThemeVars } from 'naive-ui'
import { topPlaylistHighquality } from '@/api/playlist';
import { topArtists } from '@/api/artist'
import { topSong } from '@/api/track'

const playlists = shallowRef<Array<Playlist>>([])
const artists = shallowRef<Array<Artist>>([]);
const songs = ref<Array<Song>>([]);

const themeVars = useThemeVars()

onMounted(() => {
  getData()
})

const getData = async () => {
  await Promise.all([getHot(), getArtists(), getSongs()])
}

const getHot = () => {
  return topPlaylistHighquality({ cat: '华语' }).then(data => {
    playlists.value = data.data.playlists
  })
}

const getArtists = () => {
  return topArtists({ limit: 6 }).then(data => {
    artists.value = data.data.artists
  })
}

const getSongs = async () => {
  return topSong(7).then(data => {
    data.data.data.splice(0, 6).forEach(item => {
      songs.value.push(item)
    })
  })
}

</script>
