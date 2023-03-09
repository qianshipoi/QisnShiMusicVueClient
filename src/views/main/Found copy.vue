<template>
  <div class="found">
    <div class="found-cats">
      <transition-group v-if="!isEdit" ref="htmlRefHook" leave-active-class="animate__animated animate__fadeOutDown"
        enter-active-class="animate__animated animate__bounceIn">
        <n-button v-for="(element) in cats" :key="element.name" :ref="setColumnRefs" class="m-1"
          @click="selected(element)" type="primary">{{ element.name }}</n-button>
      </transition-group>
      <draggable :list="cats" v-else ghost-class="ghost" item-key="name" chosen-class="chosenClass" animation="300">
        <template #item="{ element, index }">
          <n-button dashed @click.stop="remove($event, index)" class="m-1" type="primary">{{ element.name }}</n-button>
        </template>
      </draggable>
    </div>
    <div class="found-cats-options">
      <n-drawer v-model:show="displayMoreCats" height="50%" placement="bottom" :trap-focus="false" :block-scroll="false">
        <n-drawer-content title="添加类别">
          <div class="flex flex-col">
            <div v-for="item in categories" :key="item.id" class="flex flex-col">
              <h2>{{ item.name }}</h2>
              <div>
                <n-button v-for="element in item.cats" :key="element.name" class="m-1" dashed :disabled="element.selected"
                  @click="add($event, element)">{{ element.name }}</n-button>
              </div>
            </div>
          </div>
        </n-drawer-content>
      </n-drawer>
      <n-switch :round="false" v-model:value="displayMoreCats" />
      <n-switch :round="false" v-model:value="isEdit" />
    </div>
    <div class="found-main">
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { api } from '@/request/api'
import { useMessage, useLoadingBar } from 'naive-ui'
import draggable from 'vuedraggable'
import { onLongPress } from '@vueuse/core'

const mainStore = useStore()
const message = useMessage()
const loadingBar = useLoadingBar()

const buttonRefs: Array<HTMLElement> = []

const setColumnRefs = (el: any) => {
  if (el) {
    buttonRefs.push(el)
    onLongPress(el, onLongPressCallbackHook)
  }
}

const onLongPressCallbackHook = (e: PointerEvent) => {
  isEdit.value = true
}

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

const remove = (e: Event, index: number) => {
  const target = e.target as HTMLElement

  const button = target.parentElement as HTMLButtonElement
  if (button.nodeName !== 'BUTTON') {
    return
  }

  button.className += ' animate__animated animate__fadeOutDown'
  cats.value[index].selected = false
  const timer = setTimeout(() => {
    cats.value.splice(index, 1)
    clearTimeout(timer)
  }, 800)
}

const add = (e: Event, cat: Cat) => {
  cat.selected = true
  cats.value.push(cat)
}

const selected = (cat: Cat) => {

}
</script>

<style lang="scss" scoped>
.found {
  display: flex;
  flex-direction: column;

  .found-main {
    flex: 1;
    min-height: 240px;
    margin-bottom: 40px;
  }
}
</style>
