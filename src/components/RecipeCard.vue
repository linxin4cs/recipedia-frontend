<template>
  <div class="recipe-card" @click="() => router.push(`/recipes/${recipe.recipeId}`)">
    <h3 class="recipe-title">{{ recipe.title }}</h3>
    <div class="recipe-info">
      <span class="recipe-category">{{ recipe.category }}</span>
      <span class="recipe-rating">{{ recipe.averageRating.toFixed(1) }}</span>
    </div>
    <p class="recipe-description">{{ recipe.description }}</p>
    <div class="recipe-author">
      <span>{{ recipe.author.username }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  recipe: {
    type: Object,
    required: true,
    default: () => ({
      recipeId: 0,
      title: '',
      description: '',
      category: '',
      viewCount: 0,
      ingredients: [''],
      instructions: '',
      creationDate: '2025-01-01',
      author: {
        userId: 0,
        username: '',
        email: null,
        bio: null,
      },
      averageRating: 0.0,
      isRated: null,
    }),
  },
})
</script>

<style scoped>
.recipe-card {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.recipe-card:hover {
  background-color: #f9f9f9;
}

.recipe-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 12px 0;
}

.recipe-info {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.recipe-category {
  color: #666;
  font-size: 14px;
  border: 1px solid #666;
  padding: 4px 8px;
  border-radius: 4px;
}

.recipe-rating {
  font-size: 14px;
  color: #f57c00;
}

.recipe-description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.recipe-author {
  color: #888;
  font-size: 14px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
</style>
