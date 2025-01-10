<template>
  <div class="container">
    <h2>Welcome to Recipedia</h2>
    <search-field v-model="searchQuery" placeholder="Search recipes..." @submit="handleSearch" />

    <div v-if="isLoading" class="loading">Loading...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div class="latest-recipes" v-if="latestRecipes.length">
      <h3>Latest Recipes</h3>
      <div class="item-grid">
        <recipe-card v-for="recipe in latestRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchField from '@/components/common/SearchField.vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'

onMounted(() => {
  fetchLatestRecipes()
})

const isLoading = ref(true)
const error = ref(null)

const latestRecipes = ref([])

const router = useRouter()
const searchQuery = ref('')

const fetchLatestRecipes = async () => {
  try {
    const response = await fetch('/api/recipes/recent')
    latestRecipes.value = await response.json()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  router.push({
    path: '/search',
    query: { q: searchQuery.value },
  })
}
</script>

<style scoped>
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.latest-recipes {
  margin-top: 40px;
}
</style>
