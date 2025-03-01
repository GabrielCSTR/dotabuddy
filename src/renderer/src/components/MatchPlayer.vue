<script setup lang="ts">
import { IPlayerSummary, PlayerStats, IHero, IAbility } from '@renderer/types'
import { ref, onMounted } from 'vue'
import { useCurrentMatchStore } from '@renderer/stores'
import useStractz from '@renderer/composables/useStratz'

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
  // get player informations from opendota
  if (!matchPlayerData.value) {
    // get player informations from opendota
    // const openDotaPlayer = await getPorfileOpenDota(props.player.steamid)
    const openStratzPlayer = await makeGraphQLProfileRequest(+props.player.accountid)
    matchPlayerData.value = openStratzPlayer?.player
    // console.log('OPEN STRATZ PLAYER', matchPlayerData.value)
  }

  // get hero informations
  const radiantHeroes = currentMatchStore.getRadiantHeroes()
  const direHeroes = currentMatchStore.getDireHeroes()
  matchPlayerHero.value = radiantHeroes?.[props.index] || direHeroes?.[props.index]
  // console.log('MATCH PLAYER HERO', matchPlayerHero.value)

  // get hero skills
  const heroSkills =
    currentMatchStore.getRadiantSkills()?.[props.index] ||
    currentMatchStore.getDireSkills()?.[props.index]
  matchHeroSkills.value = heroSkills || {}
  // console.log('HERO SKILLS', matchHeroSkills.value)

  const heroItems =
    currentMatchStore.getRadiantItems()?.[props.index] ||
    currentMatchStore.getDireItems()?.[props.index]
  matchPlayerItems.value = heroItems || {}
  // console.log('HERO ITEMS', matchPlayerItems.value)

  console.log('MATCH PLAYER DATA', props.player)

  // console.info(`MATCH PLAYER DATA ${props.index}`, matchPlayerData.value)
  // console.info(`MATCH PLAYER HERO ${props.index}`, matchPlayerHero.value)
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
      <div class="flex items-center bg-[#222] p-4 rounded-lg mt-2">
        <!-- Hero Image -->
        <img
          v-if="matchPlayerHero"
          :src="`http://cdn.dota2.com/apps/dota2/images/heroes/${String(matchPlayerHero?.name).split('npc_dota_hero_')[1]}_lg.png`"
          class="w-24 h-12 rounded-lg shadow-md"
        />
        <!--  Hero Name -->
        <div class="ml-4 text-white">
          <p class="font-semibold squada-one-regular text-lg">
            {{
              String(matchPlayerHero?.name)
                .split('npc_dota_hero_')[1]
                .split('_')
                .join(' ')
                .toLocaleUpperCase()
            }}
          </p>
          <p class="text-gray-400 squada-one-regular text-lg">
            KDA: {{ player.kills }} / {{ player.assists }} / {{ player.deaths }}
          </p>
        </div>

        <!-- Hero Skills -->
        <div class="flex items-center ml-auto gap-1">
          <img
            v-for="(ability, key) in Object.values(matchHeroSkills).slice(0, 4)"
            :key="key"
            :src="`https://cdn.stratz.com/images/dota2/abilities/${ability.name}.png`"
            class="w-8 h-8"
          />
        </div>

        <!-- Talents -->
        <!-- <img src="@renderer/assets/talents.svg" class="w-6 h-6 ml-2" /> -->
      </div>

      <!-- Itens e Tempo -->
      <div class="bg-[#222] p-3 rounded-lg mt-2 flex items-center gap-2">
        <div
          v-for="(key, index) in Object.keys(matchPlayerItems)
            .filter((key) => key.startsWith('slot'))
            .slice(0, 6)"
          :key="index"
          class="flex flex-col items-center"
        >
          <img
            :src="`https://cdn.stratz.com/images/dota2/items/${matchPlayerItems[key].name.split('item_')[1]}.png`"
            class="w-12 h-10 rounded-md"
          />
          <p class="text-gray-400 text-xs">{{ matchPlayerItems[key].time }}</p>
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
