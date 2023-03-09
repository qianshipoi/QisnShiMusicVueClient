<template>
  <div class="flex flex-col justify-start p-3">
    <h1 class="font-semibold text-2xl">Recomended for you</h1>
    <n-scrollbar x-scrollable style="height:auto">
      <div class="whitespace-nowrap">
        <div v-for="item in 3" :key="item"
          class="inline-flex flex-col justify-start items-center m-2 whitespace-nowrap w-40 h-60 rounded-xl  overflow-hidden">
          <img src="http://oss.kuriyama.top/static/nakiri.png" class="w-40 h-40 object-cover rounded-xl">
          <p class="text-sm font-semibold">Music for Refreshing</p>
          <a href="javascript:;" class="text-xs red">Lunkrembo,NCS</a>
          <div class="w-full flex justify-evenly text-sm my-1">
            <span class="bg-fuchsia-300 tag">Beat</span>
            <span class="bg-sky-300 tag">Remix</span>
            <span class="bg-orange-300 tag">Rock</span>
          </div>
        </div>
      </div>
    </n-scrollbar>
    <h1 class="font-semibold text-2xl">New Songs & Album</h1>
    <div class="flex justify-between">
      <div class="w-1/3 flex flex-col justify-start mx-2 my-1" v-for="item in 3" :key="item">
        <img src="http://oss.kuriyama.top/static/nakiri.png" class="w-full aspect-square  object-cover rounded-xl">
        <p class="text-center font-semibold">Martin Garix</p>
      </div>
    </div>
    <h1 class="font-semibold text-2xl">Music for Cinematic Videos</h1>
    <div class="flex justify-between my-1" v-for="item in 3" :key="item">
      <img src="http://oss.kuriyama.top/static/nakiri.png" class="w-2/12 aspect-square object-cover rounded-xl">
      <div>
        <h1 class="font-semibold">Stone royalty free vlog music</h1>
        <p class="font-semibold">Lukrembo <span class="font-light text-gray-300 text-xs">14 Oktober 2017</span></p>
        <div class="flex justify-start">
          <span class="icon bg-orange-300"></span>
          <span class="icon bg-orange-300"></span>
          <span class="icon bg-orange-300"></span>
          <span class="icon bg-orange-300"></span>
          <span class="icon bg-orange-300"></span>
        </div>
      </div>
      <div class="flex justify-end items-end">
        <span class="icon bg-sky-300"></span>
        <span class="icon bg-orange-300"></span>
        <span class="icon bg-pink-300"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.tag {
  @apply px-2 py-0.5 rounded-2xl text-xs text-white;
}

.icon {
  @apply w-4 h-4 m-1 rounded-2xl;
}
</style>
