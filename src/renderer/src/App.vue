<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'app-current-match' })
  }, 25000)
})
</script>

<template>
  <router-view />
</template>
