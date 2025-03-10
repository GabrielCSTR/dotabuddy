<script lang="ts" setup>
import { useHeroStore } from '@renderer/stores/hero-store'
import { IMatches, IHeroes } from '@renderer/types/stratz'
import { computed } from 'vue'
import { normalizeHeroNameImage } from '@renderer/utils'

const props = defineProps<{
  matches: IMatches[]
}>()

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
  <div class="flex flex-col w-full h-full gap-4">
    <p class="font-semibold squada-one-regular text-lg uppercase text-gray-200">
      Last Matches:
      <span :class="winRateClass">{{ winsMatches.length }}</span>
      / 10 Wins
    </p>

    <div class="grid grid-cols-5 gap-2">
      <div
        v-for="match in props.matches"
        :key="match.id"
        class="flex flex-row bg-red-700"
        :style="
          match.players[0]?.isVictory
            ? 'background-image: linear-gradient(135deg, rgb(0, 34, 0), rgb(0, 68, 0))'
            : 'background-image: linear-gradient(135deg, rgb(34, 0, 0), rgb(68, 0, 0))'
        "
      >
        <div class="relative">
          <!-- Hero Image -->
          <img
            v-tooltip="getHeroInfo(match.players[0]?.heroId)?.displayName"
            class="w-full h-full border-2 rounded-ss-md rounded-se-md border-gray-600"
            :src="`https://cdn.stratz.com/images/dota2/heroes/${normalizeHeroNameImage(getHeroInfo(match.players[0]?.heroId)?.name ?? '')}_modelcrop.png`"
            :alt="getHeroInfo(match.players[0]?.heroId)?.displayName || 'Hero'"
          />

          <!-- Victory/Defeat Indicator -->
          <div
            class="absolute left-0 right-0 bottom-0 h-6 opacity-70"
            :class="match.players[0]?.isVictory ? 'bg-green-700' : 'bg-red-700'"
          ></div>

          <!-- K/D/A Stats -->
          <p
            class="absolute text-gray-200 left-0 h-6 right-0 bottom-0 squada-one-regular text-lg text-center"
          >
            {{ match.players[0]?.kills }} / {{ match.players[0]?.deaths }} /
            {{ match.players[0]?.assists }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
