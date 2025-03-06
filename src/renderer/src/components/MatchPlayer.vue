<script setup lang="ts">
import { IPlayerSummary, PlayerStats } from '@renderer/types'
import { computed } from 'vue'
import { useCurrentMatchStore } from '@renderer/stores'
import {
  normalizeHeroName,
  normalizeHeroNameImage,
  normalizeItemName,
  normalizeItemNameImage
} from '@renderer/utils'
import PlayerLastmatch from './PlayerLastmatch.vue'
import BestHeroes from './BestHeroes.vue'

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

const getFlagClass = (countryCode: string | undefined) => {
  return countryCode ? `fi fi-${countryCode.toLowerCase()}` : ''
}

const tooltipContent = (player) => {
  const playerInfo = getPlayerInfo(player.accountid)
  return `
    <div class="flex items-center space-x-2">
      <img
        src="${playerInfo?.steamAccount?.guild.guild?.logo}"
        alt="Guild Avatar"
        class="w-16 h-16"
      />
      <span class="font-bold text-lg">${playerInfo?.steamAccount?.guild.guild?.name}</span>
    </div>
  `
}

const getStarImage = (seasonRank: number | undefined) => {
  return seasonRank && seasonRank < 80 && seasonRank % 10 !== 0
    ? `/src/assets/ranks/star_${seasonRank % 10}.png`
    : ''
}

const getMedalImage = (seasonRank) => {
  let imagePath
  if (seasonRank === 80) {
    imagePath = '/src/assets/ranks/medal_8.png'
  } else {
    imagePath = `/src/assets/ranks/medal_${Math.floor(seasonRank / 10)}.png`
  }
  return imagePath
}

// Computed properties
const playerHeroInfo = computed(() => (index: number | string) => getPlayerHeroInfo(index))
const playerHeroItems = computed(() => (index: number | string) => getPlayerHeroItems(index))
const getPlayerMedalImage = computed(
  () => (seasonRank: number | undefined) => getMedalImage(seasonRank)
)
const getPlayerStarImage = computed(
  () => (seasonRank: number | undefined) => getStarImage(seasonRank)
)
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
        <div class="flex items-center gap-2 relative">
          <div class="w-[90px] h-20 relative">
            <div class="avatar-container avatar-border">
              <Avatar
                v-tooltip.top="player?.name"
                class="avatar avatar-border"
                :image="getPlayerInfo(player.accountid)?.steamAccount?.avatar"
              />
            </div>
            <i
              v-if="getPlayerInfo(player.accountid)?.steamAccount?.countryCode"
              :class="getFlagClass(getPlayerInfo(player.accountid)?.steamAccount?.countryCode)"
              class="-top-20 left-20 rounded-sm absolute text-xl"
            ></i>
          </div>

          <div class="flex items-center justify-center gap-1">
            <span class="font-bold mr-2"> {{ player?.name }} </span>
            <span
              v-if="getPlayerInfo(player.accountid)?.steamAccount?.guild?.guild"
              v-tooltip.top="{
                value: tooltipContent(player),
                escape: false
              }"
              class="font-bold guild"
            >
              [{{ getPlayerInfo(player.accountid)?.steamAccount?.guild?.guild?.tag }}]
            </span>
            <img
              v-if="getPlayerInfo(player.accountid)?.steamAccount?.proSteamAccount"
              v-tooltip.top="'Pro player'"
              class="w-5 h-5"
              src="@renderer/assets/player_pro.svg"
              alt="player pro"
            />
            <img
              v-if="getPlayerInfo(player.accountid)?.steamAccount?.isAnonymous"
              v-tooltip.top="'Player private'"
              class="w-5 h-5"
              src="@renderer/assets/player_private.svg"
              alt="player private"
            />
            <img
              v-if="getPlayerInfo(player.accountid)?.steamAccount?.isDotaPlusSubscriber"
              v-tooltip.top="'Subscriber Dota Plus'"
              class="w-5 h-5"
              src="https://cdn.stratz.com/images/dota2/plus/logo.png"
              alt="Subscriber Dota Plus"
            />
          </div>

          <!-- Rank Medal -->
          <div class="relative flex items-center gap-2">
            <img
              v-tooltip.top="'Season Rank'"
              class="absolute w-auto h-auto"
              :src="getPlayerStarImage(getPlayerInfo(player.accountid)?.steamAccount?.seasonRank)"
            />
            <img
              v-tooltip.top="'Season Rank'"
              class="w-auto h-20"
              :src="getPlayerMedalImage(getPlayerInfo(player.accountid)?.steamAccount?.seasonRank)"
              alt="medal"
            />
            <p
              v-if="getPlayerInfo(player.accountid)?.steamAccount?.seasonLeaderboardRank"
              class="absolute left-7 bottom-0 right-0 text-xl squada-one-regular bg-gradient-to-r font-semibold from-slate-100 via-slate-50 to-slate-100 inline-block text-transparent bg-clip-text"
            >
              {{ getPlayerInfo(player.accountid)?.steamAccount?.seasonLeaderboardRank }}
            </p>
          </div>
        </div>

        <!-- Profile Links -->
        <div class="flex items-center gap-2 min-w-52 justify-end mr-3">
          <a
            class="link"
            :href="'https://steamcommunity.com/profiles/' + player.steamid"
            target="_blank"
          >
            <img class="w-5 h-5" alt="steam icon" src="@renderer/assets/steam_icon.svg" />
          </a>
          <a class="link" :href="`https://stratz.com/players/${player.accountid}`" target="_blank">
            <img class="h-8 w-8 p-1 rounded-lg" src="@renderer/assets/stratz.png" alt="Ícone" />
          </a>
          <a
            class="link"
            :href="'https://www.opendota.com/players/' + player.accountid"
            target="_blank"
          >
            <img class="w-5 h-5" alt="opendota icon" src="@renderer/assets/opendota.png" />
          </a>
          <a
            class="link"
            :href="'https://www.dotabuff.com/players/' + player.accountid"
            target="_blank"
          >
            <img class="w-5 h-5" alt="dotabuff icon" src="@renderer/assets/dotabuff.png" />
          </a>
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
          <div class="flex w-full h-full bg-[#222] p-4 rounded-lg mt-2">
            <!-- Hero Image -->
            <div class="flex flex-col">
              <OverlayBadge :value="playerHeroInfo(index)?.level" severity="warn" size="large">
                <div
                  :class="`w-full h-auto rounded-ss-lg border-2 border-gray-500 bg-[#222]`"
                  style="
                    background-image: linear-gradient(135deg, rgb(34, 34, 34), rgb(68, 68, 68));
                  "
                >
                  <video
                    v-tooltip="
                      `NAME: ${normalizeHeroName(playerHeroInfo(index)?.name!)}\nLEVEL: ${playerHeroInfo(index)?.level}`
                    "
                    class="w-full min-h-full"
                    :poster="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(playerHeroInfo(index)?.name!)}.png`"
                    autoplay
                    preload="auto"
                    loop
                    playsinline
                  >
                    <source
                      type='video/mp4; codecs="hvc1"'
                      :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(playerHeroInfo(index)?.name!)}.mov`"
                    />
                    <source
                      type="video/webm"
                      :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(playerHeroInfo(index)?.name!)}.webm`"
                    />
                    <img
                      :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(playerHeroInfo(index)?.name!)}.png`"
                    />
                  </video>
                </div>
              </OverlayBadge>
              <!-- Health and Mana -->
              <div class="flex w-full h-5 bg-green-600">
                <div class="relative h-full w-full">
                  <div
                    class="h-full bg-green-400"
                    :style="{
                      width: `${((playerHeroInfo(index)?.health ?? 0) / (playerHeroInfo(index)?.max_health ?? 1)) * 100}%`
                    }"
                  ></div>
                  <p
                    class="absolute -top-[2px] left-0 right-0 bottom-0 squada-one-regular text-gray-200 text-lg text-center"
                  >
                    {{ playerHeroInfo(index)?.health }} /
                    {{ playerHeroInfo(index)?.max_health }}
                  </p>
                </div>
              </div>
              <div class="flex w-full h-5 bg-blue-600">
                <div class="relative h-full w-full">
                  <div
                    class="h-full bg-blue-400"
                    :style="{
                      width: `${((playerHeroInfo(index)?.mana ?? 0) / (playerHeroInfo(index)?.max_mana ?? 1)) * 100}%`
                    }"
                  ></div>
                  <p
                    class="absolute -top-[2px] left-0 right-0 bottom-0 squada-one-regular text-gray-200 text-lg text-center"
                  >
                    {{ playerHeroInfo(index)?.mana }} / {{ playerHeroInfo(index)?.max_mana }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Hero Information -->
            <div class="flex w-10/12 flex-col gap-2">
              <!-- Hero Info -->
              <div class="m-2 mt-4 text-gray-200">
                <p class="font-semibold squada-one-regular text-3xl">
                  {{ normalizeHeroName(playerHeroInfo(index)?.name!) }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg">
                  K/D/A: {{ player.kills }} / {{ player.deaths }} / {{ player.assists }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg">
                  LH: {{ player.last_hits }} | DN: {{ player.denies }}
                </p>
              </div>

              <div class="flex flex-col w-full m-2 rounded-lg gap-1">
                <p class="font-semibold squada-one-regular text-lg uppercase text-gray-200">
                  Basic Stats
                </p>
                <div class="bg-[#222] rounded-lg">
                  <div class="flex w-full h-full items-center justify-between gap-2">
                    <div class="flex flex-col">
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        GPM: {{ player.gpm }}
                      </p>
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        XPM: {{ player.xpm }}
                      </p>
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        Kill Streak: {{ player.kill_streak }}
                      </p>
                    </div>
                    <div class="flex flex-col">
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        Hero Damage: {{ player.hero_damage }}
                      </p>
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        Smoked: {{ playerHeroInfo(index)?.smoked ? 'Yes' : 'No' }}
                      </p>
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        Stacks: {{ player.camps_stacked }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="bg-[#222] p-2 rounded-lg mt-2 flex flex-col gap-2">
            <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">Items</p>
            <div class="flex w-full h-full gap-2">
              <div
                v-for="(item, key) in Object.keys(playerHeroItems(index))
                  .filter((key) => key.startsWith('slot'))
                  .slice(0, 6)"
                :key="key"
                v-tooltip.top="normalizeItemName(playerHeroItems(index)[item].name!)"
                class="flex flex-col cursor-pointer"
              >
                <img
                  :src="
                    normalizeItemNameImage(playerHeroItems(index)[item].name)
                      ? `https://cdn.stratz.com/images/dota2/items/${normalizeItemNameImage(playerHeroItems(index)[item].name)}.png`
                      : '/src/assets/icons/empyt.png'
                  "
                  class="w-12 h-10 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col rounded-lg">
          <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">
            Player Stats
          </p>
          <div
            v-if="getPlayerInfo(player.accountid)?.matches"
            class="bg-[#222] p-4 rounded-lg mt-2"
          >
            <PlayerLastmatch :matches="getPlayerInfo(player.accountid)?.matches ?? []" />
          </div>

          <div
            v-if="
              getPlayerInfo(player.accountid)?.heroesGroupBy &&
              !getPlayerInfo(player.accountid)?.steamAccount?.isAnonymous
            "
            class="flex w-full h-full flex-col rounded-lg mt-2"
          >
            <p class="font-semibold squada-one-regular text-3xl uppercase text-gray-200">
              Best Heroes
            </p>
            <div class="bg-[#222] p-2 rounded-lg mt-2">
              <BestHeroes
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

<style scoped>
.guild {
  letter-spacing: 0.0083em;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  color: hsl(187, 31%, 73%);
  display: inline;
  vertical-align: middle;
  margin-left: 5px;
  cursor: help;
}
.avatar-container {
  background: rgb(180, 119, 95);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
}
.avatar {
  width: 100px;
  height: 80px;
}
.avatar-border {
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  border: 2px solid rgb(180, 119, 95);
}
.avatar-border img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
</style>
