export default defineNuxtPlugin(async () => {
  const { initializeApp } = await import('firebase/app')
  const { getAuth } = await import('firebase/auth')
  
  const config = useRuntimeConfig()
  const app = initializeApp(config.public.firebaseConfig)
  const auth = getAuth(app)
  const authStore = useAuthStore()

  // Handle redirect result on app initialization
  await authStore.handleRedirectResult()

  return {
    provide: {
      firebase: {
        app,
        auth
      }
    }
  }
})