<template>
  <section class="search max-w-2xl mx-auto">
    <div class="search-inner">
      <button class="search-button">
        <i class="ai-search"></i>
      </button>
      <input type="text" class="search-input" autofocus :value="modelValue" @input="onInput"
        @keydown.enter="emits('search')" placeholder="Search Music" />
    </div>
  </section>
</template>

<script setup lang="ts">

defineProps<{
  modelValue: string
}>()

const emits = defineEmits<{
  (event: 'search'): void,
  (event: 'update:modelValue', text: string): void
}>();

const onInput = (e: Event) => {
  emits('update:modelValue', (e.target as HTMLInputElement).value)
}

</script>

<style lang="scss" scoped>
.search {
  --c-gray-100: #fbf8f2;
  --c-gray-200: #fcfdfe;
  --c-gray-300: #e9ebec;
  --c-gray-400: #e3e4ea;
  --c-gray-500: #5f5f5f;
  --c-gray-900: #1d1d1d;
  --c-blue-300: #a8dee2;
  --c-blue-500: #2ab3c0;
  --c-green-500: #80b895;
  --c-green-300: #bad5ca;
  --c-red-500: #ea605e;
  --c-yellow-300: #f8e0b1;
  --c-yellow-500: #f9bc73;

  --rotation: -3deg;

  position: relative;
  z-index: 1;
  transition: 0.15s ease;

  &:hover,
  &:focus-within {
    transform: translatey(-2px);
  }
}

.search-inner {
  display: flex;
  align-items: center;
  border: 2px solid var(--c-gray-900);
  border-radius: 15px;
  height: 60px;
  font-size: 1rem;
  width: 100%;
  background-color: #fff;
  position: relative;

  &:after {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    width: 96%;
    height: 100%;
    bottom: -9px;
    left: calc(50% - 48%);
    border-radius: 20px;
    border: 2px solid var(--c-gray-900);
    background-color: var(--c-gray-100);
    transition: 0.15s ease;
  }

  &:hover,
  &:focus-within {
    input::placeholder {
      color: #787878;
    }

    &:after {
      transform: translatey(2px);
    }
  }
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px 0 0 15px;
  border: 0;
  background-color: var(--c-gray-100);
  position: relative;
  height: 100%;
  border-right: 2px solid var(--c-gray-900);
  width: 70px;
  transition: 0.15s ease;
  cursor: pointer;

  i {
    font-size: 1.25em;
  }

  &:focus,
  &:hover {
    background-color: var(--c-yellow-300);
    outline: 0;
  }
}

.search-input {
  border: 0;
  border-radius: 0 15px 15px 0;
  height: 100%;
  background-color: #fff;
  width: 100%;
  padding-left: 1em;
  padding-right: 1em;
  font-weight: 600;
  font-size: 1.5rem;
  caret-color: red;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    font-weight: 600;
    color: var(--c-gray-900);
    transition: 0.15s ease;
  }
}
</style>
