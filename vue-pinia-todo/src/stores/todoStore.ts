// stores/todoStore.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Todo {
  id: number
  text: string
  done: boolean
}

export const useTodoStore = defineStore('todos', () => {
  // ---------- STATE (reaktive variabler) ----------
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const filter = ref<'all' | 'done' | 'active'>('all')

  // ---------- GETTERS / COMPUTED ----------
  const filteredTodos = computed(() => {
    if (filter.value === 'done') {
      return todos.value.filter(t => t.done)
    }
    if (filter.value === 'active') {
      return todos.value.filter(t => !t.done)
    }
    return todos.value
  })

  const totalCount = computed(() => todos.value.length)

  const doneCount = computed(() =>
    todos.value.filter(t => t.done).length
  )

  const activeCount = computed(() =>
    todos.value.filter(t => !t.done).length
  )

  // Eksempel på computed som avhenger av andre computed
  const allDone = computed(() => activeCount.value === 0 && totalCount.value > 0)

  // ---------- ACTIONS ----------
  function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    todos.value.push({
      id: Date.now(),
      text: trimmed,
      done: false,
    })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return
    todo.done = !todo.done
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  function clearDone() {
    todos.value = todos.value.filter(t => !t.done)
  }

  function setFilter(newFilter: 'all' | 'done' | 'active') {
    filter.value = newFilter
  }

  function markAllDone() {
    todos.value = todos.value.map(t => ({ ...t, done: true }))
  }

  // Asynkron action – typisk for API-kall
  async function fetchTodosFromServer() {
    try {
      isLoading.value = true

      // Fiktivt API-kall – bytt ut med ekte
      const response = await fakeApiCall()

      todos.value = response
    } catch (error) {
      console.error('Klarte ikke å hente todos', error)
    } finally {
      isLoading.value = false
    }
  }

  // Returnerer ting som skal være tilgjengelig utenfra
  return {
    // state
    todos,
    isLoading,
    filter,
    // getters
    filteredTodos,
    totalCount,
    doneCount,
    activeCount,
    allDone,
    // actions
    addTodo,
    toggleTodo,
    removeTodo,
    clearDone,
    setFilter,
    markAllDone,
    fetchTodosFromServer,
  }
})

// En enkel fake-api-funksjon for demo
async function fakeApiCall(): Promise<Todo[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'Kjøp melk', done: false },
        { id: 2, text: 'Lær Pinia', done: true },
      ])
    }, 600)
  })
}
