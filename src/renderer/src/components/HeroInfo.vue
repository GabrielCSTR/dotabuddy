<script setup lang="ts">
import { PlayerStats } from '@renderer/types'

const props = defineProps<{
  heroName: string
  player: PlayerStats
  smoked: boolean
}>()
</script>
<template>
  <!-- Hero Info -->
  <div class="flex flex-col w-full text-gray-200">
    <p class="font-semibold squada-one-regular text-3xl">
      {{ props.heroName }}
    </p>
    <p class="text-gray-400 squada-one-regular text-lg">
      K/D/A: {{ props.player.kills }} / {{ props.player.deaths }} / {{ props.player.assists }}
    </p>
    <p class="text-gray-400 squada-one-regular text-lg">
      LH: {{ props.player.last_hits }} | DN: {{ props.player.denies }}
    </p>

    <p class="font-semibold squada-one-regular text-lg uppercase text-gray-200">Basic Stats</p>
    <div class="bg-[#222] rounded-lg">
      <div class="flex w-full h-full items-center justify-between gap-2">
        <div class="flex flex-col">
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            GPM: {{ props.player.gpm }}
          </p>
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            XPM: {{ props.player.xpm }}
          </p>
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            Kill Streak: {{ props.player.kill_streak }}
          </p>

          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            Hero Damage: {{ props.player.hero_damage }}
          </p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            Gold: {{ props.player.gold }}
          </p>
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            Smoked: {{ props.smoked ? 'Yes' : 'No' }}
          </p>
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            Stacks: {{ props.player.camps_stacked }}
          </p>
          <p class="text-gray-400 squada-one-regular text-lg uppercase">
            Net Worth: {{ props.player.net_worth }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
