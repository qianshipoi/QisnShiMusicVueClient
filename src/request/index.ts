import axios, { AxiosRequestConfig, Method } from 'axios';

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

export default instance;
