import { defineStore } from 'pinia'

interface Admin {
  email: string
  addedAt: Date
  addedBy: string
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    admins: [] as Admin[],
    loading: false
  }),

  actions: {
    async fetchAdmins() {
      if (!process.client) return
      
      const { $firebase } = useNuxtApp()
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
      this.loading = true

      try {
        const q = query(
          collection($firebase.db, 'admins'),
          orderBy('addedAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        
        this.admins = querySnapshot.docs.map(doc => ({
          email: doc.id,
          ...doc.data()
        })) as Admin[]
      } catch (error) {
        console.error('Error fetching admins:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addAdmin(email: string) {
      if (!process.client) return
      
      const authStore = useAuthStore()
      const { $firebase } = useNuxtApp()
      const { doc, setDoc } = await import('firebase/firestore')

      if (!authStore.user || !authStore.isAdmin) {
        throw new Error('Only admins can add other admins')
      }

      const adminData: Omit<Admin, 'email'> = {
        addedAt: new Date(),
        addedBy: authStore.user.email
      }

      try {
        await setDoc(doc($firebase.db, 'admins', email), adminData)
        await this.fetchAdmins()
      } catch (error) {
        console.error('Error adding admin:', error)
        throw error
      }
    },

    async removeAdmin(email: string) {
      if (!process.client) return
      
      const authStore = useAuthStore()
      const { $firebase } = useNuxtApp()
      const { doc, deleteDoc } = await import('firebase/firestore')

      if (!authStore.user || !authStore.isAdmin) {
        throw new Error('Only admins can remove other admins')
      }

      if (email === authStore.user.email) {
        throw new Error('You cannot remove yourself as admin')
      }

      try {
        await deleteDoc(doc($firebase.db, 'admins', email))
        await this.fetchAdmins()
      } catch (error) {
        console.error('Error removing admin:', error)
        throw error
      }
    }
  }
})