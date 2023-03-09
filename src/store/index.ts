import { dateZhCN, zhCN } from 'naive-ui';
import { defineStore, createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

export const useStore = defineStore('main', {
  state: () => {
    return {
      isDarkTheme: false,
      isLargeScreen: true,
      local: zhCN,
      dateLocal: dateZhCN,
      displayPlayBar: false
    };
  },
  actions: {},
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

const store = createPinia();
store.use(piniaPluginPersist);

export default store;
