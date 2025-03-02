<script lang="ts" setup>
import { useHeroStore } from '@renderer/stores/hero-store'
import { IMatches } from '@renderer/types/stratz'
import { IHeroes } from '@renderer/types/stratz'
import { ref } from 'vue'

const props = defineProps<{
  matches: IMatches[]
}>()

const heroStore = useHeroStore()
const winsMatches = ref(props.matches.filter((match) => match.players[0].isVictory))

const heroInfo = (heroId: number) => {
  return heroStore.data.heroes.find((hero: IHeroes) => hero.id === heroId)
}
</script>

<template>
  <p class="font-semibold squada-one-regular text-lg uppercase text-gray-200">
    Last 10 Matches:
    <span :class="winsMatches.length > 5 ? 'text-green-500' : 'text-red-500'">{{
      winsMatches.length
    }}</span>
    / 10 Wins
  </p>
  <div class="grid grid-cols-5 gap-2">
    <div v-for="match in props.matches" :key="match.id" class="flex flex-row">
      <div class="relative">
        <img
          v-tooltip="heroInfo(match.players[0].heroId)?.displayName"
          class="w-32 h-16 border-2 border-gray-600"
          :src="`http://cdn.dota2.com/apps/dota2/images/heroes/${heroInfo(match.players[0].heroId)?.shortName}_lg.png`"
          alt="hero"
        />
        <div
          class="absolute top-13 left-0 right-0 bottom-0 h-4 opacity-70"
          :class="match.players[0].isVictory ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <p
          class="absolute top-[43px] text-gray-200 left-0 right-0 bottom-0 squada-one-regular text-lg text-center"
        >
          {{ match.players[0].kills }} / {{ match.players[0].deaths }} /
          {{ match.players[0].assists }}
        </p>
      </div>
    </div>
  </div>
</template>
