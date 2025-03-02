<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  map: Record<string, any>
}>()

const formattedClockTime = computed(() => {
  const minutes = Math.floor(props.map.clock_time / 60)
  const seconds = props.map.clock_time % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const timeOfDay = computed(() => {
  return props.map.daytime ? 'Day' : 'Night'
})

const gameStatus = computed(() => {
  return props.map.paused ? 'Paused' : 'Running'
})

const roshanStatus = computed(() => {
  return props.map.roshan_state === 'alive' ? 'Alive' : 'Dead'
})

const roshanStatusClass = computed(() => {
  return props.map.roshan_state === 'alive' ? 'text-green-400' : 'text-red-400'
})

const winChanceClass = computed(() => {
  return props.map.radiant_win_chance > 50 ? 'text-green-400' : 'text-red-400'
})
</script>

<template>
  <div class="flex w-full items-center justify-center rounded-lg text-gray-200">
    <div class="absolute left-0 p-5 text-base">
      <div>
        <span class="text-gray-400 text-base squada-one-regular uppercase">Map Status: </span>
        <span class="text-base squada-one-regular uppercase">{{ map.name }}</span>
      </div>
      <div>
        <span class="text-gray-400 text-base squada-one-regular uppercase">Match ID: </span>
        <span class="text-base squada-one-regular uppercase">{{ map.matchid }}</span>
      </div>
      <div>
        <span class="text-gray-400 text-base squada-one-regular uppercase">Roshan: </span>
        <span :class="roshanStatusClass" class="text-base squada-one-regular uppercase">
          {{ roshanStatus }}</span
        >
      </div>

      <div>
        <span class="text-gray-400 text-base squada-one-regular uppercase"
          >Win Chance Radiant:
        </span>
        <span :class="winChanceClass" class="text-base squada-one-regular uppercase"
          >{{ map.radiant_win_chance }}%</span
        >
      </div>
    </div>

    <div class="flex justify-center items-center w-full">
      <div class="text-5xl font-bold text-green-500 squada-one-regular">
        {{ map.radiant_score }}
      </div>
      <div class="text-center my-4 ml-5">
        <div class="text-3xl font-bold squada-one-regular">{{ formattedClockTime }}</div>
        <div class="text-2xl text-gray-300 squada-one-regular uppercase">
          {{ gameStatus }} | {{ timeOfDay }}
        </div>
      </div>
      <div class="text-5xl font-bold text-red-500 ml-5 squada-one-regular">
        {{ map.dire_score }}
      </div>
    </div>
  </div>
</template>
