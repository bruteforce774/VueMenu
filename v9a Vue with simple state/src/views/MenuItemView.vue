<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "../stores/appStore";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const appStore = useAppStore();

const menuItemId = computed(() => parseInt(props.id));
const menuItem = computed(() => appStore.state.menuItems.find(mi => mi.id === menuItemId.value));

function handleBackClick() {
  router.push({ name: "menu" });
}
</script>


<template>
  <section v-if="menuItem">
    <h3>{{ menuItem.name }}</h3>
    <div>
      <p>Pris: {{ menuItem.price }} kr</p>
      <p>{{ menuItem.description || "" }}</p>
      <img :src="menuItem.imageUrl || ''" :alt="menuItem.name" width="200" />
    </div>
  </section>

  <section v-else>
    <p>Fant ikke denne menyartikkelen.</p>
  </section>
  
  <button @click="handleBackClick">Tilbake til meny</button>
</template>
