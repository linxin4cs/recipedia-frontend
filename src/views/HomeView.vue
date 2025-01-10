<template>
  <div class="container">
    <h2>Welcome to Recipedia</h2>
    <search-field
      v-model="searchQuery"
      placeholder="Search recipes..."
      @submit="handleSearch"
    />
    <base-button @click="$router.push('/create')">
      Create New Recipe
    </base-button>

<!--    <div class="featured-recipes" v-if="featuredRecipes.length">-->
<!--      <h3>Featured Recipes</h3>-->
<!--      <div class="item-grid">-->
<!--        <recipe-card-->
<!--          v-for="recipe in featuredRecipes"-->
<!--          :key="recipe.id"-->
<!--          :recipe="recipe"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchField from '@/components/SearchField.vue'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const router = useRouter()
const searchQuery = ref('')
const featuredRecipes = ref([
  {
    id: 1,
    title: 'Featured Recipe 1',
    rating: 5,
    description: 'A delicious featured recipe'
  }
])

const handleSearch = () => {
  router.push({
    path: '/search',
    query: { q: searchQuery.value }
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

.featured-recipes {
  margin-top: 40px;
}
</style>
