<script lang="ts" setup>
import { useHeroStore } from '@renderer/stores/hero-store'
import { IMatches, IHeroes } from '@renderer/types/stratz'
import { computed } from 'vue'

const props = defineProps<{
  matches: IMatches[]
}>()

console.log('PlayerLastmatch', props.matches)

const heroStore = useHeroStore()

// Computed properties
const winsMatches = computed(() => props.matches.filter((match) => match.players[0]?.isVictory))
const winRateClass = computed(() =>
  winsMatches.value.length > 5 ? 'text-green-500' : 'text-red-500'
)

// Helper function to get hero info
const getHeroInfo = (heroId: number): IHeroes | undefined => {
  return heroStore.data.heroes.find((hero: IHeroes) => hero.id === heroId)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="font-semibold squada-one-regular text-lg uppercase text-gray-200">
      Last 10 Matches:
      <span :class="winRateClass">{{ winsMatches.length }}</span>
      / 10 Wins
    </p>

    <div class="grid grid-cols-5 gap-2">
      <div v-for="match in props.matches" :key="match.id" class="flex flex-row">
        <div class="relative">
          <!-- Hero Image -->
          <img
            v-tooltip="getHeroInfo(match.players[0]?.heroId)?.displayName"
            class="w-32 h-16 border-2 border-gray-600"
            :src="`http://cdn.dota2.com/apps/dota2/images/heroes/${getHeroInfo(match.players[0]?.heroId)?.shortName}_lg.png`"
            :alt="getHeroInfo(match.players[0]?.heroId)?.displayName || 'Hero'"
          />

          <!-- Victory/Defeat Indicator -->
          <div
            class="absolute top-13 left-0 right-0 bottom-0 h-4 opacity-70"
            :class="match.players[0]?.isVictory ? 'bg-green-500' : 'bg-red-500'"
          ></div>

          <!-- K/D/A Stats -->
          <p
            class="absolute top-[43px] text-gray-200 left-0 right-0 bottom-0 squada-one-regular text-lg text-center"
          >
            {{ match.players[0]?.kills }} / {{ match.players[0]?.deaths }} /
            {{ match.players[0]?.assists }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
