<template>
  <div class="recipe-card">
    <h3>{{ recipe.title }}</h3>
    <rating-stars :value="recipe.rating" />
    <p>{{ recipe.description }}</p>
    <div class="recipe-footer">
      <base-button @click="$router.push(`/recipe/${recipe.id}`)">
        View Recipe
      </base-button>
    </div>
  </div>
</template>

<script setup>
import RatingStars from './RatingStars.vue'
import BaseButton from './BaseButton.vue'

defineProps({
  recipe: {
    type: Object,
    required: true,
    validator: (recipe) => {
      return ['id', 'title', 'rating', 'description'].every(key => key in recipe)
    }
  }
})
</script>

<style scoped>
.recipe-card {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.recipe-footer {
  margin-top: 15px;
}
</style>