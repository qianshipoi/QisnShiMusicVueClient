<script lang="ts" setup>

import { player } from '@/utils/player';

const position = ref<number>(0)
const duration = ref<number>(0)

const onInput = async (e: Event) => {
  var files = (e.target as HTMLInputElement).files || []
  console.log(files);

  for (let index = 0;index < files.length;index++) {
    const element = files[index];
    await player.append(element)
  }
  player.play()
}

const draw = () => {
  requestAnimationFrame(draw)
  position.value = player.position
  duration.value = player.duration
}

onMounted(draw)

const Play = () => {
  player.play()
}

const Pause = () => {
  player.pause()
}

const Stop = () => {
  player.stop()
}

</script>

<template>
  <div class="container">
    <input type="file" @input="onInput" />
    {{ position }}
    <br />
    {{ duration }}

    <n-button @click="Play">播放</n-button>
    <n-button @click="Pause">暂停</n-button>
    <n-button @click="Stop">停止</n-button>

  </div>
</template>
