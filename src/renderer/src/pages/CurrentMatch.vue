<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { DIRE, RADIANT, Dota2Events, IPlayerSummary } from '@renderer/types'
import { useCurrentMatchStore } from '@renderer/stores/mathPlayer'
import useStratz from '@renderer/composables/useStratz'

import MatchTimer from '@renderer/components/MatchTimer.vue'
import IconRadiant from '@renderer/components/icons/IconRadiant.vue'
import IconDire from '@renderer/components/icons/IconDire.vue'
import MatchPlayer from '@renderer/components/MatchPlayer.vue'

const currentMatchStore = useCurrentMatchStore()
const { makeGraphQLProfileRequest } = useStratz()

const gameState = ref<Dota2Events | null>(null)
const isMatchRunning = ref(false)
const activeLobbyPlayerIds = ref<number[]>([])
const matchPlayerData = ref<Record<string, IPlayerSummary>>({})

// Computed properties
const radiantPlayers = computed(() => currentMatchStore.getRadiantPlayers() || {})
const direPlayers = computed(() => currentMatchStore.getDirePlayers() || {})

// Watchers
watch(gameState, async (newValue) => {
  if (newValue) {
    await fetchStratzData()
  }
})

// Functions
const updateMatchState = async () => {
  gameState.value = await window.electron.ipcRenderer.invoke('get-dota2-data')
  const gamePhase = gameState.value?.map?.game_state
  isMatchRunning.value = [
    'DOTA_GAMERULES_STATE_PRE_GAME',
    'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS'
  ].includes(gamePhase ?? '')

  if (isMatchRunning.value && gameState.value) {
    console.log('GAME STATE', gameState.value)
    setMatchData(gameState.value)
    activeLobbyPlayerIds.value = [
      ...Object.values(gameState.value.player?.[RADIANT] ?? {}).map((p) =>
        parseInt((p as { accountid: string }).accountid)
      ),
      ...Object.values(gameState.value.player?.[DIRE] ?? {}).map((p) =>
        parseInt((p as { accountid: string }).accountid)
      )
    ]
  }
}

const setMatchData = (gameState: Dota2Events) => {
  if (!gameState) return

  currentMatchStore.addRadiantPlayer(gameState.player?.[RADIANT] as Dota2Events['player'])
  currentMatchStore.addDirePlayer(gameState.player?.[DIRE] as Dota2Events['player'])
  currentMatchStore.addRadiantHero(gameState.hero?.[RADIANT] as Dota2Events['hero'])
  currentMatchStore.addDireHero(gameState.hero?.[DIRE] as Dota2Events['hero'])
  currentMatchStore.addRadiantItems(gameState.items?.[RADIANT] as Dota2Events['items'])
  currentMatchStore.addDireItems(gameState.items?.[DIRE] as Dota2Events['items'])

  currentMatchStore.isMatchRunning = true
}

const fetchStratzData = async () => {
  if (!isMatchRunning.value) return
  matchPlayerData.value = await makeGraphQLProfileRequest(activeLobbyPlayerIds.value)
  console.log('OPEN STRATZ PLAYER', matchPlayerData.value)
}

onMounted(async () => {
  await updateMatchState()
})
</script>

<template>
  <div class="flex flex-col w-full h-full items-center p-4">
    <div class="w-full max-w-4xl flex flex-col gap-4 items-center mx-auto">
      <h1
        class="text-5xl bg-gradient-to-r squada-one-regular uppercase from-amber-800 via-amber-700 to-amber-600 text-transparent bg-clip-text drop-shadow-lg shadow-amber-700"
      >
        <i class="pi pi-sitemap text-amber-800 text-4xl"></i>
        CURRENT MATCH
      </h1>
    </div>

    <div v-if="!isMatchRunning" class="flex flex-col w-full h-full items-center justify-center p-4">
      <i class="pi pi-spin pi-spinner-dotted text-amber-800 text-7xl"></i>
      <h1
        class="animate-fadein text-5xl bg-gradient-to-r squada-one-regular uppercase from-amber-800 via-amber-700 to-amber-600 text-transparent bg-clip-text drop-shadow-lg shadow-amber-700"
      >
        <i class="pi pi-wifi text-amber-800 text-4xl"></i>
        Waiting for match to start...
      </h1>
    </div>

    <MatchTimer v-if="isMatchRunning && gameState?.map" :map="gameState.map" />

    <Divider type="solid" />

    <div v-if="isMatchRunning && gameState?.map" class="flex flex-col w-full h-full gap-4">
      <Panel class="flex flex-col w-full radiant" toggleable>
        <template #header>
          <div class="flex items-center gap-2 radiant-shadown">
            <IconRadiant />
            <span class="font-bold text-2xl squada-one-regular uppercase">Radiant</span>
          </div>
        </template>
        <MatchPlayer
          v-if="Object.keys(matchPlayerData).length && gameState?.player"
          :players-data="matchPlayerData"
          :players-events="radiantPlayers"
        />
        <div v-else class="flex flex-col w-full h-full items-center justify-center p-4">
          <i class="pi pi-spin pi-spinner text-amber-800 text-5xl"></i>
        </div>
      </Panel>

      <Panel class="flex flex-col w-full dire mt-5" toggleable>
        <template #header>
          <div class="flex items-center gap-2 dire-shadown">
            <IconDire />
            <span class="font-bold text-2xl squada-one-regular uppercase">Dire</span>
          </div>
        </template>
        <MatchPlayer
          v-if="Object.keys(matchPlayerData).length && gameState?.player"
          :players-data="matchPlayerData"
          :players-events="direPlayers"
        />
        <div v-else class="flex flex-col w-full h-full items-center justify-center p-4">
          <i class="pi pi-spin pi-spinner text-amber-800 text-5xl"></i>
        </div>
      </Panel>
    </div>
  </div>
</template>
<style scoped>
:deep(.p-panel) {
  background: #1a2939 !important;
}
:deep(.p-panel-content) {
  padding: 0px !important;
  max-height: 100%;
  margin-bottom: 15px !important;
}
.p-divider.p-divider-horizontal:before {
  border-top: 1px solid #e5e7eb !important;
}
:deep(.p-panel .p-panel-header) {
  background-color: #1a2939 !important;
}

:deep(.radiant .p-panel-header) {
  background-color: #14532d !important;
  border-bottom: 3px solid #22c55e;
}

:deep(.dire .p-panel-header) {
  background-color: #7f1d1d !important;
  border-bottom: 3px solid #dc2626;
}

.radiant svg {
  filter: drop-shadow(green 0px 0px 5px);
  fill: rgba(255, 255, 255, 0.87) !important;
}
.team svg {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  vertical-align: sub;
}
.radiant-shadown {
  filter: drop-shadow(green 0px 0px 5px);
  fill: rgb(245, 245, 245);
}
user agent stylesheet svg:not(:root) {
  overflow-clip-margin: content-box;
  overflow: hidden;
}
.team > span {
  letter-spacing: 1px;
}
.radiant {
  color: rgb(102, 187, 106);
}
.team {
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.23);
  padding: 8px;
  border-radius: 3px;
  margin-right: 30px;
  margin-left: 30px;
  justify-self: flex-end;
  font-weight: 700;
  font-size: 28px;
}
.dire-shadown svg {
  filter: drop-shadow(rgb(255, 76, 76) 0px 0px 5px);
  fill: black !important;
}
.team.dire {
  background: rgba(143, 16, 16, 0.23);
}
.dire {
  color: rgb(255, 76, 76);
}
</style>
