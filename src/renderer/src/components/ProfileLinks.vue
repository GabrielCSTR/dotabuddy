<script setup lang="ts">
const props = defineProps<{
  steamid: string
  accountid: string
}>()
</script>
<template>
  <a class="link" :href="'https://steamcommunity.com/profiles/' + props.steamid" target="_blank">
    <img class="w-5 h-5" alt="steam icon" src="@renderer/assets/steam_icon.svg" />
  </a>
  <a class="link" :href="`https://stratz.com/players/${props.accountid}`" target="_blank">
    <img class="h-8 w-8 p-1 rounded-lg" src="@renderer/assets/stratz.png" alt="Ícone" />
  </a>
  <a class="link" :href="'https://www.opendota.com/players/' + props.accountid" target="_blank">
    <img class="w-5 h-5" alt="opendota icon" src="@renderer/assets/opendota.png" />
  </a>
  <a class="link" :href="'https://www.dotabuff.com/players/' + props.accountid" target="_blank">
    <img class="w-5 h-5" alt="dotabuff icon" src="@renderer/assets/dotabuff.png" />
  </a>
</template>
