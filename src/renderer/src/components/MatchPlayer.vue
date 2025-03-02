<script setup lang="ts">
import { IPlayerSummary, PlayerStats, IHero, IAbility } from '@renderer/types'
import { ref, onMounted } from 'vue'
import { useCurrentMatchStore } from '@renderer/stores'
import useStractz from '@renderer/composables/useStratz'
import {
  normalizeHeroName,
  normalizeHeroNameImage,
  normalizeItemName,
  normalizeItemNameImage
} from '@renderer/utils'

const { makeGraphQLProfileRequest } = useStractz()

const props = defineProps<{
  player: PlayerStats
  index: string
}>()

const currentMatchStore = useCurrentMatchStore()
const matchPlayerData = ref<IPlayerSummary>()
const matchPlayerHero = ref<IHero>()
const matchHeroSkills = ref<Record<string, Record<string, IAbility>>>({})
const matchPlayerItems = ref<Record<string, { name: string; time: number }>>({})

onMounted(async () => {
  // get hero informations
  const radiantHeroes = currentMatchStore.getRadiantHeroes()
  const direHeroes = currentMatchStore.getDireHeroes()
  matchPlayerHero.value = radiantHeroes?.[props.index] || direHeroes?.[props.index]

  // get player informations from opendota
  if (!matchPlayerData.value) {
    // get player informations from stratz
    const openStratzPlayer = await makeGraphQLProfileRequest(+props.player.accountid)
    matchPlayerData.value = openStratzPlayer?.player
    // console.log('OPEN STRATZ PLAYER', matchPlayerData.value)
  }

  // get hero skills
  const heroSkills =
    currentMatchStore.getRadiantSkills()?.[props.index] ||
    currentMatchStore.getDireSkills()?.[props.index]
  matchHeroSkills.value = heroSkills || {}

  // get hero items
  const heroItems =
    currentMatchStore.getRadiantItems()?.[props.index] ||
    currentMatchStore.getDireItems()?.[props.index]
  matchPlayerItems.value = heroItems || {}

  console.log('MATCH PLAYER DATA', props.player)
})

const getFlagClass = (countryCode: string | undefined) => {
  if (!countryCode) return ''
  return `fi fi-${countryCode.toLowerCase()}`
}
</script>
<template>
  <div
    v-if="!currentMatchStore.isMatchRunning || !matchPlayerData"
    class="flex flex-col w-full h-full items-center justify-center p-4"
  >
    <i class="pi pi-spin pi-spinner text-amber-800 text-5xl"></i>
  </div>
  <Panel v-else class="flex flex-col w-full mt-2 relative" toggleable>
    <template #header>
      <div class="flex items-center justify-between w-full gap-2">
        <!-- Avatar + Flag + Nome + Rank Medal -->
        <div class="flex items-center gap-2 relative">
          <div class="w-[80px] h-[65px] relative">
            <Avatar
              v-tooltip="props.player?.name"
              class="mr-2"
              size="xlarge"
              :image="matchPlayerData?.steamAccount?.avatar"
              shape="circle"
            />
            <i
              v-if="matchPlayerData?.steamAccount?.countryCode"
              :class="getFlagClass(matchPlayerData?.steamAccount?.countryCode)"
              class="-top-16 left-12"
            ></i>
          </div>

          <div class="flex items-center justify-center gap-1">
            <span class="font-bold mr-2"> {{ props.player?.name }} </span>
            <span
              v-if="matchPlayerData?.steamAccount?.guild?.guild"
              v-tooltip.top="
                `${matchPlayerData?.steamAccount?.guild?.guild?.name} - ${matchPlayerData?.steamAccount?.guild?.guild?.motd}`
              "
              class="font-bold guild"
            >
              [{{ matchPlayerData?.steamAccount?.guild?.guild?.tag }}]
            </span>
            <img
              v-if="matchPlayerData?.steamAccount?.proSteamAccount"
              v-tooltip.top="'Pro player'"
              class="w-5 h-5"
              src="@renderer/assets/player_pro.svg"
              alt="player pro"
            />
            <img
              v-if="matchPlayerData?.steamAccount?.isAnonymous"
              v-tooltip.top="'Player private'"
              class="w-5 h-5"
              src="@renderer/assets/player_private.svg"
              alt="player private"
            />
            <img
              v-if="matchPlayerData?.steamAccount?.isDotaPlusSubscriber"
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
              class="w-16 h-14"
              :src="
                matchPlayerData?.steamAccount?.seasonRank === 80
                  ? '/src/assets/ranks/medal_8.png'
                  : `/src/assets/ranks/medal_${Math.floor(matchPlayerData?.steamAccount?.seasonRank / 10)}`
              "
              alt="medal"
            />
            <p
              v-if="matchPlayerData?.steamAccount?.seasonLeaderboardRank"
              class="absolute ml-4 mt-9 text-xl p-1 squada-one-regular bg-gradient-to-r font-semibold from-slate-100 via-slate-50 to-slate-100 inline-block text-transparent bg-clip-text"
            >
              {{ matchPlayerData?.steamAccount?.seasonLeaderboardRank }}
            </p>
          </div>
        </div>

        <!-- Links do Perfil -->
        <div class="flex items-center gap-2 min-w-52 justify-end mr-3">
          <a
            class="link"
            :href="'https://steamcommunity.com/profiles/' + props.player?.steamid"
            target="_blank"
          >
            <img class="w-5 h-5" alt="steam icon" src="@renderer/assets/steam_icon.svg" />
          </a>
          <a
            class="link"
            :href="`https://stratz.com/players/${props.player?.steamid}`"
            target="_blank"
          >
            <img class="h-8 w-8 p-1 rounded-lg" src="@renderer/assets/stratz.png" alt="Ícone" />
          </a>
          <a
            class="link"
            :href="'https://www.opendota.com/players/' + props.player?.steamid"
            target="_blank"
          >
            <img class="w-5 h-5" alt="opendota icon" src="@renderer/assets/opendota.png" />
          </a>
          <a
            class="link"
            :href="'https://www.dotabuff.com/players/' + props.player?.steamid"
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
          <p class="font-semibold squada-one-regular text-lg uppercase">Match Hero Info</p>
          <div class="flex h-full bg-[#222] p-4 rounded-lg mt-2">
            <!-- Hero Image -->
            <div class="flex flex-col">
              <OverlayBadge
                v-tooltip="
                  `NAME: ${normalizeHeroName(matchPlayerHero?.name!)}\nLEVEL: ${matchPlayerHero?.level}`
                "
                :value="matchPlayerHero?.level"
                severity="warn"
                size="large"
              >
                <div :class="`w-56 h-[220px] rounded-l-r border-2 border-gray-700 bg-[#222]`">
                  <video
                    class="w-full min-h-full"
                    :poster="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(matchPlayerHero?.name!)}.png`"
                    autoplay
                    preload="auto"
                    loop
                    playsinline
                  >
                    <source
                      type='video/mp4; codecs="hvc1"'
                      :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(matchPlayerHero?.name!)}.mov`"
                    />
                    <source
                      type="video/webm"
                      :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(matchPlayerHero?.name!)}.webm`"
                    />
                    <img
                      :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(matchPlayerHero?.name!)}.png`"
                    />
                  </video>
                </div>
              </OverlayBadge>
              <!-- Health and Mana -->
              <div class="flex h-5 bg-green-600">
                <div class="relative h-full w-full">
                  <div
                    class="h-full bg-green-400"
                    :style="{
                      width: `${((matchPlayerHero?.health ?? 0) / (matchPlayerHero?.max_health ?? 1)) * 100}%`
                    }"
                  ></div>
                  <p
                    class="absolute -top-[2px] left-0 right-0 bottom-0 squada-one-regular text-white text-lg text-center"
                  >
                    {{ matchPlayerHero?.health }} / {{ matchPlayerHero?.max_health }}
                  </p>
                </div>
              </div>
              <div class="flex h-5 bg-blue-600">
                <div class="relative h-full w-full">
                  <div
                    class="h-full bg-blue-400"
                    :style="{
                      width: `${((matchPlayerHero?.mana ?? 0) / (matchPlayerHero?.max_mana ?? 1)) * 100}%`
                    }"
                  ></div>
                  <p
                    class="absolute -top-[2px] left-0 right-0 bottom-0 squada-one-regular text-white text-lg text-center"
                  >
                    {{ matchPlayerHero?.mana }} / {{ matchPlayerHero?.max_mana }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Hero INFORMATIONS -->
            <div class="flex flex-col gap-2">
              <!--  HERO INFO 01 -->
              <div class="m-2 mt-4 text-white">
                <p class="font-semibold squada-one-regular text-3xl">
                  {{ normalizeHeroName(matchPlayerHero?.name!) }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg">
                  K/D/A: {{ player.kills }} / {{ player.deaths }} / {{ player.assists }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg">
                  LH: {{ player.last_hits }} | DN: {{ player.denies }}
                </p>
              </div>

              <div class="flex flex-col w-full m-2 rounded-lg gap-1">
                <p class="font-semibold squada-one-regular text-lg uppercase">Basic Stats</p>
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
                        Smoked: {{ matchPlayerHero?.smoked ? 'Yes' : 'No' }}
                      </p>
                      <p class="text-gray-400 squada-one-regular text-lg uppercase">
                        Stacks: {{ player.camps_stacked }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- HERO INFO 02 -->
              <!-- <div class="ml-auto mt-4">
                <img
                v-for="(ability, key) in Object.values(matchHeroSkills).slice(0, 4)"
                :key="key"
                :src="`https://cdn.stratz.com/images/dota2/abilities/${ability.name}.png`"
                class="w-8 h-8"
              />
                <div class="flex flex-col">
                  <p class="text-gray-400 squada-one-regular text-lg uppercase">
                    Damage: {{ player.hero_damage }}
                  </p>
                  <p class="text-gray-400 squada-one-regular text-lg uppercase">
                    Gold: {{ player.gold }}
                  </p>
                  <p class="text-gray-400 squada-one-regular text-lg uppercase">
                    Tower Damage: {{ player.tower_damage }}
                  </p>
                </div>
              </div> -->
            </div>

            <!-- Talents -->
            <!-- <img src="@renderer/assets/talents.svg" class="w-6 h-6 ml-2" /> -->

            <div class="absolute left-0 bottom-0 right-0 w-full h-full pointer-events-none">
              <div
                class="absolute w-full h-full"
                style="
                  background: linear-gradient(
                    rgba(0, 0, 0, 0) 70%,
                    rgba(0, 0, 0, 0.733) 100%,
                    rgb(0, 0, 0) 100%
                  );
                "
              ></div>
            </div>
          </div>

          <!-- Items -->
          <div class="bg-[#222] p-2 rounded-lg mt-2 flex flex-col gap-2">
            <p class="font-semibold squada-one-regular text-lg uppercase">Items</p>
            <div class="flex w-full h-full gap-2">
              <div
                v-for="(skill, key) in Object.keys(matchPlayerItems)
                  .filter((key) => key.startsWith('slot'))
                  .slice(0, 6)"
                :key="key"
                v-tooltip.top="normalizeItemName(matchPlayerItems[skill].name!)"
                class="flex flex-col cursor-pointer"
              >
                <img
                  :src="`https://cdn.stratz.com/images/dota2/items/${normalizeItemNameImage(matchPlayerItems[skill].name)}.png`"
                  class="w-12 h-10 rounded-md"
                />
                <!-- <p class="text-gray-400 text-xs">{{ matchPlayerItems[key].time }}</p> -->
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col rounded-lg">
          <p class="font-semibold squada-one-regular text-lg uppercase">Player Stats</p>
          <div class="bg-[#222] p-4 rounded-lg mt-2">
            <div class="flex w-72 h-full items-center justify-between gap-2">
              <div class="flex flex-col">
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  Kills: {{ player.kills }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  Deaths: {{ player.deaths }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  GPM: {{ player.gpm }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  XPM: {{ player.xpm }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  LH: {{ player.last_hits }}
                </p>
              </div>
              <div class="flex flex-col">
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  Assists: {{ player.assists }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  KDA: {{ player.kills }} / {{ player.deaths }} / {{ player.assists }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  Denies: {{ player.denies }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  Level: {{ matchPlayerHero?.level }}
                </p>
                <p class="text-gray-400 squada-one-regular text-lg uppercase">
                  Net Worth: {{ player.net_worth }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Panel>
</template>
<style scoped>
.guild {
  -webkit-letter-spacing: 0.0083em;
  -moz-letter-spacing: 0.0083em;
  -ms-letter-spacing: 0.0083em;
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
</style>
