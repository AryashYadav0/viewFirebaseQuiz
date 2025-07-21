import { defineStore } from 'pinia'
import { type Timestamp } from 'firebase/firestore'

interface Submission {
  id?: string
  userEmail: string
  userName: string
  code: string
  language: string
  question: string
  submittedAt: Timestamp | Date
  result?: {
    output?: string
    error?: string
  }
}

export const useSubmissionsStore = defineStore('submissions', {
  state: () => ({
    submissions: [] as Submission[],
    loading: false
  }),

  actions: {
    async submitCode(code: string, language: string = 'python', result?: any) {
      if (!process.client) return
      
      const authStore = useAuthStore()
      const { $firebase } = useNuxtApp()
      const { collection, addDoc } = await import('firebase/firestore')
      
      if (!authStore.user) {
        throw new Error('User must be authenticated')
      }

      const submission: Omit<Submission, 'id'> = {
        userEmail: authStore.user.email,
        userName: authStore.user.displayName,
        code,
        language,
        question: "Write a function to print the first 100 prime numbers.",
        submittedAt: new Date(),
        result
      }

      try {
        const docRef = await addDoc(collection($firebase.db, 'submissions'), submission)
        return docRef.id
      } catch (error) {
        console.error('Error submitting code:', error)
        throw error
      }
    },

    async fetchAllSubmissions() {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
      this.loading = true

      try {
        const q = query(
          collection($firebase.db, 'submissions'),
          orderBy('submittedAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        
        this.submissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Submission[]
      } catch (error) {
        console.error('Error fetching submissions:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserSubmissions(userEmail: string) {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { collection, getDocs, query, orderBy, where } = await import('firebase/firestore')
      this.loading = true

      try {
        const q = query(
          collection($firebase.db, 'submissions'),
          where('userEmail', '==', userEmail),
          orderBy('submittedAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        
        this.submissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Submission[]
      } catch (error) {
        console.error('Error fetching user submissions:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})