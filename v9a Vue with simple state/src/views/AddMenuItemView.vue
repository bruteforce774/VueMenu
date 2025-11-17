<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";
import type { MenuItem } from "../types"; 

const router = useRouter();
const appStore = useAppStore();

const category = ref("");
const name = ref("");
const price = ref<string>("");
const description = ref("");
const imageUrl = ref("");

function handleAddClick() {
  if (!name.value || !category.value || !price.value) {
    return;
  }

  const menuItem: MenuItem = {
    id: 0,
    name: name.value,
    price: parseFloat(price.value),
    category: category.value,
    description: description.value || undefined,
    imageUrl: imageUrl.value || undefined,
  };

  appStore.addMenuItem(menuItem);

  router.push({ name: "menu-item", params: { id: menuItem.id } });

  category.value = "";
  name.value = "";
  price.value = "";
  description.value = "";
  imageUrl.value = "";
}
</script>

<template>
  <section>
    <h3>Ny menyartikkel</h3>

    <div>
      <input
        id="category"
        type="text"
        placeholder="Kategori"
        v-model="category"
      />
    </div>

    <div>
      <input
        id="name"
        type="text"
        placeholder="Navn"
        v-model="name"
      />
    </div>

    <div>
      <input
        id="price"
        type="number"
        placeholder="Pris"
        v-model="price"
      />
    </div>

    <div>
      <input
        id="description"
        type="text"
        placeholder="Beskrivelse"
        v-model="description"
      />
    </div>

    <div>
      <input
        id="imageUrl"
        type="text"
        placeholder="Bilde-URL"
        v-model="imageUrl"
      />
    </div>

    <button @click="handleAddClick">Legg til</button>
  </section>
</template>
