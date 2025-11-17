# Visual Guide: Async API Call Flow

## Timeline of `fetchTodosFromServer()`

```
User opens page
     │
     ▼
Component: onMounted() runs
     │
     ▼
Store: fetchTodosFromServer() called
     │
     ├─────────────────────────────────────────────┐
     │  TRY BLOCK                                  │
     │                                             │
     │  Step 1: isLoading.value = true             │
     │          ↓                                  │
     │  UI shows: "Laster..."                      │
     │                                             │
     │  Step 2: const response = await fakeApiCall()│
     │          ↓                                  │
     │          ⏳ WAITS HERE (600ms)              │
     │          Network request in progress...     │
     │          JavaScript execution PAUSED        │
     │          ↓                                  │
     │          ✅ Promise resolves                │
     │                                             │
     │  Step 3: todos.value = response             │
     │          ↓                                  │
     │  UI updates: Shows todo list                │
     │                                             │
     └─────────────────────────────────────────────┘
     │
     ▼
FINALLY BLOCK (always runs)
     │
     └─→ isLoading.value = false
         ↓
         UI removes: "Laster..."
         ↓
         ✅ DONE
```

---

## Error Scenario Timeline

```
User opens page (but network is down)
     │
     ▼
Component: onMounted() runs
     │
     ▼
Store: fetchTodosFromServer() called
     │
     ├─────────────────────────────────────────────┐
     │  TRY BLOCK                                  │
     │                                             │
     │  Step 1: isLoading.value = true             │
     │          ↓                                  │
     │  UI shows: "Laster..."                      │
     │                                             │
     │  Step 2: const response = await fetch(...)  │
     │          ↓                                  │
     │          ⏳ WAITS HERE                      │
     │          Network request...                 │
     │          ↓                                  │
     │          ❌ Network Error!                  │
     │          JavaScript THROWS error            │
     │                                             │
     │  Step 3: SKIPPED (error occurred)           │
     │                                             │
     └─────────────────────────────────────────────┘
     │
     ├─────────────────────────────────────────────┐
     │  CATCH BLOCK (runs because of error)        │
     │                                             │
     │  console.error('Klarte ikke...', error)     │
     │  UI could show: "Kunne ikke laste todos"    │
     │                                             │
     └─────────────────────────────────────────────┘
     │
     ▼
FINALLY BLOCK (still runs!)
     │
     └─→ isLoading.value = false
         ↓
         UI removes: "Laster..."
         ↓
         Shows error message instead
         ↓
         ✅ DONE (gracefully handled error)
```

---

## Comparing: Fake API vs Real API

### Fake API (Current)

```
fetchTodosFromServer() called
     │
     ├─→ isLoading = true
     │   UI: "Laster..."
     │
     ├─→ await fakeApiCall()
     │   │
     │   ├─→ new Promise(...)
     │   │   setTimeout 600ms
     │   │   ⏳ Wait... (browser timer)
     │   │   resolve([...todos])
     │   │
     │   └─→ Returns: [{ id: 1, ... }, { id: 2, ... }]
     │
     ├─→ todos.value = response
     │   UI: Shows 2 todos
     │
     └─→ finally: isLoading = false
         UI: Hides "Laster..."
```

**Total time: ~600ms (predictable)**

---

### Real API (With fetch)

```
fetchTodosFromServer() called
     │
     ├─→ isLoading = true
     │   UI: "Laster..."
     │
     ├─→ await fetch('https://api.example.com/todos')
     │   │
     │   ├─→ DNS lookup (find server IP)
     │   │   ⏳ 10-100ms
     │   │
     │   ├─→ TCP connection (establish connection)
     │   │   ⏳ 20-200ms
     │   │
     │   ├─→ TLS handshake (if HTTPS)
     │   │   ⏳ 50-300ms
     │   │
     │   ├─→ HTTP request sent
     │   │   ⏳ Network latency
     │   │
     │   ├─→ Server processes request
     │   │   ⏳ 50-500ms (depends on server)
     │   │
     │   ├─→ HTTP response received
     │   │   ⏳ Network latency
     │   │
     │   └─→ Returns: Response object
     │
     ├─→ response.ok? Check status code
     │   ├─→ 200-299: ✅ Continue
     │   └─→ 400-599: ❌ Throw error → CATCH block
     │
     ├─→ await response.json()
     │   Parse JSON string to JavaScript object
     │   ⏳ 1-50ms
     │
     ├─→ todos.value = response
     │   UI: Shows todos (could be 10, 100, 1000...)
     │
     └─→ finally: isLoading = false
         UI: Hides "Laster..."
```

**Total time: ~100ms to 5+ seconds (variable)**
- Depends on: network speed, server location, server load
- Much more can go wrong: network down, server down, timeout, etc.

---

## State Changes Over Time

### Visual Representation

```
TIME →  0ms    100ms   600ms   700ms
        │      │       │       │
isLoading:
        false→ true ·········· false

UI:
        [Normal]→[Laster...]···[Shows todos]

todos.value:
        []  →  [] ············ [{...}, {...}]
```

### With Error

```
TIME →  0ms    100ms   1000ms  1100ms
        │      │       │       │
isLoading:
        false→ true ·········· false

error:
        null → null → 'Kunne ikke...' (stays)

UI:
        [Normal]→[Laster...]···[Error message + Retry button]

todos.value:
        []  →  [] ············ [] (empty - error occurred)
```

---

## JavaScript Execution: Sync vs Async

### Synchronous Code (Blocking)

```javascript
console.log('1')
const result = doSlowWork()  // 🔒 BLOCKS - waits here
console.log('2')
console.log(result)

// Output:
// 1
// (waits 5 seconds)
// 2
// result value
```

Everything stops until `doSlowWork()` finishes. Browser freezes. ❌

---

### Asynchronous Code (Non-Blocking)

```javascript
console.log('1')
doSlowWorkAsync().then(result => {
  console.log(result)
})
console.log('2')

// Output:
// 1
// 2
// (5 seconds later)
// result value
```

Code continues while waiting. Browser stays responsive. ✅

---

### Async/Await (Best of Both)

```javascript
async function main() {
  console.log('1')
  const result = await doSlowWorkAsync()  // ⏸️ Looks like it blocks...
  console.log('2')
  console.log(result)
}

main()
console.log('3')

// Output:
// 1
// 3  ← this runs while waiting!
// (5 seconds later)
// 2
// result value
```

Inside `main()`, code reads top-to-bottom. Outside `main()`, other code runs! ✅

---

## Real-World Example: Multiple API Calls

### Sequential (Slow)

```typescript
async function loadDashboard() {
  try {
    isLoading.value = true

    // Wait for user (300ms)
    const user = await fetchUser()

    // THEN wait for todos (500ms)
    const todos = await fetchTodos(user.id)

    // THEN wait for stats (200ms)
    const stats = await fetchStats(user.id)

    // Total time: 300 + 500 + 200 = 1000ms

  } finally {
    isLoading.value = false
  }
}
```

**Timeline:**
```
0ms    300ms       800ms        1000ms
│      │           │            │
├─fetch user────┐  │            │
                └─fetch todos──┐│
                               └─fetch stats─┐
                                             │
Total: 1000ms                                ✓
```

---

### Parallel (Fast)

```typescript
async function loadDashboard() {
  try {
    isLoading.value = true

    // Start ALL requests at the same time
    const [user, todos, stats] = await Promise.all([
      fetchUser(),           // 300ms
      fetchTodos(userId),    // 500ms (longest)
      fetchStats(userId),    // 200ms
    ])

    // Total time: 500ms (longest request)

  } finally {
    isLoading.value = false
  }
}
```

**Timeline:**
```
0ms    300ms   500ms
│      │       │
├─fetch user──┐│
├─fetch todos─┼┴───┐
├─fetch stats┐│    │
             └┘    ✓
Total: 500ms (50% faster!)
```

---

## Common Pitfalls

### ❌ Forgetting `await`

```typescript
async function fetchTodos() {
  isLoading.value = true

  const response = fetch('...')  // ❌ Missing await!
  // response is a Promise, not the data!

  todos.value = response  // ❌ Wrong type!
  isLoading.value = false
}
```

**Fix:** Add `await`
```typescript
const response = await fetch('...')  // ✅
```

---

### ❌ Not handling errors

```typescript
async function fetchTodos() {
  isLoading.value = true
  const response = await fetch('...')  // Could throw!
  todos.value = response
  isLoading.value = false  // Never runs if error!
}
```

**Fix:** Use try-catch-finally
```typescript
async function fetchTodos() {
  try {
    isLoading.value = true
    const response = await fetch('...')
    todos.value = response
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false  // Always runs!
  }
}
```

---

### ❌ Forgetting to check response.ok

```typescript
async function fetchTodos() {
  const response = await fetch('...')
  // Status could be 404, 500, etc!
  const data = await response.json()  // ❌ Could be error HTML!
  todos.value = data
}
```

**Fix:** Check status
```typescript
const response = await fetch('...')
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}
const data = await response.json()  // ✅ Safe now
```

---

## Key Concepts Summary

| Concept | What It Does | Why It Matters |
|---------|-------------|----------------|
| `async` | Makes function return Promise | Can use `await` inside |
| `await` | Pauses until Promise resolves | Looks synchronous, actually async |
| `try` | Normal code path | Runs when everything works |
| `catch` | Error handling | Runs when something throws |
| `finally` | Cleanup code | **Always** runs (success or error) |
| `isLoading` | Boolean state | Shows "Laster..." to user |
| `Promise` | Represents future value | Allows async programming |
| `fetch()` | Browser API for HTTP | Built-in, no dependencies |
| `response.ok` | Status 200-299? | Fetch doesn't auto-throw on errors |
| `.json()` | Parse JSON response | Also async! Need await |

---

## Practice Exercise

Try modifying the store to add a "retry" mechanism:

```typescript
const maxRetries = 3

async function fetchTodosFromServer() {
  let retries = 0

  while (retries < maxRetries) {
    try {
      isLoading.value = true
      const response = await fetch('...')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      todos.value = await response.json()
      return  // Success! Exit function

    } catch (error) {
      retries++
      console.log(`Attempt ${retries} failed, retrying...`)

      if (retries >= maxRetries) {
        error.value = 'Kunne ikke laste todos etter 3 forsøk'
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries))

    } finally {
      isLoading.value = false
    }
  }
}
```

This demonstrates:
- ✅ Retry logic
- ✅ Exponential backoff
- ✅ While loops with async
- ✅ Early returns
- ✅ Multiple awaits

Good luck learning async patterns!
