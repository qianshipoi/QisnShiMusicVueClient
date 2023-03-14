<template>
  <div class="found box-border h-full p-8">

    <CartoonSearchBox v-model="searchText" @search="search" />

    <section class="flex flex-wrap justify-between items-center py-8 my-8">
      <CartoonPlaylist :model-value="item" v-for="item in searchResult" :key="item.id"
        @click="toPlaylistDetailPage(item)" />
    </section>

  </div>
</template>

<script setup lang="ts">
import { api } from '@/request/api'
import { useMessage, useLoadingBar } from 'naive-ui'
import { Playlist } from '@/typings/neteasecloudmusicapi';
import { useRouter } from 'vue-router';
import CartoonPlaylist from '@/components/cartoon/CartoonPlaylist.vue';
import CartoonSearchBox from '@/components/cartoon/CartoonSearchBox.vue';

const message = useMessage()
const loadingBar = useLoadingBar()
const router = useRouter()
const searchText = ref<string>('')
const searchResult = ref<Array<Playlist>>([])

type Cat = {
  name: string
  category: number
  hot: boolean
  resourceCount: number
  selected: boolean
}

type Categorie = {
  id: number
  name: string
  cats: Array<Cat>
}

const search = async () => {
  if (!searchText.value) {
    message.warning('请输入想要搜索的内容。')
    return;
  }
  try {
    loadingBar.start()
    const { data } = await api.playlist.search(searchText.value, 1000);
    searchResult.value = data.result.playlists as Array<Playlist>;
  } catch (error) {
    loadingBar.error()
  } finally {
    loadingBar.finish();
  }
}

const toPlaylistDetailPage = (item: Playlist) => {
  router.push({ name: 'Playlist', params: { id: item.id } })
}

</script>
