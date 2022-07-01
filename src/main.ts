import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./route";
import App from './App.vue'
import { setupNaive } from './plugins';

const app = createApp(App).use(createPinia()).use(router)
setupNaive(app)
app.mount('#app')
