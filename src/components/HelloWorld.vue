<script setup lang="ts">
import { ref } from 'vue'
import { ipcRenderer } from 'electron'

defineProps<{ msg: string }>()

const count = ref(0)

let isDark = false

// 监听 Mode 改变
const changeModel = () => {
  // Electorn的主题模式 auto 为 system 所以需要转换
  console.log(isDark);

  ipcRenderer.invoke("dark-mode:change", isDark ? 'light' : 'dark');
  isDark = !isDark
};

</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="changeModel">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
