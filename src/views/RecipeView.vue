<template>
  <div class="container">
    <div v-if="recipeStore.loading" class="loading">
      Loading recipe...
    </div>

    <div v-else-if="recipeStore.error" class="error-message">
      {{ recipeStore.error }}
    </div>

    <template v-else>
      <h2>{{ recipeStore.currentRecipe.title }}</h2>
      <rating-stars :value="recipeStore.currentRecipe.rating" />
      
      <p><strong>Description:</strong> {{ recipeStore.currentRecipe.description }}</p>

      <h3>Ingredients</h3>
      <ul>
        <li v-for="(ingredient, index) in recipeStore.currentRecipe.ingredients" :key="index">
          {{ ingredient }}
        </li>
      </ul>

      <h3>Instructions</h3>
      <ol>
        <li v-for="(step, index) in recipeStore.currentRecipe.instructions" :key="index">
          {{ step }}
        </li>
      </ol>

      <div class="recipe-actions">
        <base-button 
          v-if="isOwner"
          @click="handleEdit"
        >
          Edit Recipe
        </base-button>
        <base-button 
          type="secondary" 
          @click="handleSave"
          :disabled="recipeStore.loading"
        >
          {{ isSaved ? 'Saved' : 'Save Recipe' }}
        </base-button>
      </div>

      <div class="comments-section">
        <h3>Comments</h3>
        <recipe-comments 
          :comments="recipeStore.currentRecipe.comments" 
          @add-comment="addComment" 
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipes'
import { useAuthStore } from '@/stores/auth'
import RatingStars from '@/components/RatingStars.vue'
import BaseButton from '@/components/BaseButton.vue'
import RecipeComments from '@/components/RecipeComments.vue'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const isOwner = computed(() => {
  return authStore.user?.id === recipeStore.currentRecipe?.userId
})

const isSaved = computed(() => {
  return recipeStore.userRecipes.some(recipe => recipe.id === recipeStore.currentRecipe?.id)
})

onMounted(async () => {
  await recipeStore.fetchRecipeById(route.params.id)
})

const handleEdit = () => {
  router.push(`/recipe/${recipeStore.currentRecipe.id}/edit`)
}

const handleSave = async () => {
  try {
    if (isSaved.value) {
      await recipeStore.removeFromSaved(recipeStore.currentRecipe.id)
    } else {
      await recipeStore.saveRecipe(recipeStore.currentRecipe.id)
    }
  } catch (error) {
    console.error('Failed to save recipe:', error)
  }
}

const addComment = async (comment) => {
  try {
    await recipeStore.addComment(recipeStore.currentRecipe.id, {
      ...comment,
      author: authStore.user?.username || 'Anonymous'
    })
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}
</script>

<style scoped>
.loading, .error-message {
  text-align: center;
  padding: 20px;
}

.error-message {
  color: red;
  background-color: #ffebee;
  border-radius: 4px;
}

ul, ol {
  margin: 20px 0;
  padding-left: 20px;
}

li {
  margin: 10px 0;
}

.recipe-actions {
  margin: 30px 0;
  display: flex;
  gap: 10px;
}

.comments-section {
  margin-top: 40px;
}
</style>