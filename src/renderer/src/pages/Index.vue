<script setup lang="ts">
import Versions from '@renderer/components/Versions.vue'
</script>

<template>
  <video class="fixed top-0 left-0 w-full h-full object-cover z-[-1]" autoplay loop>
    <source src="@renderer/assets/d2_loading.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div
    class="flex flex-col items-center absolute top-3/4 left-1/2 transform translate-x-[-50%] translate-y-[-50%] text-gray-200"
  >
    <h1
      class="text-8xl bg-gradient-to-r squada-one-regular uppercase from-amber-800 via-amber-700 to-amber-600 inline-block text-transparent bg-clip-text drop-shadow-lg shadow-amber-700"
    >
      DotoBot
    </h1>
    <h1
      class="bg-gradient-to-r uppercase text-5xl squada-one-regular from-amber-800 via-amber-700 to-amber-600 inline-block text-transparent bg-clip-text"
    >
      Stats
    </h1>
    <p
      class="bg-gradient-to-r font-semibold squada-one-regular mt-2 text-center text-lg from-amber-800 via-amber-700 to-amber-600 inline-block text-transparent bg-clip-text"
      style="text-shadow: 0 0 2px rgba(255, 255, 255, 0.8)"
    >
      DotaBuddy is a cross-platform, open-source application with helpful features for when you're
      playing a match of Dota 2
    </p>
    <Versions />
  </div>
</template>
