<script lang="ts" setup>

import MyPlayer from '@/utils/MyPlayer'
import { topSong } from '@/api/track';

const myPlayer = new MyPlayer()

const isPlaying = ref(false)

myPlayer.onPlayingChanged.listen((player: MyPlayer) => {
  isPlaying.value = player.playing
})

const getData = () => {
  topSong(96).then(data => {
    myPlayer.list = data.data.data
  })
}

const position = ref<number>(0)
const duration = ref<number>(0)

const draw = () => {
  requestAnimationFrame(draw)
  position.value = myPlayer.progress
  duration.value = myPlayer.currentTrackDuration
}

onMounted(() => {
  getData()
  draw()
})


</script>

<template>
  <div class="container">
    {{ position }} - {{ duration }}
    <br />
    <n-button @click="() => myPlayer.playPrevTrack()">Prev</n-button>
    <n-button @click="() => myPlayer.playOrPause()">{{ isPlaying ? "暂停" : '播放' }}</n-button>
    <n-button @click="() => myPlayer.playNextTrack()">Next</n-button>

  </div>
</template>
