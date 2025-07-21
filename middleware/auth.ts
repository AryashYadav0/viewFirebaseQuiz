export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // If still loading, don't redirect yet
  if (authStore.loading) {
    return
  }
  
  // If not authenticated, redirect to home
  if (!authStore.isAuthenticated) {
    return navigateTo('/')
  }
})