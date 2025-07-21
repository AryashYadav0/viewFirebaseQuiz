<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
  </div>
</template>

<script setup>
const authStore = useAuthStore()

// Initialize authentication on app mount
onMounted(async () => {
  await authStore.initAuth()
})
</script>