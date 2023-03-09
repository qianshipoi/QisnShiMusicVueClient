<template>
  <n-input-group>
    <n-input placeholder="输入关键字搜索" v-model:value="content" :style="{ maxWidth: '600px', textAlign: 'left' }" autofocus
      @keypress.enter="search" />
    <n-button type="primary" @click="search" ghost>
      <n-icon size="medium">
        <SearchIcon />
      </n-icon>
    </n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Search as SearchIcon } from '@vicons/ionicons5'

const router = useRouter()
const content = ref<string>()
const search = (): void => {
  const query = content.value ? { content: content.value } : undefined
  router.push({ name: 'Search', query })
}
</script>
