<template>
  <div class="container">
    <h2>Trendy Recipes</h2>

    <div v-if="recipeStore.loading" class="loading">
      Loading...
    </div>

    <div v-else-if="recipeStore.error" class="error">
      {{ recipeStore.error }}
    </div>

    <div v-else class="item-grid">
      <recipe-card
        v-for="recipe in recipeStore.trendyRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRecipeStore } from '@/stores/recipes'
import RecipeCard from '@/components/RecipeCard.vue'

const recipeStore = useRecipeStore()

onMounted(async () => {
  await recipeStore.fetchTrendyRecipes()
})
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
