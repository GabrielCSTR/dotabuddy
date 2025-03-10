<script setup lang="ts">
const props = defineProps<{
  value: number
  maxValue: number
  bgColor: string
  fgColor: string
  height?: '20'
  width?: string
}>()
</script>
<template>
  <div
    class="flex w-full"
    :class="props.bgColor"
    :style="{ height: `${props.height}px`, width: `${props.width}px` }"
  >
    <div class="relative h-full w-full">
      <div
        class="h-full"
        :class="props.fgColor"
        :style="{
          width: `${(props.value / props.maxValue) * 100}%`
        }"
      ></div>
      <p
        class="absolute -top-[2px] left-0 right-0 bottom-0 squada-one-regular text-gray-200 text-lg text-center"
      >
        {{ props.value }} /
        {{ props.maxValue }}
      </p>
    </div>
  </div>
</template>
