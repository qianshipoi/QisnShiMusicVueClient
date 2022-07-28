<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ref, watchEffect } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const content = ref<string>()
watchEffect(() => {
  content.value = route.query['content']?.toString()
})

const search = () => {
  message.info('search content:' + content.value)
}
</script>

<style scoped>
</style>
