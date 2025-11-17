// What happens if you try to break the type safety?

import { ref } from 'vue'

const filter = ref<'all' | 'done' | 'active'>('all')

// ========================================
// TRY THESE IN YOUR EDITOR
// ========================================

// VALID ✅
filter.value = 'all'     // ✅ Works - autocomplete suggests this
filter.value = 'done'    // ✅ Works
filter.value = 'active'  // ✅ Works

// INVALID ❌ - TypeScript will underline these in RED
// filter.value = 'completed'   // ❌ Error: Type '"completed"' is not assignable to type '"all" | "done" | "active"'
// filter.value = 'All'         // ❌ Error: Case sensitive! 'All' !== 'all'
// filter.value = 'DONE'        // ❌ Error: Must be lowercase 'done'
// filter.value = 'pending'     // ❌ Error: Not in the union
// filter.value = ''            // ❌ Error: Empty string not allowed
// filter.value = null          // ❌ Error: null not in the union
// filter.value = undefined     // ❌ Error: undefined not in the union
// filter.value = 1             // ❌ Error: Number not allowed - must be string literal


// ========================================
// AUTOCOMPLETE IN ACTION
// ========================================

// When you type:
filter.value = '
//             ^
// Your editor shows a dropdown with ONLY:
//   'all'
//   'done'
//   'active'
//
// Try it! Type filter.value = ' and wait for autocomplete


// ========================================
// FUNCTION PARAMETERS
// ========================================

function setFilter(newFilter: 'all' | 'done' | 'active') {
  filter.value = newFilter
}

// VALID CALLS ✅
setFilter('all')      // ✅
setFilter('done')     // ✅
setFilter('active')   // ✅

// INVALID CALLS ❌
// setFilter('invalid')  // ❌ Argument of type '"invalid"' is not assignable to parameter of type '"all" | "done" | "active"'

// Even with variables:
const myFilter = 'all' as const  // ✅ Type is literally 'all'
setFilter(myFilter)              // ✅ Works

const badFilter = 'invalid'      // Type is 'string' (too broad)
// setFilter(badFilter)          // ❌ Error: string is not assignable to union type


// ========================================
// COMPARISON: WITHOUT UNION TYPES
// ========================================

const filterNoType = ref('all')  // Inferred as Ref<string>

filterNoType.value = 'banana'    // ✅ TypeScript allows this!
filterNoType.value = 'anything'  // ✅ TypeScript allows this!
// Runtime bugs waiting to happen! 😱

// In the computed:
// if (filterNoType.value === 'done') {  // May never be true!
//   ...
// }


// ========================================
// REFACTORING SAFETY
// ========================================

// If you decide to rename 'done' to 'completed':

type FilterType = 'all' | 'completed' | 'active'  // Changed here
//                        ^^^^^^^^^^^

const filter2 = ref<FilterType>('all')

function setFilter2(newFilter: FilterType) {
  filter2.value = newFilter
}

// Now ALL these will show errors:
// setFilter2('done')  // ❌ Error - 'done' no longer valid
// filter2.value = 'done'  // ❌ Error

// You can use "Find All References" to update everywhere!


// ========================================
// REAL EXAMPLE: API RESPONSE
// ========================================

// Without type safety:
async function fetchFilterFromAPI() {
  const response = await fetch('/api/filter')
  const data = await response.json()
  // filter.value = data.filter  // ❌ Dangerous! What if API returns 'banana'?

  // Better - runtime validation:
  const apiFilter = data.filter
  if (apiFilter === 'all' || apiFilter === 'done' || apiFilter === 'active') {
    filter.value = apiFilter  // ✅ Safe
  } else {
    console.error('Invalid filter from API:', apiFilter)
    filter.value = 'all'  // Fallback to default
  }
}


// ========================================
// TYPE GUARD FUNCTION
// ========================================

function isValidFilter(value: string): value is 'all' | 'done' | 'active' {
  return value === 'all' || value === 'done' || value === 'active'
}

// Usage:
const userInput = 'done'  // Imagine this came from user input

if (isValidFilter(userInput)) {
  filter.value = userInput  // ✅ TypeScript knows it's safe now!
} else {
  console.error('Invalid filter value')
}


// ========================================
// SUMMARY
// ========================================

/*
Union types with string literals give you:

1. ✅ Compile-time type checking
2. ✅ Autocomplete in your editor
3. ✅ Refactoring safety
4. ✅ Self-documenting code
5. ✅ Catches typos before runtime
6. ✅ No magic strings floating around

Without them:
1. ❌ Typos cause runtime bugs
2. ❌ No autocomplete
3. ❌ Hard to refactor
4. ❌ Need to read docs to know valid values
5. ❌ Need runtime validation everywhere
*/
