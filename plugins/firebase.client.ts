export default defineNuxtPlugin(async () => {
  const { initializeApp } = await import('firebase/app')
  const { getAuth, onAuthStateChanged } = await import('firebase/auth')
  
  const config = useRuntimeConfig()
  const app = initializeApp(config.public.firebaseConfig)
  const auth = getAuth(app)
  const authStore = useAuthStore()

  // Handle redirect result on app initialization
  await authStore.handleRedirectResult()
  
  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    authStore.setUser(user)
  })

  return {
    provide: {
      firebase: {
        app,
        auth
      }
    }
  }
})