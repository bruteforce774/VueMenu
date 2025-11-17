// Type Safety Demo - Understanding Union Types in Pinia

import { ref } from 'vue'

// ========================================
// EXAMPLE 1: Without Type Safety (BAD)
// ========================================
const filterBad = ref('all')  // TypeScript infers type as string

// These would all be ALLOWED (but might break your app):
// filterBad.value = 'completed'  // Typo! Should be 'done'
// filterBad.value = 'All'        // Wrong case!
// filterBad.value = 'banana'     // Nonsense value
// filterBad.value = ''           // Empty string

// No TypeScript error, but runtime bugs! 😱


// ========================================
// EXAMPLE 2: With Type Safety (GOOD)
// ========================================
const filter = ref<'all' | 'done' | 'active'>('all')

// These are ALLOWED:
filter.value = 'done'     // ✅ Valid
filter.value = 'active'   // ✅ Valid
filter.value = 'all'      // ✅ Valid

// These will give TypeScript ERRORS:
// filter.value = 'completed'  // ❌ Type '"completed"' is not assignable to type '"all" | "done" | "active"'
// filter.value = 'All'        // ❌ Case matters!
// filter.value = 'banana'     // ❌ Not in the union
// filter.value = ''           // ❌ Empty string not allowed


// ========================================
// EXAMPLE 3: In a Function
// ========================================
function setFilter(newFilter: 'all' | 'done' | 'active') {
  filter.value = newFilter  // ✅ Type-safe assignment
}

setFilter('done')     // ✅ Works
// setFilter('invalid')  // ❌ TypeScript error at compile time!


// ========================================
// EXAMPLE 4: Type Alias (Reusable)
// ========================================
type FilterType = 'all' | 'done' | 'active'

const filter2 = ref<FilterType>('all')
const filter3 = ref<FilterType>('done')

function setMultipleFilters(f1: FilterType, f2: FilterType) {
  filter2.value = f1
  filter3.value = f2
}


// ========================================
// EXAMPLE 5: In the Todo Store Context
// ========================================

// This is how it's used in todoStore.ts:
function setFilter(newFilter: 'all' | 'done' | 'active') {
  filter.value = newFilter
}

// And in the component (TodoApp.vue):
// <button @click="todoStore.setFilter('all')">Alle</button>
// <button @click="todoStore.setFilter('active')">Aktive</button>
// <button @click="todoStore.setFilter('done')">Ferdige</button>

// If you typo in the component:
// <button @click="todoStore.setFilter('alll')">Alle</button>
//                                      ^^^^^
// TypeScript will show an error in your editor BEFORE you even run the code!


// ========================================
// EXAMPLE 6: Autocomplete Benefits
// ========================================

// When you type:
// todoStore.setFilter('
//                     ^
// Your IDE will show you ONLY these three options:
//   - 'all'
//   - 'done'
//   - 'active'
//
// No guessing, no looking at docs!


// ========================================
// EXAMPLE 7: Comparison with Enum
// ========================================

// You could also use an enum (more verbose):
enum FilterEnum {
  All = 'all',
  Done = 'done',
  Active = 'active'
}

const filterWithEnum = ref<FilterEnum>(FilterEnum.All)
filterWithEnum.value = FilterEnum.Done  // ✅ Works

// Union types are simpler for this use case:
// - No need to import the enum
// - Values are just strings (easier serialization)
// - Shorter syntax


// ========================================
// REAL-WORLD BENEFITS
// ========================================

// 1. Catch bugs at compile time, not runtime
// 2. Autocomplete in your editor
// 3. Refactoring safety - rename 'done' to 'completed' everywhere
// 4. Self-documenting code - you see valid values immediately
// 5. No need for runtime validation in most cases
