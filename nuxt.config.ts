// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "demo-project",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
        appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
      }
    }
  }
})