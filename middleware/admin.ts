export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // If still loading, don't redirect yet
  if (authStore.loading) {
    return
  }
  
  // If not authenticated or not admin, redirect to home
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    return navigateTo('/')
  }
})