<template>
  <header class="bg-white shadow-sm border-b">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900">
            CodeChallenge
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/question"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Question
            </NuxtLink>
            
            <NuxtLink
              v-if="authStore.isAdmin"
              to="/admin"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Admin
            </NuxtLink>

            <!-- User Menu -->
            <div class="relative" v-click-outside="closeUserMenu">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <img
                  v-if="authStore.user?.photoURL"
                  :src="authStore.user.photoURL"
                  :alt="authStore.user.displayName"
                  class="w-8 h-8 rounded-full"
                >
                <div v-else class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {{ authStore.user?.displayName?.charAt(0) }}
                </div>
                <ChevronDownIcon class="w-4 h-4" />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <div class="font-medium">{{ authStore.user?.displayName }}</div>
                  <div class="text-gray-500">{{ authStore.user?.email }}</div>
                </div>
                <button
                  @click="handleSignOut"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <button
              @click="authStore.signInWithGoogle()"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In with Google
            </button>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const userMenuOpen = ref(false)

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const handleSignOut = async () => {
  closeUserMenu()
  await authStore.signOut()
}

// Custom directive for click outside
const vClickOutside = {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = event => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted: el => {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>