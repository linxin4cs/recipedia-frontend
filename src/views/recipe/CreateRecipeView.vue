<template>
  <div class="create-recipe-container">
    <h2>Create New Recipe</h2>
    
    <form @submit.prevent="handleSubmit" class="recipe-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="Enter recipe title"
        />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select 
          id="category"
          v-model="formData.category"
          required
        >
          <option value="">Select category</option>
          <option v-for="category in categories" 
                  :key="category" 
                  :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          required
          placeholder="Describe your recipe"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Ingredients</label>
        <div class="ingredients-list">
          <div v-for="(ingredient, index) in formData.ingredients" 
               :key="index"
               class="ingredient-item">
            <input
              v-model="formData.ingredients[index]"
              type="text"
              placeholder="Add ingredient"
            />
            <base-button 
              type="secondary"
              @click="removeIngredient(index)"
            >
              Remove
            </base-button>
          </div>
        </div>
        <base-button 
          type="secondary"
          @click="addIngredient"
        >
          Add Ingredient
        </base-button>
      </div>

      <div class="form-group">
        <label for="instructions">Instructions</label>
        <textarea
          id="instructions"
          v-model="formData.instructions"
          required
          placeholder="Detailed cooking instructions"
          rows="6"
        ></textarea>
      </div>

      <div class="form-actions">
        <base-button 
          type="secondary" 
          @click="$router.push('/')"
        >
          Cancel
        </base-button>
        <base-button 
          type="primary"
          :disabled="!isFormValid"
        >
          Create Recipe
        </base-button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jsonApi } from '@/services/api'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

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

const formData = ref({
  title: '',
  description: '',
  category: '',
  ingredients: [''],
  instructions: ''
})

const isFormValid = computed(() => {
  return formData.value.title.trim() &&
         formData.value.category &&
         formData.value.description.trim() &&
         formData.value.ingredients.some(i => i.trim()) &&
         formData.value.instructions.trim()
})

const addIngredient = () => {
  formData.value.ingredients.push('')
}

const removeIngredient = (index) => {
  formData.value.ingredients.splice(index, 1)
  if (formData.value.ingredients.length === 0) {
    formData.value.ingredients.push('')
  }
}

const handleSubmit = async () => {
  try {
    const recipeData = {
      recipeId: 0,
      title: formData.value.title,
      description: formData.value.description,
      category: formData.value.category,
      viewCount: 0,
      ingredients: formData.value.ingredients.filter(i => i.trim()),
      instructions: formData.value.instructions,
      creationDate: '',
      author: {
        userId: authStore.user.userId,
        username: '',
        email: '',
        bio: ''
      },
      averageRating: 0.0,
      isRated: false
    }

    const response = await jsonApi.post('/api/recipes', recipeData)
    router.push(`/recipes/${response.data.recipeId}`)
  } catch (error) {
    console.error('Failed to create recipe:', error)
  }
}
</script>

<style scoped>
.create-recipe-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 80px;
}

.recipe-form {
  background-color: transparent;
  padding: 20px 0;
  max-width: 2000px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  margin-bottom: 12px;
  font-weight: 400;
  color: #555;
}

input, select, textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  background-color: #fff;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #999;
}

.ingredients-list {
  margin-bottom: 15px;
}

.ingredient-item {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.ingredient-item input {
  flex: 1;
  min-width: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
