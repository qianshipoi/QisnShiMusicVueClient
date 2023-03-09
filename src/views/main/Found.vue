<template>
  <div class="found">

  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { api } from '@/request/api'
import { useMessage, useLoadingBar } from 'naive-ui'
import { onLongPress } from '@vueuse/core'

const mainStore = useStore()
const message = useMessage()
const loadingBar = useLoadingBar()


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

const cats = ref<Array<Cat>>([])
const categories = ref<Array<Categorie>>([])
const displayMoreCats = ref(false)
const isEdit = ref(false)

const getCats = async () => {
  try {
    loadingBar.start()
    const { status, data } = await api.playlist.catlist()
    if (status !== 200) {
      message.error('获取分类失败')
      return
    }
    if (data.code !== 200) {
      message.error(data.msg)
      return
    }
    const categorieMap = new Array<Categorie>()
    for (const key in data.categories) {
      if (Object.prototype.hasOwnProperty.call(data.categories, key)) {
        const element = data.categories[key]
        const category = Number(key)
        const categorie: Categorie = {
          id: category,
          name: element,
          cats: data.sub.filter((x: Cat) => x.category == category)
        }
        categorieMap.push(categorie)
        categorie.cats.map((item) => (item.selected = true))
        cats.value.push(...categorie.cats)
      }
    }
    categories.value = categorieMap
  } catch (error: any) {
    message.error(error)
    loadingBar.error()
  } finally {
    loadingBar.finish()
  }
}
onMounted(getCats)

</script>

<style lang="scss" scoped>
</style>
