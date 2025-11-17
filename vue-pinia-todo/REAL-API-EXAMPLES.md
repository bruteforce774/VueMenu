# How to Replace Fake API with Real API Calls

## Option 1: Using Browser's Built-in `fetch()`

### Basic Example (GET)

```typescript
// In src/stores/todoStore.ts

async function fetchTodosFromServer() {
  try {
    isLoading.value = true

    // REPLACE THIS:
    // const response = await fakeApiCall()

    // WITH THIS:
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Parse JSON response
    const data = await response.json()

    // Map API data to our Todo interface if needed
    todos.value = data.map((item: any) => ({
      id: item.id,
      text: item.title,
      done: item.completed,
    }))

  } catch (error) {
    console.error('Klarte ikke å hente todos', error)
    // Optional: set error state for UI
    // errorMessage.value = 'Kunne ikke laste todos'
  } finally {
    isLoading.value = false
  }
}
```

### POST Request (Create Todo)

```typescript
async function createTodoOnServer(text: string) {
  try {
    isLoading.value = true

    const response = await fetch('https://api.example.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        done: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const newTodo = await response.json()

    // Add to local state
    todos.value.push(newTodo)

  } catch (error) {
    console.error('Kunne ikke opprette todo', error)
  } finally {
    isLoading.value = false
  }
}
```

### PUT Request (Update Todo)

```typescript
async function updateTodoOnServer(id: number, updates: Partial<Todo>) {
  try {
    const response = await fetch(`https://api.example.com/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedTodo = await response.json()

    // Update in local state
    const index = todos.value.findIndex(t => t.id === id)
    if (index !== -1) {
      todos.value[index] = updatedTodo
    }

  } catch (error) {
    console.error('Kunne ikke oppdatere todo', error)
  }
}
```

### DELETE Request

```typescript
async function deleteTodoOnServer(id: number) {
  try {
    const response = await fetch(`https://api.example.com/todos/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Remove from local state
    todos.value = todos.value.filter(t => t.id !== id)

  } catch (error) {
    console.error('Kunne ikke slette todo', error)
  }
}
```

---

## Option 2: Using Axios (Cleaner Syntax)

### Installation

```bash
npm install axios
```

### Basic Example (GET)

```typescript
// In src/stores/todoStore.ts
import axios from 'axios'

async function fetchTodosFromServer() {
  try {
    isLoading.value = true

    // Axios automatically:
    // - Throws on 4xx/5xx errors
    // - Parses JSON
    // - Has better TypeScript support
    const response = await axios.get<Todo[]>('https://api.example.com/todos')

    todos.value = response.data

  } catch (error) {
    console.error('Klarte ikke å hente todos', error)
  } finally {
    isLoading.value = false
  }
}
```

### POST with Axios

```typescript
async function createTodoOnServer(text: string) {
  try {
    isLoading.value = true

    const response = await axios.post<Todo>('https://api.example.com/todos', {
      text: text,
      done: false,
    })

    todos.value.push(response.data)

  } catch (error) {
    console.error('Kunne ikke opprette todo', error)
  } finally {
    isLoading.value = false
  }
}
```

### Axios Instance with Base URL

```typescript
// src/api/client.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercept requests to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept responses to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

```typescript
// In src/stores/todoStore.ts
import { api } from '@/api/client'

async function fetchTodosFromServer() {
  try {
    isLoading.value = true
    const response = await api.get<Todo[]>('/todos')
    todos.value = response.data
  } catch (error) {
    console.error('Klarte ikke å hente todos', error)
  } finally {
    isLoading.value = false
  }
}
```

---

## Option 3: Using a Free Test API

### JSONPlaceholder (Free, No Auth)

```typescript
// src/stores/todoStore.ts

// JSONPlaceholder API: https://jsonplaceholder.typicode.com/
const API_BASE = 'https://jsonplaceholder.typicode.com'

async function fetchTodosFromServer() {
  try {
    isLoading.value = true

    const response = await fetch(`${API_BASE}/todos?_limit=10`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Map to our Todo interface
    todos.value = data.map((item: any) => ({
      id: item.id,
      text: item.title,
      done: item.completed,
    }))

  } catch (error) {
    console.error('Klarte ikke å hente todos', error)
  } finally {
    isLoading.value = false
  }
}
```

### Try it now!

Replace the `fetchTodosFromServer` function in `src/stores/todoStore.ts` with the code above, then:

```bash
cd vue-pinia-todo
npm run dev
```

You'll see real data from JSONPlaceholder API!

---

## Option 4: Environment Variables for API URLs

### Setup

Create `.env` file in project root:

```env
VITE_API_BASE_URL=https://api.example.com
```

Create `.env.development` for local development:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Create `.env.production` for production:

```env
VITE_API_BASE_URL=https://api.production.com
```

### Usage

```typescript
// src/stores/todoStore.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function fetchTodosFromServer() {
  try {
    isLoading.value = true

    const response = await fetch(`${API_BASE}/todos`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    todos.value = await response.json()

  } catch (error) {
    console.error('Klarte ikke å hente todos', error)
  } finally {
    isLoading.value = false
  }
}
```

**Note:** Vite requires the `VITE_` prefix for environment variables to be exposed to the client.

---

## Option 5: Better Error Handling with State

### Add Error State

```typescript
// In src/stores/todoStore.ts

const todos = ref<Todo[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)  // ADD THIS

async function fetchTodosFromServer() {
  try {
    isLoading.value = true
    error.value = null  // Clear previous errors

    const response = await fetch('https://api.example.com/todos')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    todos.value = await response.json()

  } catch (err) {
    // Set user-friendly error message
    error.value = 'Kunne ikke laste todos. Prøv igjen senere.'
    console.error('Klarte ikke å hente todos', err)
  } finally {
    isLoading.value = false
  }
}

// Don't forget to return it!
return {
  // ... other exports
  error,  // ADD THIS
}
```

### Show Error in UI

```vue
<!-- In src/components/TodoApp.vue -->

<div v-if="todoStore.isLoading">Laster...</div>

<div v-else-if="todoStore.error" style="color: red;">
  {{ todoStore.error }}
  <button @click="todoStore.fetchTodosFromServer()">Prøv igjen</button>
</div>

<ul v-else>
  <!-- Todos list -->
</ul>
```

---

## Complete Example: Full CRUD with Real API

```typescript
// src/stores/todoStore.ts (complete replacement)

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const API_BASE = 'https://api.example.com'

export interface Todo {
  id: number
  text: string
  done: boolean
}

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filter = ref<'all' | 'done' | 'active'>('all')

  const filteredTodos = computed(() => {
    if (filter.value === 'done') {
      return todos.value.filter(t => t.done)
    }
    if (filter.value === 'active') {
      return todos.value.filter(t => !t.done)
    }
    return todos.value
  })

  // FETCH (GET)
  async function fetchTodosFromServer() {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetch(`${API_BASE}/todos`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      todos.value = await response.json()

    } catch (err) {
      error.value = 'Kunne ikke laste todos'
      console.error('Klarte ikke å hente todos', err)
    } finally {
      isLoading.value = false
    }
  }

  // CREATE (POST)
  async function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          done: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newTodo = await response.json()
      todos.value.push(newTodo)

    } catch (err) {
      error.value = 'Kunne ikke opprette todo'
      console.error(err)
    }
  }

  // UPDATE (PUT/PATCH)
  async function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          done: !todo.done,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update local state
      todo.done = !todo.done

    } catch (err) {
      error.value = 'Kunne ikke oppdatere todo'
      console.error(err)
    }
  }

  // DELETE
  async function removeTodo(id: number) {
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      todos.value = todos.value.filter(t => t.id !== id)

    } catch (err) {
      error.value = 'Kunne ikke slette todo'
      console.error(err)
    }
  }

  function setFilter(newFilter: 'all' | 'done' | 'active') {
    filter.value = newFilter
  }

  return {
    todos,
    isLoading,
    error,
    filter,
    filteredTodos,
    fetchTodosFromServer,
    addTodo,
    toggleTodo,
    removeTodo,
    setFilter,
  }
})
```

---

## Testing with JSONPlaceholder

Want to test right now? Replace your store with this:

```typescript
async function fetchTodosFromServer() {
  try {
    isLoading.value = true

    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    todos.value = data.map((item: any) => ({
      id: item.id,
      text: item.title,
      done: item.completed,
    }))

  } catch (error) {
    console.error('Klarte ikke å hente todos', error)
  } finally {
    isLoading.value = false
  }
}
```

This will fetch real todos from a free API!

---

## Key Takeaways

1. **`fetch()` is built-in** - No dependencies needed
2. **Always check `response.ok`** - Fetch doesn't throw on 4xx/5xx
3. **Use try-catch-finally** - Handles errors gracefully
4. **Set loading states** - Give users feedback
5. **Map API data** - Transform to your interface shape
6. **Axios is easier** - But adds a dependency
7. **Use environment variables** - For API URLs
8. **Add error state** - Show helpful messages to users
