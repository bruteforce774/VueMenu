<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";

const router = useRouter();
const appStore = useAppStore();

const newCategory = ref("");

function handleAddClick() {
  const category = newCategory.value.trim();
  if (!category) return;

  appStore.addCategory(category);
  router.push({ name: "menu-category", params: { category } });

  newCategory.value = "";
}
</script>

<template>
  <section>
    <h3>Ny kategori</h3>
    <input
      type="text"
      placeholder="Kategorinavn"
      v-model="newCategory"
    />
    <button @click="handleAddClick">Legg til</button>
  </section>
</template>
