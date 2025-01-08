<template>
  <div class="container">
    <div class="search-header">
      <h2>Search Results</h2>
      <div class="search-controls">
        <search-field
          v-model="searchQuery"
          placeholder="Search recipes..."
          @submit="handleSearch"
        />
        <div class="filters">
          <select v-model="sortBy">
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="date">Most Recent</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="recipeStore.loading" class="loading">
      Searching recipes...
    </div>

    <div v-else-if="recipeStore.error" class="error-message">
      {{ recipeStore.error }}
    </div>

    <div v-else>
      <div v-if="searchResults.length" class="recipe-grid">
        <recipe-card
          v-for="recipe in searchResults"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
      
      <div v-else class="no-results">
        <p>No recipes found for "{{ searchQuery }}"</p>
        <base-button @click="$router.push('/create')">
          Create New Recipe
        </base-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipeStore } from '@/stores/recipes'
import SearchField from '@/components/SearchField.vue'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const route = useRoute()
const recipeStore = useRecipeStore()

const searchQuery = ref(route.query.q || '')
const sortBy = ref('relevance')

const searchResults = computed(() => {
  let results = [...recipeStore.searchResults]
  
  switch (sortBy.value) {
    case 'rating':
      return results.sort((a, b) => b.rating - a.rating)
    case 'date':
      return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    default:
      return results
  }
})

onMounted(async () => {
  if (searchQuery.value) {
    await handleSearch()
  }
})

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  await recipeStore.searchRecipes(searchQuery.value)
}
</script>

<style scoped>
.search-header {
  margin-bottom: 30px;
}

.search-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
}

.filters {
  min-width: 150px;
}

.filters select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.no-results {
  text-align: center;
  padding: 40px;
  background-color: var(--background-color);
  border-radius: 8px;
}

.no-results p {
  margin-bottom: 20px;
  color: #666;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  color: red;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style> 