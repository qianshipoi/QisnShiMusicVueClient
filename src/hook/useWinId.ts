import { useRoute } from "vue-router";

export default function useWinId() {
  const route = useRoute();
  const winId = ref<number | null>(null);

  watchEffect(() => {
    winId.value = route.query.winId ? Number(route.query.winId) : null;
  })

  return winId;
}
