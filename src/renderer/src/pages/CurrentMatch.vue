<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Dota2Events } from '@renderer/types'

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

const toHHMMSS = (num: number) => {
  const min = Math.floor(num / 60)
  const sec = num % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
</script>
<template>
  <div class="flex flex-col w-full h-full items-center p-4">
    <div class="w-full max-w-4xl items-center justify-center flex flex-col gap-4 mx-auto mt-8">
      <h1 class="text-2xl font-bold text-center">Dota 2 Overlay</h1>
      <p v-if="gameState?.map" class="text-center text-gray-400 mb-4">
        Tempo de jogo: {{ toHHMMSS(gameState.map.clock_time) }}
      </p>
      <p v-else class="text-center text-gray-400">Aguardando dados do Dota 2...</p>
    </div>

    <div class="flex flex-col gap-4">
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
  </div>
</template>
