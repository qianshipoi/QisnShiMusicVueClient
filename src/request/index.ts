import axios, { AxiosRequestConfig, Method } from 'axios';
import router from '@/route';
import { doLogout } from '@/utils/auth';

interface PendingType {
  url?: string;
  method?: Method | string;
  params: any;
  data: any;
  cancel: any;
}

const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      list.cancel('操作太频繁，请稍后重试');
      pending.splice(item, 1);
    }
  }
};

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  timeout: 1000 * 30,
  baseURL: 'https://www.kuriyama.top/music-api',
  withCredentials: true
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    removePending(config);
    config.cancelToken = new CancelToken((c) => {
      pending.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        cancel: c
      });
    });

    return config;
  },
  (error) => {
    return Promise.reject(error.data.error.message);
  }
);

instance.interceptors.response.use(response => {
  const res = response.data;
  return res;
}, error => {
  const response = error.response
  const data = response.data;

  if (response && typeof data === 'object' && data.code === 301 && data.msg === '需要登录') {
    // token has expired.

    doLogout();

    // 导航到登录页面
    router.push({ name: 'login' })
  }
})

export default instance;
