import { defineStore, createPinia } from "pinia";
import piniaPluginPersist from 'pinia-plugin-persist'

export const useStore = defineStore('main', {
  state: () => {
    return {
      isDarkTheme: false
    }
  },
  actions: {
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['isDarkTheme']
      }
    ]
  }
});

const store = createPinia()
store.use(piniaPluginPersist)

export default store
