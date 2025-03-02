<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { DIRE, Dota2Events, RADIANT } from '@renderer/types'
import { useCurrentMatchStore } from '@renderer/stores/mathPlayer'

import MatchTimer from '@renderer/components/MatchTimer.vue'
import IconRadiant from '@renderer/components/icons/IconRadiant.vue'
import IconDire from '@renderer/components/icons/IconDire.vue'
import MathPlayer from '@renderer/components/MatchPlayer.vue'

const currentMatchStore = useCurrentMatchStore()

const gameState = ref<Dota2Events>()
const isMatchRunning = ref(false)
const isComponentLoaded = ref(false)

const fetchDotaData = async () => {
  gameState.value = await window.electron.ipcRenderer.invoke('get-dota2-data')
  isMatchRunning.value =
    gameState.value?.map?.game_state == 'DOTA_GAMERULES_STATE_PRE_GAME' ||
    gameState.value?.map?.game_state == 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS'

  if (gameState.value && isMatchRunning.value) {
    console.log('GAME STATE', gameState.value)

    currentMatchStore.addRadiantPlayer(
      gameState.value.player?.[RADIANT] as unknown as Dota2Events['player']
    )
    currentMatchStore.addDirePlayer(
      gameState.value.player?.[DIRE] as unknown as Dota2Events['player']
    )
    currentMatchStore.addRadiantHero(
      gameState.value.hero?.[RADIANT] as unknown as Dota2Events['hero']
    )
    currentMatchStore.addDireHero(gameState.value.hero?.[DIRE] as unknown as Dota2Events['hero'])
    // currentMatchStore.addRadiantSkills(
    //   gameState.value?.abilities?[RADIANT] as unknown as Dota2Events['abilities']
    // )
    // currentMatchStore.addDireSkills(
    //   gameState.value?.abilities?[DIRE] as unknown as Dota2Events['abilities']
    // )
    currentMatchStore.addRadiantItems(
      gameState.value?.items?.[RADIANT] as unknown as Dota2Events['items']
    )
    currentMatchStore.addDireItems(
      gameState.value?.items?.[DIRE] as unknown as Dota2Events['items']
    )
    currentMatchStore.isMatchRunning = true
  }
}

onMounted(() => {
  fetchDotaData()
  // setInterval(fetchDotaData, 1000)
})
</script>
<template>
  <div class="flex flex-col w-full h-full items-center p-4">
    <div class="w-full max-w-4xl items-center flex flex-col gap-4 mx-auto">
      <h1
        class="text-5xl bg-gradient-to-r squada-one-regular uppercase from-amber-800 via-amber-700 to-amber-600 inline-block text-transparent bg-clip-text drop-shadow-lg shadow-amber-700"
      >
        <i class="pi pi-sitemap text-amber-800 text-4xl"></i>
        CURRENT MATCH
      </h1>
    </div>

    <div v-if="!isMatchRunning" class="flex flex-col w-full h-full items-center justify-center p-4">
      <div class="flex flex-col w-full h-full items-center justify-center p-4">
        <i class="pi pi-spin pi-spinner-dotted text-amber-800 text-7xl"></i>
      </div>
      <h1
        class="animate-fadein animate-once animate-duration-1000 text-5xl bg-gradient-to-r squada-one-regular uppercase from-amber-800 via-amber-700 to-amber-600 inline-block text-transparent bg-clip-text drop-shadow-lg shadow-amber-700"
      >
        <i class="pi pi-wifi text-amber-800 text-4xl"></i>
        Waiting for match to start...
      </h1>
    </div>

    <MatchTimer v-if="isMatchRunning && gameState?.map" :map="gameState.map" />

    <Divider type="solid" />

    <div v-if="isMatchRunning" class="flex flex-col w-full h-full gap-4">
      <Panel class="flex flex-col w-full radiant" toggleable>
        <template #header>
          <div class="flex items-center radiant gap-2 radiant-shadown">
            <IconRadiant />
            <span class="font-bold text-2xl squada-one-regular uppercase">Radiant</span>
          </div>
        </template>
        <div class="flex flex-col w-full h-full gap-4">
          <MathPlayer
            v-for="(player, key) in currentMatchStore.getRadiantPlayers()"
            :key="key"
            :player="player"
            :index="key"
          />
        </div>
      </Panel>

      <Panel class="flex flex-col w-full dire mt-5" toggleable>
        <template #header>
          <div class="flex items-center dire gap-2 dire-shadown">
            <IconDire />
            <span class="font-bold text-2xl squada-one-regular uppercase">Dire</span>
          </div>
        </template>
        <MathPlayer
          v-for="(player, key) in currentMatchStore.getDirePlayers()"
          :key="key"
          :player="player"
          :index="key"
        />
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
