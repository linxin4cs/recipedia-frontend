<template>
  <form @submit.prevent="handleSubmit" class="join-challenge-form">
    <div class="form-group">
      <label for="recipe">Select Recipe to Submit:</label>
      <select 
        id="recipe" 
        v-model="selectedRecipe" 
        required
        class="form-control"
      >
        <option value="">Choose a recipe...</option>
        <option 
          v-for="recipe in userRecipes" 
          :key="recipe.recipeId" 
          :value="recipe.recipeId"
        >
          {{ recipe.title }}
        </option>
      </select>
    </div>

    <div class="form-actions">
      <base-button type="button" @click="$emit('cancel')" class="cancel-btn">
        Cancel
      </base-button>
      <base-button type="submit" :disabled="!selectedRecipe">
        Submit Recipe
      </base-button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { jsonApi } from '@/services/api'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  challengeId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const selectedRecipe = ref('')
const userRecipes = ref([])

onMounted(async () => {
  try {
    // Fetch user's recipes that can be submitted to the challenge
    const response = await jsonApi.get('/api/recipes/my-recipes')
    userRecipes.value = response.data
  } catch (error) {
    console.error('Failed to fetch user recipes:', error)
  }
})

const handleSubmit = () => {
  if (selectedRecipe.value) {
    emit('submit', selectedRecipe.value)
  }
}
</script>

<style scoped>
.join-challenge-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #666;
}

.cancel-btn:hover {
  background-color: #555;
}
</style> 