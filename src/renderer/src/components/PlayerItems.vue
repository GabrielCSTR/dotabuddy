<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { PlayerStats } from '@renderer/types'
import { normalizeItemName, normalizeItemNameImage } from '@renderer/utils'
import imageEmpty from '../assets/icons/empyt.png'

const props = defineProps<{
  player: PlayerStats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playerHeroItems: Record<string, any>
}>()

const imageUrl = imageEmpty

// Computed property to filter items and slice them properly
const getPlayerItems = computed(() => {
  return Object.keys(props.playerHeroItems)
    .filter((key) => key.startsWith('slot'))
    .slice(0, 6)
    .map((key) => props.playerHeroItems[key])
})

// Helper function to get item icon source
const itemIconSrc = (itemName: string) => {
  return normalizeItemNameImage(itemName)
    ? `https://cdn.stratz.com/images/dota2/items/${normalizeItemNameImage(itemName)}.png`
    : null
}

// Cooldowns
const cooldowns = ref<Record<string, number>>({})
const initialCooldowns = ref<Record<string, number>>({})

// Update cooldowns
const updateCooldowns = async () => {
  await nextTick()
  Object.keys(props.playerHeroItems).forEach((key) => {
    const item = props.playerHeroItems[key]
    if (item?.cooldown > 0) {
      cooldowns.value[key] = item.cooldown
      if (!initialCooldowns.value[key]) {
        initialCooldowns.value[key] = item.cooldown
      }
    }
  })
}

onMounted(updateCooldowns)
watch(() => props.playerHeroItems, updateCooldowns, { deep: true })
</script>

<template>
  <div
    v-for="(item, key) in getPlayerItems"
    :key="key"
    v-tooltip.top="normalizeItemName(item.name)"
    class="relative flex flex-col cursor-pointer"
  >
    <div
      class="relative p-2.5 w-20 h-full bg-black bg-opacity-50 rounded-sm"
      :style="{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <img
        v-if="itemIconSrc(item.name)"
        :src="itemIconSrc(item.name) ?? ''"
        :alt="item.name"
        class="w-full h-full rounded-sm"
      />

      <!-- Cooldown Overlay -->
      <div
        class="absolute top-0 left-0 w-full bg-black bg-opacity-60 flex justify-center items-center text-white text-lg font-bold transition-all duration-1000 ease-linear"
        :style="{
          height: `${(cooldowns[key] / (initialCooldowns[key] || 1)) * 100}%`
        }"
      ></div>

      <!-- Time Cooldown -->
      <div
        v-if="cooldowns[key] > 1"
        class="absolute inset-0 flex items-center justify-center text-white text-lg font-bold"
      >
        {{ cooldowns[key] }}
      </div>
    </div>
  </div>
</template>
