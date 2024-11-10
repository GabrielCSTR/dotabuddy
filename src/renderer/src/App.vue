<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'Dashboard' })
  }, 25000)
})
</script>

<template>
  <div class="dark">
    <router-view />
  </div>
</template>
