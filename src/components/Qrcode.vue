<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang='ts'>
import QRCode from "qrcode";

interface Props {
  value: string,                                   // 二维码的内容值。
  size?: number,                                   // 二维码大小。
  margin?: number,                                 // 定义空白区的宽度应该是多少。
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H',    // 维码的容错能力等级，取值为 'L', 'M', 'Q', 'H' 之一。
  dark?: string,
  light?: string,
}
const props = withDefaults(defineProps<Props>(), {
  value: '',
  size: 200,
  margin: 5,
  level: 'Q',
  light: '#fff',
  dark: '#000',
})

const canvas = ref<HTMLCanvasElement | null>(null)

onUpdated(() => {
  const canvasDom = canvas.value as HTMLCanvasElement
  QRCode.toCanvas(canvasDom, props.value, {
    errorCorrectionLevel: props.errorCorrectionLevel,
    width: props.size,
    margin: props.margin,
    color: {
      dark: props.dark,
      light: props.light
    }
  }, (error: any) => {
    if (error) console.error(error)
    console.log('success!');
  })
})


</script>
