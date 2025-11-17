<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";

const props = defineProps<{
  category?: string;
}>();

const router = useRouter();
const appStore = useAppStore();

const categories = computed(() => appStore.state.categories);

const selectedCategory = computed(() => props.category ?? null);

const menuItemsInCategory = computed(() => {
  if (!selectedCategory.value) return [];
  return appStore.state.menuItems.filter(
    (mi) => mi.category === selectedCategory.value
  );
});

function handleCategoryClick(category: string) {
  router.push({ name: "menu-category", params: { category } });
}

function handleMenuItemClick(id: number) {
  router.push({ name: "menu-item", params: { id } });
}
</script>


<template>
  <section>
    <h3>Kategorier</h3>
    <div id="categories">
      <button
        v-for="category in categories"
        :key="category"
        :disabled="category === selectedCategory"
        @click="handleCategoryClick(category)"
      >
        {{ category }}
      </button>
    </div>

    <h3>
      Produkter
      <span v-if="selectedCategory">
        i kategorien {{ selectedCategory }}
      </span>
    </h3>

    <div id="menu-items">
      <i v-if="!selectedCategory">
        Velg en kategori for å se menyen.
      </i>

      <i v-else-if="menuItemsInCategory.length === 0">
        Ingen menyartikler i denne kategorien.
      </i>

      <div
        v-else
        v-for="menuItem in menuItemsInCategory"
        :key="menuItem.id"
      >
        {{ menuItem.name }} - {{ menuItem.price }} kr
        <button @click="handleMenuItemClick(menuItem.id)">
          Se detaljer
        </button>
      </div>
    </div>
  </section>
</template>
