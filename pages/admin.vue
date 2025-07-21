<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="!authStore.isAdmin" class="max-w-md mx-auto mt-12">
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Access Denied</h2>
        <p class="text-gray-600 mb-6">You don't have admin privileges to access this page.</p>
        <NuxtLink
          to="/"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
    
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage users and view submissions</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="text-blue-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Total Admins</h3>
              <p class="text-2xl font-bold text-blue-600">{{ adminStore.admins.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="text-green-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Total Submissions</h3>
              <p class="text-2xl font-bold text-green-600">{{ submissionsStore.submissions.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="text-purple-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Unique Users</h3>
              <p class="text-2xl font-bold text-purple-600">{{ uniqueUsers }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              @click="activeTab = 'submissions'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'submissions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Submissions
            </button>
            <button
              @click="activeTab = 'admins'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'admins'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Manage Admins
            </button>
          </nav>
        </div>

        <!-- Submissions Tab -->
        <div v-if="activeTab === 'submissions'" class="p-6">
          <div v-if="submissionsStore.loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          <div v-else-if="submissionsStore.submissions.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p class="text-gray-500">No submissions yet</p>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="submission in submissionsStore.submissions"
              :key="submission.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ submission.userName }}</h3>
                  <p class="text-sm text-gray-600">{{ submission.userEmail }}</p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(submission.submittedAt) }}
                  </p>
                </div>
                <button
                  @click="toggleSubmission(submission.id)"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {{ expandedSubmissions.has(submission.id) ? 'Hide Code' : 'View Code' }}
                </button>
              </div>
              
              <div v-if="expandedSubmissions.has(submission.id)" class="mt-4">
                <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
                  <pre>{{ submission.code }}</pre>
                </div>
                
                <div v-if="submission.result" class="mt-4">
                  <h4 class="font-medium text-gray-900 mb-2">Execution Result:</h4>
                  <div class="bg-gray-100 p-3 rounded text-sm">
                    <div v-if="submission.result.error" class="text-red-600">
                      <strong>Error:</strong>
                      <pre>{{ submission.result.error }}</pre>
                    </div>
                    <div v-else class="whitespace-pre-wrap">{{ submission.result.result }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admins Tab -->
        <div v-if="activeTab === 'admins'" class="p-6">
          <!-- Add Admin Form -->
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Admin</h3>
            <div class="flex space-x-4">
              <input
                v-model="newAdminEmail"
                type="email"
                placeholder="Enter email address"
                class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <button
                @click="addAdmin"
                :disabled="!newAdminEmail || addingAdmin"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ addingAdmin ? 'Adding...' : 'Add Admin' }}
              </button>
            </div>
          </div>

          <!-- Admin List -->
          <div v-if="adminStore.loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="admin in adminStore.admins"
              :key="admin.email"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 class="font-semibold text-gray-900">{{ admin.email }}</h3>
                <p class="text-sm text-gray-600">
                  Added by {{ admin.addedBy }} on {{ formatDate(admin.addedAt) }}
                </p>
              </div>
              
              <button
                v-if="admin.email !== authStore.user?.email"
                @click="removeAdmin(admin.email)"
                :disabled="removingAdmin === admin.email"
                class="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {{ removingAdmin === admin.email ? 'Removing...' : 'Remove' }}
              </button>
              
              <span v-else class="text-sm text-gray-500 font-medium">
                You (Can't remove yourself)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Middleware to check admin access
definePageMeta({
  middleware: 'admin'
})

const authStore = useAuthStore()
const submissionsStore = useSubmissionsStore()
const adminStore = useAdminStore()

const activeTab = ref('submissions')
const expandedSubmissions = ref(new Set())
const newAdminEmail = ref('')
const addingAdmin = ref(false)
const removingAdmin = ref(null)

const uniqueUsers = computed(() => {
  const users = new Set(submissionsStore.submissions.map(s => s.userEmail))
  return users.size
})

onMounted(async () => {
  await Promise.all([
    submissionsStore.fetchAllSubmissions(),
    adminStore.fetchAdmins()
  ])
})

const toggleSubmission = (id) => {
  if (expandedSubmissions.value.has(id)) {
    expandedSubmissions.value.delete(id)
  } else {
    expandedSubmissions.value.add(id)
  }
}

const addAdmin = async () => {
  if (!newAdminEmail.value) return
  
  addingAdmin.value = true
  try {
    await adminStore.addAdmin(newAdminEmail.value)
    newAdminEmail.value = ''
  } catch (error) {
    console.error('Error adding admin:', error)
    // You could show an error message here
  } finally {
    addingAdmin.value = false
  }
}

const removeAdmin = async (email) => {
  removingAdmin.value = email
  try {
    await adminStore.removeAdmin(email)
  } catch (error) {
    console.error('Error removing admin:', error)
    // You could show an error message here
  } finally {
    removingAdmin.value = null
  }
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  
  let d = date
  if (date.toDate) {
    d = date.toDate() // Firebase Timestamp
  } else if (typeof date === 'string') {
    d = new Date(date)
  }
  
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}
</script>