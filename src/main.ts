import { createApp } from 'vue'
import { createPinia } from 'pinia'
import store from './store';
import router from "./route";
import App from './App.vue'
import { setupNaive } from './plugins';
import './assets/css/init.css'

const app = createApp(App).use(store).use(router)
setupNaive(app)
app.mount('#app')
