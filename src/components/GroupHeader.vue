<template>
  <div class="flex justify-between items-center p-8">

    <!-- title -->
    <div>
      <slot name="title">
        <n-h3 class="m-0">{{ props.title }}</n-h3>
      </slot>
    </div>

    <!-- more button -->
    <div v-if="props.hasMore">
      <slot name="more">
        <n-button quaternary circle type="success" @click="emit('moreClick', $event)">
          <template #icon>
            <n-icon :size="24" class="cursor-pointer">
              <EllipsisHorizontal />
            </n-icon>
          </template>
        </n-button>
      </slot>
    </div>

  </div>
</template>

<script setup lang="ts">
import { EllipsisHorizontal } from '@vicons/ionicons5'

const props = withDefaults(defineProps<{
  title?: string,
  hasMore?: boolean
}>(), {
  hasMore: true
})

const emit = defineEmits(['moreClick'])

</script>

