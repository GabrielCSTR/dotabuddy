<script setup lang="ts">
import { PlayerStats } from '@renderer/types'
import { ref, onMounted } from 'vue'
import useOpenDota from '@renderer/composables/useOpenDota'
import { useCurrentMatchStore } from '@renderer/stores'

const { getPorfileOpenDota } = useOpenDota()

const props = defineProps<{
  player: PlayerStats
}>()

const currentMatchStore = useCurrentMatchStore()
const playerOpenDota = ref()

onMounted(async () => {
  // get player informations from opendota
  const player = await getPorfileOpenDota(props.player.steamid)
  const radiantPlayers = currentMatchStore.getRadiantPlayers()
  const direPlayers = currentMatchStore.getDirePlayers()

  playerOpenDota.value =
    (radiantPlayers?.team2 &&
      Object.values(radiantPlayers.team2).find((p) => p.steamid === props.player.steamid)) ||
    (direPlayers?.team2 &&
      Object.values(direPlayers.team2).find((p) => p.steamid === props.player.steamid)) ||
    player

  console.log('playerOpenDota', playerOpenDota.value)
})

const getFlagClass = (countryCode: string | undefined) => {
  if (!countryCode) return ''
  return `fi fi-${countryCode.toLowerCase()}`
}
</script>
<template>
  <div
    v-if="!currentMatchStore.isMatchRunning"
    class="flex flex-col w-full h-full items-center justify-center p-4"
  >
    <i class="pi pi-spin pi-spinner text-amber-800 text-5xl"></i>
  </div>
  <Panel v-else class="flex flex-col w-full mt-2 relative" toggleable>
    <template #header>
      <div class="flex items-center justify-between w-full gap-2">
        <!-- Avatar + Flag + Nome + Rank Medal -->
        <div class="flex items-center gap-2 relative">
          <div class="relative">
            <Avatar
              class="mr-2"
              size="xlarge"
              :image="playerOpenDota?.profile?.avatarfull"
              shape="circle"
            />
            <i
              v-if="playerOpenDota?.profile?.loccountrycode"
              :class="getFlagClass(playerOpenDota?.profile?.loccountrycode)"
              class="-top-12 -left-5 w-6 h-6 z-10"
            ></i>
          </div>

          <span class="font-bold min-w-28"> {{ props.player?.name }}</span>

          <!-- Rank Medal -->
          <div class="relative flex items-center gap-2">
            <img
              class="w-16 h-14"
              :src="
                playerOpenDota?.rank?.image
                  ? `/src/assets/ranks/${playerOpenDota?.rank?.image}`
                  : '/src/assets/ranks/0.png'
              "
              alt="medal"
            />
            <p
              v-if="playerOpenDota?.player?.leaderboard_rank"
              class="absolute ml-4 mt-9 text-xl p-1 squada-one-regular bg-gradient-to-r font-semibold from-slate-100 via-slate-50 to-slate-100 inline-block text-transparent bg-clip-text"
            >
              {{ playerOpenDota?.player?.leaderboard_rank }}
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

    <h1>{{ props.player?.name }}</h1>
  </Panel>
</template>
