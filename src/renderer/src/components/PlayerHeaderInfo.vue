<script setup lang="ts">
import { IPlayerSummary } from '@renderer/types'
import { computed } from 'vue'

const props = defineProps<{
  player: undefined | IPlayerSummary
}>()
console.log('PLAYER HEADER', props.player)

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

const getPlayerMedalImage = computed(
  () => (seasonRank: number | undefined) => getMedalImage(seasonRank)
)
const getPlayerStarImage = computed(
  () => (seasonRank: number | undefined) => getStarImage(seasonRank)
)

const getFlagClass = (countryCode: string | undefined) => {
  return countryCode ? `fi fi-${countryCode.toLowerCase()}` : ''
}

const tooltipContent = (guild) => {
  return `
    <div class="flex items-center space-x-2">
      <img
        src="${guild?.logo}"
        alt="Guild Avatar"
        class="w-16 h-16"
      />
      <span class="font-bold text-lg">${guild?.name}</span>
    </div>
  `
}
</script>
<template>
  <div class="flex items-center gap-2 relative">
    <div class="w-[90px] h-20 relative">
      <div class="avatar-container avatar-border">
        <Avatar
          v-tooltip.top="props.player?.steamAccount?.name"
          class="avatar avatar-border"
          :image="props.player?.steamAccount?.avatar"
        />
      </div>
      <i
        v-if="props.player?.steamAccount?.countryCode"
        :class="getFlagClass(props.player?.steamAccount?.countryCode)"
        class="-top-20 left-20 rounded-sm absolute text-xl"
      ></i>
    </div>

    <div class="flex items-center justify-center gap-1">
      <img
        v-if="props.player?.steamAccount?.proSteamAccount"
        v-tooltip.top="'Pro player'"
        class="w-5 h-5 mr-1"
        src="@renderer/assets/player_pro.svg"
        alt="player pro"
      />
      <span class="font-bold mr-2">
        {{ props.player?.steamAccount?.proSteamAccount?.name ?? props.player?.steamAccount?.name }}
      </span>
      <span class="absolute top-12 bottom-0 left-24 right-0 text-sm text-gray-300">{{
        props.player?.steamAccount?.proSteamAccount?.name ? props.player?.steamAccount?.name : ''
      }}</span>
      <span
        v-if="props.player?.steamAccount?.guild?.guild"
        v-tooltip.top="{
          value: tooltipContent(props.player?.steamAccount?.guild?.guild),
          escape: false
        }"
        class="font-bold guild"
      >
        [{{ props.player?.steamAccount?.guild?.guild?.tag }}]
      </span>
      <img
        v-if="props.player?.steamAccount?.isAnonymous"
        v-tooltip.top="'Player private'"
        class="w-5 h-5"
        src="@renderer/assets/player_private.svg"
        alt="player private"
      />
      <img
        v-if="props.player?.steamAccount?.isDotaPlusSubscriber"
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
        :src="getPlayerStarImage(props.player?.steamAccount?.seasonRank)"
      />
      <img
        v-tooltip.top="'Season Rank'"
        class="w-auto h-20"
        :src="getPlayerMedalImage(props.player?.steamAccount?.seasonRank)"
        alt="medal"
      />
      <p
        v-if="props.player?.steamAccount?.seasonLeaderboardRank"
        class="absolute left-7 bottom-0 right-0 text-xl squada-one-regular bg-gradient-to-r font-semibold from-slate-100 via-slate-50 to-slate-100 inline-block text-transparent bg-clip-text"
      >
        {{ props.player?.steamAccount?.seasonLeaderboardRank }}
      </p>
    </div>

    <div class="flex items-center ml-2">
      <div class="flex flex-col gap-1">
        <p class="font-semibold squada-one-regular text-1xl uppercase text-gray-200">Matches</p>
        <p class="font-semibold squada-one-regular text-xl uppercase text-orange-400">
          {{ props.player?.matchCount ?? 0 }}
        </p>
      </div>
      <Divider layout="vertical" class="border-2 border-gray-400" />
      <div class="flex flex-col gap-1">
        <p class="font-semibold squada-one-regular text-1xl uppercase text-gray-200">Winrate</p>
        <p
          class="font-semibold squada-one-regular text-xl uppercase text-green-400"
          :class="{
            'text-red-400': (props.player?.winCount! / props.player?.matchCount!) * 100 < 50
          }"
        >
          {{ ((props.player?.winCount! / props.player?.matchCount!) * 100).toFixed(2) }}%
        </p>
      </div>
    </div>
  </div>
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
