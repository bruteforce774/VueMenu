// ========================================
// UNDERSTANDING ASYNC API PATTERNS IN PINIA
// ========================================

import { ref } from 'vue'

// ========================================
// PART 1: THE FAKE API (Current Implementation)
// ========================================

interface Todo {
  id: number
  text: string
  done: boolean
}

// This simulates a network delay
async function fakeApiCall(): Promise<Todo[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'Kjøp melk', done: false },
        { id: 2, text: 'Lær Pinia', done: true },
      ])
    }, 600)  // 600ms delay to simulate network latency
  })
}

/*
HOW THIS WORKS:

1. new Promise(resolve => ...) - Creates a Promise
2. setTimeout(..., 600) - Waits 600 milliseconds
3. resolve([...]) - Fulfills the promise with todo data
4. async function - Allows using 'await' when calling it
5. Promise<Todo[]> - TypeScript knows it returns an array of todos

This is GREAT for learning because:
- You see loading states in action (600ms is visible)
- No need for a real backend server
- No network errors to worry about
- Predictable data for testing
*/


// ========================================
// PART 2: THE STORE ACTION (Lines 76-89)
// ========================================

const todos = ref<Todo[]>([])
const isLoading = ref(false)

async function fetchTodosFromServer() {
  try {
    // STEP 1: Set loading state BEFORE the API call
    isLoading.value = true

    // STEP 2: Make the async API call (waits here until done)
    const response = await fakeApiCall()

    // STEP 3: Update state with the response
    todos.value = response

  } catch (error) {
    // STEP 4: Handle errors (network issues, server errors, etc.)
    console.error('Klarte ikke å hente todos', error)

  } finally {
    // STEP 5: ALWAYS run this - even if there's an error
    // Turn off loading state
    isLoading.value = false
  }
}

/*
THE TRY-CATCH-FINALLY PATTERN:

┌─────────────────────────────────────┐
│ try {                               │
│   isLoading = true                  │ ← Always runs first
│   const data = await api()          │ ← Waits for API
│   todos = data                      │ ← Updates state
│ }                                   │
├─────────────────────────────────────┤
│ catch (error) {                     │ ← Only runs if error
│   console.error(error)              │
│ }                                   │
├─────────────────────────────────────┤
│ finally {                           │ ← ALWAYS runs (success or error)
│   isLoading = false                 │
│ }                                   │
└─────────────────────────────────────┘

WHY FINALLY IS IMPORTANT:
- Even if the API throws an error, loading state gets turned off
- Without finally, isLoading could stay true forever after an error
- User would see "Laster..." forever! 😱
*/


// ========================================
// PART 3: THE LOADING STATE IN UI
// ========================================

/*
In TodoApp.vue:

<div v-if="todoStore.isLoading">Laster...</div>

TIMELINE:
1. User opens page
2. onMounted() calls fetchTodosFromServer()
3. isLoading.value = true → UI shows "Laster..."
4. await fakeApiCall() → waits 600ms
5. todos.value = response → UI shows todos
6. finally: isLoading.value = false → "Laster..." disappears

This gives users feedback that something is happening!
*/


// ========================================
// PART 4: WHY ASYNC/AWAIT?
// ========================================

// OLD WAY (Callbacks) - Harder to read
function fetchTodosOldWay() {
  isLoading.value = true

  fakeApiCall()
    .then(response => {
      todos.value = response
      isLoading.value = false
    })
    .catch(error => {
      console.error(error)
      isLoading.value = false  // Duplicate code!
    })
}

// NEW WAY (Async/Await) - Reads like synchronous code
async function fetchTodosNewWay() {
  try {
    isLoading.value = true
    const response = await fakeApiCall()
    todos.value = response
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false  // Only written once!
  }
}

/*
BENEFITS OF ASYNC/AWAIT:
✅ Reads top to bottom (easier to understand)
✅ try-catch works like normal code
✅ finally block for cleanup
✅ Easier to debug
✅ Less nesting ("callback hell")
*/


// ========================================
// PART 5: ERROR HANDLING SCENARIOS
// ========================================

// Scenario 1: Network is down
async function fetchWithNetworkError() {
  try {
    isLoading.value = true
    const response = await fetch('https://api.example.com/todos')
    // ❌ Throws error: Failed to fetch
    todos.value = await response.json()
  } catch (error) {
    // ✅ Caught here!
    console.error('Network error:', error)
    // Could set an error message in state:
    // errorMessage.value = 'Kunne ikke koble til server'
  } finally {
    isLoading.value = false  // ✅ Still runs!
  }
}

// Scenario 2: Server returns error (404, 500, etc.)
async function fetchWithServerError() {
  try {
    isLoading.value = true
    const response = await fetch('https://api.example.com/todos')

    if (!response.ok) {
      // response.ok is false for 4xx and 5xx errors
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    todos.value = await response.json()
  } catch (error) {
    console.error('Server error:', error)
  } finally {
    isLoading.value = false
  }
}


// ========================================
// PART 6: MULTIPLE API CALLS IN SEQUENCE
// ========================================

async function fetchUserAndTodos(userId: number) {
  try {
    isLoading.value = true

    // Call 1: Get user info
    const user = await fetchUser(userId)

    // Call 2: Get todos for that user (depends on Call 1)
    const userTodos = await fetchUserTodos(user.id)

    todos.value = userTodos
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}


// ========================================
// PART 7: PARALLEL API CALLS
// ========================================

async function fetchMultipleThingsInParallel() {
  try {
    isLoading.value = true

    // Start all calls at the same time (faster!)
    const [todosData, categoriesData, userProfileData] = await Promise.all([
      fetchTodos(),
      fetchCategories(),
      fetchUserProfile(),
    ])

    todos.value = todosData
    // Update other state with categoriesData and userProfileData

  } catch (error) {
    // If ANY call fails, this catches it
    console.error(error)
  } finally {
    isLoading.value = false
  }
}


// ========================================
// SUMMARY: KEY CONCEPTS
// ========================================

/*
1. ASYNC FUNCTION
   - Can use 'await' inside
   - Always returns a Promise

2. AWAIT KEYWORD
   - Pauses execution until Promise resolves
   - Makes async code look synchronous

3. TRY-CATCH-FINALLY
   - try: normal code path
   - catch: handles errors
   - finally: always runs (cleanup)

4. LOADING STATES
   - isLoading.value = true BEFORE API call
   - isLoading.value = false in finally block
   - Shows UI feedback to users

5. ERROR HANDLING
   - Network errors → caught automatically
   - Server errors → check response.ok
   - Show user-friendly messages

6. TYPESCRIPT
   - Promise<Todo[]> tells TypeScript what to expect
   - Autocomplete works on the response
   - Type errors caught at compile time
*/
