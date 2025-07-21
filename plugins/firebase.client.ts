import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const firebaseConfig = config.public.firebaseConfig
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app)
  
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app)
  
  return {
    provide: {
      firebase: {
        app,
        auth,
        db
      }
    }
  }
})