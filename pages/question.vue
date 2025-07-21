<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="!authStore.isAuthenticated" class="max-w-md mx-auto mt-12">
      <div class="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
        <p class="text-gray-600 mb-6">You need to sign in to access the programming question.</p>
        <button
          @click="authStore.signInWithGoogle()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In with Google
        </button>
      </div>
    </div>
    
    <div v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Question Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Programming Challenge</h1>
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <h2 class="text-lg font-semibold text-blue-800 mb-2">Question:</h2>
          <p class="text-blue-700">
            Write a function to print the first 100 prime numbers.
          </p>
        </div>
        
        <div class="text-sm text-gray-600">
          <h3 class="font-semibold mb-2">Requirements:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li>Create a function that finds and prints the first 100 prime numbers</li>
            <li>You can use any algorithm you prefer</li>
            <li>Make sure your solution is efficient</li>
            <li>Test your code using the "Run Code" button</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Code Editor Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Code Editor</h2>
          
          <div class="code-editor mb-4">
            <codemirror
              v-model="code"
              :options="cmOptions"
              class="border rounded-lg"
            />
          </div>
          
          <div class="flex space-x-4">
            <button
              @click="runCode"
              :disabled="running"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg v-if="running" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ running ? 'Running...' : 'Run Code' }}
            </button>
            
            <button
              @click="submitCode"
              :disabled="submitting || !code.trim()"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Submitting...' : 'Submit Solution' }}
            </button>
          </div>
        </div>

        <!-- Output Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Output</h2>
          
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto">
            <div v-if="output">
              <div v-if="output.error" class="text-red-400">
                <div class="font-semibold">Error:</div>
                <pre>{{ output.error }}</pre>
              </div>
              <div v-else class="whitespace-pre-wrap">{{ output.result }}</div>
            </div>
            <div v-else class="text-gray-500">
              Click "Run Code" to see the output here...
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Solution Submitted!</h3>
            <p class="text-gray-500 mb-4">Your code has been successfully submitted and saved.</p>
            <button
              @click="showSuccessModal = false"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Coding
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { loadPyodide } from 'pyodide'

// Middleware to check authentication
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const submissionsStore = useSubmissionsStore()

const code = ref(`# Write a function to print the first 100 prime numbers

def print_first_n_primes(n):
    """Print the first n prime numbers"""
    primes = []
    num = 2
    
    while len(primes) < n:
        is_prime = True
        for prime in primes:
            if prime * prime > num:
                break
            if num % prime == 0:
                is_prime = False
                break
        
        if is_prime:
            primes.append(num)
            print(num)
        
        num += 1
    
    return primes

# Call the function to print first 100 primes
print_first_n_primes(100)`)

const output = ref(null)
const running = ref(false)
const submitting = ref(false)
const showSuccessModal = ref(false)
let pyodide = null

const cmOptions = {
  mode: 'python',
  theme: 'dracula',
  lineNumbers: true,
  lineWrapping: true,
  indentUnit: 4,
  indentWithTabs: false,
}

onMounted(async () => {
  try {
    pyodide = await loadPyodide()
  } catch (error) {
    console.error('Failed to load Pyodide:', error)
  }
})

const runCode = async () => {
  if (!pyodide) {
    output.value = { error: 'Python environment not loaded yet. Please try again.' }
    return
  }

  running.value = true
  output.value = null

  try {
    // Capture stdout
    pyodide.runPython(`
      import sys
      from io import StringIO
      sys.stdout = StringIO()
    `)

    // Run user code
    pyodide.runPython(code.value)

    // Get the output
    const result = pyodide.runPython('sys.stdout.getvalue()')
    
    output.value = { result }
  } catch (error) {
    output.value = { error: error.toString() }
  } finally {
    running.value = false
  }
}

const submitCode = async () => {
  submitting.value = true
  
  try {
    await submissionsStore.submitCode(code.value, 'python', output.value)
    showSuccessModal.value = true
  } catch (error) {
    console.error('Failed to submit code:', error)
    // You could show an error modal here
  } finally {
    submitting.value = false
  }
}
</script>