<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Dota2Events } from '@renderer/types'
import MatchTimer from '@renderer/components/MatchTimer.vue'

const gameState = ref<Dota2Events>()
const radiantPlayers = ref<Dota2Events['player']>()
const direPlayers = ref<Dota2Events['player']>()
const radiantHeroes = ref<Dota2Events['hero']>()
const direHeroes = ref<Dota2Events['hero']>()

const fetchDotaData = async () => {
  gameState.value = await window.electron.ipcRenderer.invoke('get-dota2-data')
  if (gameState.value) {
    radiantPlayers.value = gameState.value.player?.team2 as unknown as Dota2Events['player']
    direPlayers.value = gameState.value.player?.team3 as unknown as Dota2Events['player']
    radiantHeroes.value = gameState.value.hero?.team2 as unknown as Dota2Events['hero']
    direHeroes.value = gameState.value.hero?.team3 as unknown as Dota2Events['hero']
  }
}

onMounted(() => {
  fetchDotaData()
  setInterval(fetchDotaData, 1000)
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

    <MatchTimer v-if="gameState?.map" :map="gameState?.map" />

    <Divider type="solid" />

    <div v-if="gameState?.map" class="flex flex-col gap-4">
      <!-- Radiant Team -->
      <div class="flex items-center justify-center gap-4">
        <div
          v-for="(player, key) in radiantPlayers"
          :key="key"
          class="bg-green-700 p-4 rounded-lg shadow-md flex items-center gap-4"
        >
          <img
            v-if="radiantHeroes?.[key]"
            :src="`http://cdn.dota2.com/apps/dota2/images/heroes/${String(radiantHeroes[key].name).split('npc_dota_hero_')[1]}_lg.png`"
            class="w-28 h-full rounded-lg shadow-md"
          />
          <div>
            <p class="font-bold">{{ player.name }}</p>
            <p class="text-sm">KDA: {{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</p>
          </div>
        </div>
      </div>

      <!-- Dire Team -->
      <div class="flex justify-center gap-4">
        <div
          v-for="(player, key) in direPlayers"
          :key="key"
          class="bg-red-700 p-4 rounded-lg shadow-md flex items-center gap-4"
        >
          <img
            v-if="direHeroes?.[key]"
            :src="`http://cdn.dota2.com/apps/dota2/images/heroes/${String(direHeroes[key].name).split('npc_dota_hero_')[1]}_lg.png`"
            class="w-28 h-full rounded-lg shadow-md"
          />
          <div>
            <p class="font-bold">{{ player.name }}</p>
            <p class="text-sm">KDA: {{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-gray-400">Aguardando dados do Dota 2...</p>
  </div>
</template>
<style>
.p-divider.p-divider-horizontal:before {
  border-top: 1px solid #e5e7eb !important;
}
</style>
