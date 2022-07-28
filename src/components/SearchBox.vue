<template>
  <n-input-group>
    <n-input placeholder="input content to search"
             v-model:value="content"
             :style="{ width: '30%', textAlign:'left'}"
             autofocus
             @keypress.enter="search" />
    <n-button type="primary"
              @click="search"
              ghost>
      搜索
    </n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-dom'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = useMessage()
const content = ref<string>()
const search = () => {
  const query = content.value ? { content: content.value } : undefined
  router.push({ name: 'Search', query })
}
</script>

<style scoped>
</style>
