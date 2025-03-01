<script lang="ts" setup>
import Barwindow from '@renderer/components/BarWindow.vue'
import { ref } from 'vue'

const menu = ref([
  { route: '/app/current-match', label: 'Current match', icon: 'pi pi-sitemap' },
  { route: '/app/match-history', label: 'Match history', icon: 'pi pi-chart-line' },
  { route: '/app/settings', label: 'Settings', icon: 'pi pi-cog' }
])
</script>

<template>
  <div class="flex flex-col w-full h-screen">
    <Barwindow />

    <Tabs value="/app/current-match" class="flex w-full items-center justify-center">
      <TabList class="flex w-full h-full items-center justify-center">
        <Tab v-for="tab in menu" :key="tab.label" :value="tab.route" class="flex-grow text-center">
          <router-link v-if="tab.route" v-slot="{ navigate }" :to="tab.route" custom>
            <p-button
              v-ripple
              :icon="tab.icon"
              size="large"
              :label="tab.label"
              class="w-full h-12"
              @click="navigate"
            >
            </p-button>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>

    <div class="flex-grow bg-gray-800 overflow-auto relative">
      <router-view></router-view>
    </div>
  </div>
</template>
