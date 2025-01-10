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
          v-for="recipe in availableRecipes"
          :key="recipe.recipeId"
          :value="recipe.recipeId"
        >
          {{ recipe.title }}
        </option>
      </select>
    </div>

    <div class="form-actions">
      <base-button type="secondary" @click="$emit('cancel')" class="cancel-btn">
        Cancel
      </base-button>
      <base-button type="primary" :disabled="!selectedRecipe">
        Submit Recipe
      </base-button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { jsonApi } from '@/services/api.js'
import BaseButton from '@/components/BaseButton.vue'
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore()

const props = defineProps({
  challengeId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const selectedRecipe = ref('')
const userRecipes = ref([])
const challenge = ref(null)

onMounted(async () => {
  try {
    const [recipesResponse, challengeResponse] = await Promise.all([
      jsonApi.get(`/api/users/${authStore.user.userId}/recipes`),
      jsonApi.get(`/api/challenges/${props.challengeId}`)
    ])
    userRecipes.value = recipesResponse.data
    challenge.value = challengeResponse.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})

const availableRecipes = computed(() => {
  if (!challenge.value) return []

  const challengeStart = new Date(challenge.value.startDate)
  const challengeEnd = new Date(challenge.value.endDate)

  return userRecipes.value.filter(recipe => {
    const recipeDate = new Date(recipe.creationDate)

    return !recipe.challenge &&
           recipeDate >= challengeStart &&
           recipeDate <= challengeEnd
  })
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

</style>
