<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

const newTodoText = ref('')

function add() {
  todoStore.addTodo(newTodoText.value)
  newTodoText.value = ''
}

onMounted(() => {
  // Hent startdata fra "server"
  todoStore.fetchTodosFromServer()
})
</script>

<template>
  <section>
    <h1>Todos</h1>

    <div>
      <input
        v-model="newTodoText"
        placeholder="Ny todo"
        @keyup.enter="add"
      />
      <button @click="add">Legg til</button>
    </div>

    <div>
      <span>Totalt: {{ todoStore.totalCount }}</span>
      <span> | Ferdig: {{ todoStore.doneCount }}</span>
      <span> | Aktive: {{ todoStore.activeCount }}</span>
      <span v-if="todoStore.allDone"> – alle er ferdige! 🎉</span>
    </div>

    <div>
      Filter:
      <button @click="todoStore.setFilter('all')">Alle</button>
      <button @click="todoStore.setFilter('active')">Aktive</button>
      <button @click="todoStore.setFilter('done')">Ferdige</button>
    </div>

    <div v-if="todoStore.isLoading">Laster...</div>

    <ul>
      <li
        v-for="todo in todoStore.filteredTodos"
        :key="todo.id"
      >
        <label>
          <input
            type="checkbox"
            :checked="todo.done"
            @change="todoStore.toggleTodo(todo.id)"
          />
          <span :style="{ textDecoration: todo.done ? 'line-through' : 'none' }">
            {{ todo.text }}
          </span>
        </label>
        <button @click="todoStore.removeTodo(todo.id)">X</button>
      </li>
    </ul>

    <button @click="todoStore.clearDone">
      Fjern ferdige
    </button>
    <button @click="todoStore.markAllDone">
      Marker alle som ferdige
    </button>
  </section>
</template>
