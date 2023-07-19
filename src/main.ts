import { createApp } from 'vue';
import App from './App.vue';
import VueLazyload from 'vue-lazyload'
import './samples/node-api';
import store from './store';
import router from './route';
import { setupNaive } from './plugins';
import i18n from './locale';
import 'animate.css';
import 'animate.css/animate.compat.css';
import './assets/css/init.css';
import './assets/css/index.css';
import './assets/css/preflight.css';
import 'normalize.css/normalize.css'

const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.use(VueLazyload);
setupNaive(app);
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
