<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Meny</h1>
    <nav style="margin-bottom: 1rem">
      <RouterLink :to="{name: 'menu'}">Meny</RouterLink>
      |
      <RouterLink :to="{name: 'add-category'}">Ny kategori</RouterLink>
      |
      <RouterLink :to="{name: 'add-menu-item'}">Ny menyartikkel</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>


<style scoped></style>
