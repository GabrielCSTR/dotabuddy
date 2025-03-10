<script setup lang="ts">
import { normalizeHeroName, normalizeHeroNameImage } from '@renderer/utils'

const props = defineProps<{
  heroName: string
  heroLevel: number
}>()
</script>
<template>
  <div
    :class="`w-full h-full rounded-ss-lg border-2 border-gray-500 bg-[#222]`"
    style="background-image: linear-gradient(135deg, rgb(34, 34, 34), rgb(68, 68, 68))"
  >
    <video
      v-tooltip="`NAME: ${normalizeHeroName(props.heroName)}\nLEVEL: ${props.heroLevel}`"
      class="w-full h-full"
      :poster="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(props.heroName)}.png`"
      autoplay
      preload="auto"
      loop
      playsinline
    >
      <source
        type='video/mp4; codecs="hvc1"'
        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(props.heroName)}.mov`"
      />
      <source
        type="video/webm"
        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(props.heroName)}.webm`"
      />
      <img
        :src="`https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${normalizeHeroNameImage(props.heroName)}.png`"
      />
    </video>
  </div>
</template>
