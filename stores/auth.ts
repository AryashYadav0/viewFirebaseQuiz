import { defineStore } from 'pinia'
import { type User } from 'firebase/auth'

interface AuthUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  isAdmin?: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    loading: true,
    isAdmin: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || null
  },

  actions: {
    async initAuth() {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { onAuthStateChanged } = await import('firebase/auth')
      
      return new Promise((resolve) => {
        onAuthStateChanged($firebase.auth, async (user: User | null) => {
          if (user) {
            const authUser: AuthUser = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName!,
              photoURL: user.photoURL || undefined
            }
            
            this.user = authUser
            await this.checkAdminStatus()
            
            // Store user data in Firestore
            await this.saveUserToFirestore(authUser)
          } else {
            this.user = null
            this.isAdmin = false
          }
          
          this.loading = false
          resolve(user)
        })
      })
    },

    async signInWithGoogle() {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
      const provider = new GoogleAuthProvider()
      
      try {
        // Try popup first
        const result = await signInWithPopup($firebase.auth, provider)
        this.user = result.user
      } catch (popupError: any) {
        // If popup is blocked, fall back to redirect
        if (popupError.code === 'auth/popup-blocked') {
          console.log('Popup blocked, using redirect method...')
          const { signInWithRedirect } = await import('firebase/auth')
          await signInWithRedirect($firebase.auth, provider)
          // The redirect will handle the authentication
          return
        }
        console.error('Error signing in with Google:', popupError)
        throw popupError
      }
    },

    async signOut() {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { signOut } = await import('firebase/auth')
      
      try {
        await signOut($firebase.auth)
        this.user = null
        this.isAdmin = false
        await navigateTo('/')
      } catch (error) {
        console.error('Error signing out:', error)
        throw error
      }
    },

    async checkAdminStatus() {
      if (!process.client || !this.user?.email) return
      
      const { $firebase } = useNuxtApp()
      const { doc, getDoc } = await import('firebase/firestore')
      const adminRef = doc($firebase.db, 'admins', this.user.email)
      const adminDoc = await getDoc(adminRef)
      
      this.isAdmin = adminDoc.exists()
    },

    async saveUserToFirestore(user: AuthUser) {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { doc, setDoc } = await import('firebase/firestore')
      const userRef = doc($firebase.db, 'users', user.uid)
      
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        createdAt: new Date()
      }, { merge: true })
    },

    async handleRedirectResult() {
      if (!process.client) return
      
      try {
        const { getAuth, getRedirectResult } = await import('firebase/auth')
        const auth = getAuth()
        const result = await getRedirectResult(auth)
        
        if (result) {
          this.user = result.user
          this.isAuthenticated = true
        }
      } catch (error: any) {
        console.error('Error handling redirect result:', error)
      }
    }
  }
})