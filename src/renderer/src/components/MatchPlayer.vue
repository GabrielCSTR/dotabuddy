<script setup lang="ts">
import { IPlayerSummary, PlayerStats } from '@renderer/types'
import { computed } from 'vue'
import { useCurrentMatchStore } from '@renderer/stores'
import { normalizeHeroName } from '@renderer/utils'

import PlayerLastmatch from './PlayerLastmatch.vue'
import BestHeroes from './BestHeroes.vue'
import ProfileLinks from './ProfileLinks.vue'
import HeroVideo from './HeroVideo.vue'
import BarHero from './BarHero.vue'
import HeroInfo from './HeroInfo.vue'
import PlayerHeaderInfo from './PlayerHeaderInfo.vue'
import PlayerItems from './PlayerItems.vue'

const props = defineProps<{
  playersData: { [key: string]: IPlayerSummary }
  playersEvents: { [key: string]: PlayerStats }
}>()

const currentMatchStore = useCurrentMatchStore()

// Helper functions
const getPlayerInfo = (steamid: string) => {
  return Object.values(props.playersData).find(
    (player) => String(player.steamAccountId) === steamid
  )
}

const getPlayerHeroInfo = (index: number | string) => {
  const radiantHeroes = currentMatchStore.getRadiantHeroes()
  const direHeroes = currentMatchStore.getDireHeroes()
  return radiantHeroes?.[index] || direHeroes?.[index]
}

const getPlayerHeroItems = (index: number | string) => {
  const heroItems =
    currentMatchStore.getRadiantItems()?.[index] || currentMatchStore.getDireItems()?.[index]
  return heroItems || {}
}

// Computed properties
const playerHeroInfo = computed(() => (index: number | string) => getPlayerHeroInfo(index))
const playerHeroItems = computed(() => (index: number | string) => getPlayerHeroItems(index))
</script>

<template>
  <Panel
    v-for="(player, index) in props.playersEvents"
    :key="index"
    class="flex flex-col w-full mt-2 relative"
    toggleable
  >
    <template #header>
      <div class="flex items-center justify-between w-full gap-2">
        <!-- Avatar + Flag + Name + Rank Medal -->
        <PlayerHeaderInfo :key="player.accountid" :player="getPlayerInfo(player.accountid)" />

        <!-- Profile Links -->
        <div class="flex items-center gap-2 min-w-52 justify-end mr-3">
          <ProfileLinks
            :key="player.accountid"
            :steamid="player.steamid"
            :accountid="player.accountid"
          />
        </div>
      </div>
    </template>

    <div class="bg-[#111] p-4 rounded-lg shadow-md w-full">
      <div class="grid grid-cols-2 gap-2">
        <!-- Player Stats -->
        <div class="flex flex-col rounded-lg">
          <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">
            Match Hero Info
          </p>

          <!-- Current Hero Info -->
          <div class="flex w-full h-full bg-[#222] p-2 rounded-lg mt-2">
            <div class="flex flex-col">
              <!-- Hero Video -->
              <OverlayBadge :value="playerHeroInfo(index)?.level" severity="warn" size="large">
                <HeroVideo
                  :key="player.accountid"
                  class="w-full h-full"
                  :hero-name="playerHeroInfo(index)?.name!"
                  :hero-level="playerHeroInfo(index)?.level!"
                />
              </OverlayBadge>

              <!-- Bar Health and Mana -->
              <div class="flex flex-col gap-0.5 mt-0.5">
                <BarHero
                  :key="`health-${index}`"
                  :value="playerHeroInfo(index)?.health ?? 0"
                  :max-value="playerHeroInfo(index)?.max_health ?? 1"
                  bg-color="bg-green-600"
                  fg-color="bg-green-400"
                  height="20"
                />
                <BarHero
                  :key="`mana-${index}`"
                  :value="playerHeroInfo(index)?.mana ?? 0"
                  :max-value="playerHeroInfo(index)?.max_mana ?? 1"
                  bg-color="bg-blue-600"
                  fg-color="bg-blue-400"
                  height="20"
                />
              </div>
            </div>

            <!-- Hero Information -->
            <div class="flex w-full h-full flex-col gap-2">
              <HeroInfo
                :key="player.accountid"
                class="p-2 mt-4"
                :hero-name="normalizeHeroName(playerHeroInfo(index)?.name!)!"
                :player="player"
                :smoked="playerHeroInfo(index)?.smoked ?? false"
              />
            </div>
          </div>

          <!-- Items -->
          <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">Items</p>
          <div class="bg-[#222] p-2 rounded-lg mt-2 flex flex-col gap-2">
            <div class="flex w-full h-full gap-2">
              <PlayerItems
                :key="player.accountid"
                :player="player"
                :player-hero-items="playerHeroItems(index)"
              />
            </div>
          </div>
        </div>

        <div class="flex w-full h-full flex-col rounded-lg">
          <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">
            Player Stats
          </p>
          <div
            v-if="getPlayerInfo(player.accountid)?.matches"
            class="bg-[#222] p-4 rounded-lg mt-2 h-1/2"
          >
            <PlayerLastmatch
              :key="player.accountid"
              :matches="getPlayerInfo(player.accountid)?.matches ?? []"
            />
          </div>

          <div
            v-if="
              getPlayerInfo(player.accountid)?.heroesGroupBy &&
              !getPlayerInfo(player.accountid)?.steamAccount?.isAnonymous
            "
            class="flex flex-col rounded-lg"
          >
            <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">
              Best Heroes
            </p>
            <div class="bg-[#222] p-2 rounded-lg mt-2">
              <BestHeroes
                :key="player.accountid"
                :best-heroes="getPlayerInfo(player.accountid)?.heroesGroupBy ?? []"
                :dota-plus-heroes="getPlayerInfo(player.accountid)?.dotaPlus ?? []"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>
