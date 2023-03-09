import { useStore } from "@/store";
import { useI18n } from "vue-i18n";
import { zhCN, dateZhCN, enUS, dateEnUS } from "naive-ui";

export default function useLocale() {
  const i18n = useI18n()
  const mainStore = useStore()

  const cacheLocale = localStorage.getItem('locale')

  const currentLocale = computed(() => {
    return i18n.locale.value
  })

  const changeLocale = (value: string) => {
    i18n.locale.value = value;
    if (value === 'zh-CN') {
      mainStore.$patch(state => {
        state.local = zhCN
        state.dateLocal = dateZhCN
      })
    } else {
      mainStore.$patch(state => {
        state.local = enUS
        state.dateLocal = dateEnUS
      })
    }
    localStorage.setItem('locale', value)
  }
  cacheLocale && changeLocale(cacheLocale);

  return {
    i18n,
    currentLocale,
    changeLocale
  }
}
