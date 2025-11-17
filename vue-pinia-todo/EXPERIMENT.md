# Hands-On Experiment: Union Types in Pinia

## Experiment 1: Break the Type Safety (See the Error)

Open `src/components/TodoApp.vue` and try changing line 42:

```vue
<!-- BEFORE (line 42) -->
<button @click="todoStore.setFilter('all')">Alle</button>

<!-- TRY THIS - TypeScript will show an error! -->
<button @click="todoStore.setFilter('alll')">Alle</button>
                                    ^^^^^^
                                    Typo - 4 L's instead of 2!
```

**What you'll see:**
- Red squiggly line under `'alll'` in your editor
- Error message: `Argument of type '"alll"' is not assignable to parameter of type '"all" | "done" | "active"'`

This is TypeScript **preventing a bug before you even run the code**!


## Experiment 2: Test Autocomplete

Open `src/components/TodoApp.vue` line 42 and:

1. Delete `'all'` so you have:
   ```vue
   <button @click="todoStore.setFilter()">Alle</button>
   ```

2. Type a quote inside the parentheses:
   ```vue
   <button @click="todoStore.setFilter('█)">
                                        ^
                                        cursor here
   ```

3. Press `Ctrl+Space` (or `Cmd+Space` on Mac)

**What you'll see:**
A dropdown showing ONLY these options:
- `'all'`
- `'done'`
- `'active'`

This is autocomplete powered by the union type!


## Experiment 3: Add a New Filter Value

Let's add a new filter option: `'important'`

### Step 1: Update the type in the store

Open `src/stores/todoStore.ts` and change line 15:

```typescript
// BEFORE
const filter = ref<'all' | 'done' | 'active'>('all')

// AFTER - add 'important'
const filter = ref<'all' | 'done' | 'active' | 'important'>('all')
```

### Step 2: Update the setFilter function signature

Line 67:

```typescript
// BEFORE
function setFilter(newFilter: 'all' | 'done' | 'active') {

// AFTER
function setFilter(newFilter: 'all' | 'done' | 'active' | 'important') {
```

### Step 3: Update the computed filter logic

Add a new case in the `filteredTodos` computed (line 18):

```typescript
const filteredTodos = computed(() => {
  if (filter.value === 'done') {
    return todos.value.filter(t => t.done)
  }
  if (filter.value === 'active') {
    return todos.value.filter(t => !t.done)
  }
  if (filter.value === 'important') {
    // Filter todos with "!" in the text as "important"
    return todos.value.filter(t => t.text.includes('!'))
  }
  return todos.value
})
```

### Step 4: Add a button in the component

Open `src/components/TodoApp.vue` and add a button (around line 44):

```vue
<div>
  Filter:
  <button @click="todoStore.setFilter('all')">Alle</button>
  <button @click="todoStore.setFilter('active')">Aktive</button>
  <button @click="todoStore.setFilter('done')">Ferdige</button>
  <button @click="todoStore.setFilter('important')">Viktige</button>
</div>
```

### Step 5: Test it!

```bash
npm run dev
```

1. Add a todo like "Kjøp melk!" (with exclamation mark)
2. Add a normal todo like "Les bok"
3. Click the "Viktige" button
4. Only todos with "!" should show!


## Experiment 4: Use a Type Alias (Better Practice)

Instead of repeating the union type, extract it:

### In `src/stores/todoStore.ts` at the top:

```typescript
// Add after the Todo interface (around line 10)
export type FilterType = 'all' | 'done' | 'active'
```

### Then use it throughout:

```typescript
// Line 15
const filter = ref<FilterType>('all')

// Line 67
function setFilter(newFilter: FilterType) {
  filter.value = newFilter
}
```

**Benefits:**
- ✅ Define the type once, use everywhere
- ✅ Change in one place updates everywhere
- ✅ Export it so other files can use it
- ✅ Less repetition = fewer bugs


## Experiment 5: See Runtime Validation

Let's add a URL parameter to set the initial filter:

### In `src/components/TodoApp.vue`:

```typescript
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

  // NEW: Read filter from URL
  const urlParams = new URLSearchParams(window.location.search)
  const filterParam = urlParams.get('filter')

  // Runtime validation needed! URL params are always strings
  if (filterParam === 'all' || filterParam === 'done' || filterParam === 'active') {
    todoStore.setFilter(filterParam)  // ✅ TypeScript happy
  } else if (filterParam) {
    console.warn('Invalid filter in URL:', filterParam)
  }
})
</script>
```

### Test it:

1. Run the app: `npm run dev`
2. Visit: `http://localhost:5173/?filter=done`
3. The filter should be pre-set to "Ferdige"!
4. Try: `http://localhost:5173/?filter=invalid`
5. Check console - you'll see the warning


## Key Takeaways

1. **Union types = compile-time safety**
   - Catches typos before running

2. **Autocomplete = developer experience**
   - Your editor knows valid values

3. **Type guards for runtime**
   - Still need validation for external data (APIs, URLs, user input)

4. **Type aliases = maintainability**
   - Define once, use everywhere

5. **String literals vs enums**
   - Simpler syntax, easier to serialize
   - Works great for small sets of values
