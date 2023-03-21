import { dateZhCN, zhCN } from 'naive-ui';
import { defineStore, createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

type Theme = 'dark' | 'light' | 'system'

export const useStore = defineStore('main', {
  state: () => {
    const currentTheme: Theme = 'system';
    return {
      currentTheme,
      isDark: false,
      isLargeScreen: true,
      local: zhCN,
      dateLocal: dateZhCN,
      displayPlayBar: false,
      loginMode: null,
      user: {},
      likedSongPlaylistId: undefined
    };
  },
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['currentTheme', 'isDark']
      }
    ]
  }
});

const store = createPinia();
store.use(piniaPluginPersist);

export default store;
