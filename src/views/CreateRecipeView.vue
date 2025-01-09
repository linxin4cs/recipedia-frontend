<template>
  <div class="container">
    <h2>Create New Recipe</h2>

    <div v-if="recipeStore.error" class="error-message">
      {{ recipeStore.error }}
    </div>

    <div class="recipe-form">
      <div class="form-group">
        <label for="recipe-title">Recipe Title:</label>
        <input
          type="text"
          id="recipe-title"
          v-model="recipeData.title"
          placeholder="Enter recipe title"
          :disabled="recipeStore.loading"
        >
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          id="description"
          v-model="recipeData.description"
          placeholder="Enter a brief description"
          :disabled="recipeStore.loading"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Ingredients:</label>
        <div
          v-for="(ingredient, index) in recipeData.ingredients"
          :key="index"
          class="ingredient-input"
        >
          <input
            type="text"
            v-model="recipeData.ingredients[index]"
            placeholder="Enter ingredient"
            :disabled="recipeStore.loading"
          >
          <base-button
            type="secondary"
            @click="removeIngredient(index)"
            :disabled="recipeStore.loading"
          >
            Remove
          </base-button>
        </div>
        <base-button
          type="secondary"
          @click="addIngredient"
          :disabled="recipeStore.loading"
        >
          Add Ingredient
        </base-button>
      </div>

      <div class="form-group">
        <label>Instructions:</label>
        <div
          v-for="(step, index) in recipeData.instructions"
          :key="index"
          class="instruction-input"
        >
          <textarea
            v-model="recipeData.instructions[index]"
            :placeholder="`Step ${index + 1}`"
            :disabled="recipeStore.loading"
          ></textarea>
          <base-button
            type="secondary"
            @click="removeInstruction(index)"
            :disabled="recipeStore.loading"
          >
            Remove
          </base-button>
        </div>
        <base-button
          type="secondary"
          @click="addInstruction"
          :disabled="recipeStore.loading"
        >
          Add Step
        </base-button>
      </div>

      <div class="form-actions">
        <base-button
          type="secondary"
          @click="$router.go(-1)"
          :disabled="recipeStore.loading"
        >
          Cancel
        </base-button>
        <base-button
          @click="handleSubmit"
          :disabled="recipeStore.loading || !isFormValid"
        >
          {{ recipeStore.loading ? 'Creating...' : 'Create Recipe' }}
        </base-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipes'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const recipeStore = useRecipeStore()
const authStore = useAuthStore()

const recipeData = ref({
  title: '',
  description: '',
  rating: 0,
  ingredients: [''],
  instructions: ['']
})

const addIngredient = () => {
  recipeData.value.ingredients.push('')
}

const removeIngredient = (index) => {
  recipeData.value.ingredients.splice(index, 1)
}

const addInstruction = () => {
  recipeData.value.instructions.push('')
}

const removeInstruction = (index) => {
  recipeData.value.instructions.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const recipe = await recipeStore.createRecipe({
      ...recipeData.value,
      author: authStore.user?.username || 'Anonymous'
    })
    router.push(`/recipe/${recipe.id}`)
  } catch (error) {
    console.error('Failed to create recipe:', error)
  }
}

const isFormValid = computed(() => {
  return recipeData.value.title.trim() &&
         recipeData.value.description.trim() &&
         recipeData.value.ingredients.some(i => i.trim()) &&
         recipeData.value.instructions.some(i => i.trim())
})
</script>

<style scoped>
.recipe-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.ingredient-input, .instruction-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.ingredient-input input, .instruction-input textarea {
  flex: 1;
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.error-message {
  color: red;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>
