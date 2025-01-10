<template>
  <div class="container">
    <h2>Trendy Recipes</h2>

    <div v-if="isLoading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="item-grid">
      <recipe-card
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script setup>
import RecipeCard from '@/components/RecipeCard.vue'
import {onMounted, ref} from "vue";


onMounted(() => {
  fetchRecipes()
})

const recipes = ref([])
const isLoading = ref(true)
const error = ref(null)

const fetchRecipes = async () => {
  try {
    const response = await fetch('/api/recipes/popular')
    recipes.value = await response.json()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}


</script>

<style scoped>
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}
</style>
