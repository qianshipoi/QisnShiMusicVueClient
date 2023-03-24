<template>
  <article class="card">
    <div class="card-inner">
      <span class="card-pin"></span>
      <div class="card-image">
        <img :src="modelValue.coverImgUrl + '?param=120y120'" />
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="card-meta-number">{{ modelValue.trackCount }} songs</span>
          <button class="card-meta-button">
            <i class="ai-circle-triangle-right-fill"></i>
          </button>
        </div>
        <h2 class="card-title">{{ modelValue.name }}</h2>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Playlist } from '@/utils/neteasecloudmusicapi';

defineProps<{
  modelValue: Playlist
}>()
</script>

<style lang="scss" scoped>
.card {
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

  width: 200px;
  transform: rotate(var(--rotation));
  transition: 0.15s ease-out;
  margin-bottom: 2rem;

  &:nth-child(2n) {
    margin-top: 1rem;
    --rotation: 5deg;

    .card-inner:after {
      background-color: var(--c-green-300);
    }

    .card-pin {
      top: 20px;
      left: 20px;
      transform: rotate(-5deg);
    }
  }

  &+& {
    margin-left: 2rem;
  }

  &:hover,
  &:focus-within {
    transform: translateY(4px) rotate(var(--rotation));

    .card-inner {
      background-color: var(--c-gray-100);
    }

    .card-pin:after {
      height: 54px;
    }

    .card-pin:before {
      transform: translatey(-4px);
    }
  }

  &.horizontal {
    width: 100%;
    transform: rotate(3deg);

    .card-inner {
      flex-direction: row;
      align-items: center;
      padding: 1rem;

      &:after {
        background-color: var(--c-green-500);
      }
    }

    .card-image {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .card-content {
      width: 100%;
      margin-top: 0;
      margin-left: 0.5rem;
    }

    .card-meta-artist {
      font-weight: 700;
    }

    .card-title {
      font-weight: 500;
      color: var(--c-gray-500);
      font-size: 1.125em;
      margin-top: 0.125em;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .card-time {
      font-weight: 600;
    }

    &:hover,
    &:focus-within {

      .card-pin.simple:before,
      .card-pin.simple:after {
        transform: none;
      }

      .card-pin.simple:after {
        height: 50px;
      }
    }
  }
}

.card-inner {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--c-gray-900);
  border-radius: 20px;
  padding: 0.5rem;
  background-color: #fff;
  position: relative;

  &:after {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    width: 95%;
    height: 100%;
    bottom: -9px;
    left: calc(50% - 47.5%);
    border-radius: 20px;
    border: 2px solid var(--c-gray-900);
    background-color: var(--c-yellow-300);
  }
}

.card-pin {
  width: 12px;
  height: 12px;
  background-color: var(--c-gray-900);
  position: absolute;
  top: 20px;
  left: calc(50% - 6px);
  border-radius: 50%;
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--c-gray-900);
  transform: rotate(3deg);
  z-index: 1;

  &:before,
  &:after {
    content: "";
    display: block;
    border-radius: 50%;
    position: absolute;
    transition: 0.15s ease-out;
  }

  &:before {
    width: 12px;
    height: 12px;
    background-color: var(--c-gray-900);
    border-radius: 50%;
    left: calc(50% - 6px);
    top: -44px;
  }

  &:after {
    width: 6px;
    background-color: #fff;
    border: 1px solid;
    border-radius: 99em;
    height: 50px;
    left: calc(50% - 3px);
    bottom: 3px;
  }

  &.simple {
    box-shadow: none;

    &:nth-of-type(odd) {
      left: 10px;
      top: 10px;
      transform: rotate(-45deg);
    }

    &:nth-of-type(even) {
      left: calc(100% - 20px);
      top: calc(100% - 20px);
      transform: rotate(120deg);
    }
  }
}

.card-image {
  border-radius: 15px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  position: relative;

  img {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.card-meta,
.card-title {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.card-meta {
  padding-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-meta-number {
  color: var(--c-gray-500);
  font-size: 0.875rem;
  font-weight: 500;
}

.card-meta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: var(--c-gray-900);
  flex-shrink: 0;
  cursor: pointer;
  padding: 0;
  line-height: 0;
  border-radius: 50%;
  background-color: transparent;

  i {
    font-size: 1.75rem;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.card-title {
  margin-top: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
}
</style>
