<template>
  <div class="container">
    <div class="search-section">
      <search-field
        v-model="searchQuery"
        placeholder="Search recipes..."
        @submit="handleSearch"
      />
      <select v-model="selectedCategory" class="category-select">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else>
      <h3 v-if="searchResults.length">
        Search Results ({{ searchResults.length }})
      </h3>
      <div v-if="searchResults.length" class="results-grid">
        <recipe-card
          v-for="recipe in searchResults"
          :key="recipe.recipeId"
          :recipe="recipe"
        />
      </div>
      <div v-else-if="hasSearched" class="no-results">
        No recipes found for your search criteria
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jsonApi } from '@/services/api'
import SearchField from '@/components/SearchField.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const route = useRoute()
const router = useRouter()

const categories = [
  'Main Course',
  'Vegan',
  'Italian',
  'Asian',
  'Soup',
  'Salad',
  'Dessert',
  'Breakfast',
  'Seafood',
  'Appetizer'
]

const searchQuery = ref('')
const selectedCategory = ref('')
const searchResults = ref([])
const loading = ref(false)
const error = ref(null)
const hasSearched = ref(false)

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
    selectedCategory.value = route.query.category || ''
    performSearch()
  }
})

const handleSearch = () => {
  const query = {
    q: searchQuery.value,
    ...(selectedCategory.value && { category: selectedCategory.value })
  }
  
  router.push({ path: '/search', query })
  performSearch()
}

const performSearch = async () => {
  if (!searchQuery.value) return

  loading.value = true
  error.value = null
  hasSearched.value = true

  try {
    const params = new URLSearchParams({
      keyword: searchQuery.value,
      ...(selectedCategory.value && { category: selectedCategory.value })
    })

    const response = await jsonApi.get(`/api/recipes/search?${params}`)
    searchResults.value = response.data
  } catch (err) {
    error.value = 'Failed to fetch search results'
    console.error('Search error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-section {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.category-select {
  min-width: 150px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.loading, .error, .no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: red;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>
