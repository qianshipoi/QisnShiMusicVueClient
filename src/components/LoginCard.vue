<template>
  <div class="flex flex-col items-center justify-center">
    <Qrcode v-bind="QRStyle" error-correction-level="L"></Qrcode>
    <n-avatar size="medium" v-if="checkResult?.avatarUrl" :src="checkResult?.avatarUrl"></n-avatar>
    <n-text v-if="checkResult?.nickname">{{ checkResult?.nickname }}</n-text>
  </div>
</template>

<script setup lang='ts'>
import { loginQrCodeKey, loginQrCodeCheck, loginQrCodeCreate, loginStatus } from '@/api/auth';
import Qrcode from './Qrcode.vue';
import { useStore } from '@/store';
import { useMessage } from 'naive-ui';

const store = useStore();
const checkResult = ref<CheckResult>()
const key = ref<string>()
let timer: NodeJS.Timer | null = null
const message = useMessage()

const QRStyle = reactive({
  value: '',  // 生成二维码的字符串
  width: '240px',
  height: '240px',
  margin: 0,
  dark: '#ffffff',
  light: '#00000000',
})

watch(() => store.isDark, (isDark) => {
  QRStyle.dark = isDark ? '#ffffff' : '#000000'
}, {
  immediate: true
})


// 创建二维码
const createQrCode = async () => {
  const result = await loginQrCodeKey()
  key.value = result.data.data.unikey as string;

  const qrResult = await loginQrCodeCreate({ key: key.value })
  QRStyle.value = qrResult.data.data.qrurl;

  timer = setInterval(() => {
    cehck()
  }, 3000)
}

onBeforeMount(() => {
  createQrCode()
})

onUnmounted(() => {
  timer && clearInterval(Number(timer))
})

// watch(() => QRStyle.value, (val) => {  // 监听二维码字符串的变化
//   QRStyle.value = val
// })


// 循环检查二维码状态
// { "code": 800, "message": "二维码不存在或已过期", "cookie": "" }
// { "code": 801, "message": "等待扫码", "cookie": "" }
// { "code": 802, "message": "授权中", "cookie": "", "nickname": "xxx", "avatarUrl": "xxx" }
// { "code": 803, "message": "授权登陆成功", "cookie": "xxxx"}

interface CheckResult {
  code: number,
  message: string,
  cookie: string,
  nickname?: string,
  avatarUrl?: string
}

const cehck = async () => {
  if (!key.value) {
    return;
  }
  const response = await loginQrCodeCheck(key.value)
  const result = response.data as CheckResult

  if (result.code === 800) {
    timer && clearInterval(Number(timer))
    await createQrCode();
    return;
  } else if (result.code === 802) {
    checkResult.value = result
    return
  } else if (result.code === 803) {
    timer && clearInterval(Number(timer))
    message.success(result.message);
    await getUserInfo()
    return
  }
}

const getUserInfo = async () => {
  const result = await loginStatus()
  console.log(result.data);
}



// 过期更新二维码

// 登录成功提示用户并关闭弹窗


</script>

<style>
</style>
