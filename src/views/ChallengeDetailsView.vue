<template>
  <div class="challenge-details-container">
    <loading-spinner v-if="loading" />

    <template v-else-if="challenge">
      <div class="challenge-header">
        <h2>{{ challenge.title }}</h2>
        <div class="challenge-meta">
          <span>Start: {{ formatDate(challenge.startDate) }}</span>
          <span>End: {{ formatDate(challenge.endDate) }}</span>
          <span>Participants: {{ challenge.numberOfRecipes }}</span>
        </div>
      </div>

      <p class="challenge-description">{{ challenge.description }}</p>

      <div class="challenge-actions">
        <base-button
          v-if="isAuthenticated && !hasJoined"
          @click="showJoinModal = true"
        >
          Join Challenge
        </base-button>
      </div>

      <div class="challenge-recipes">
        <h3>Submitted Recipes</h3>
        <div class="recipes-grid">
          <recipe-card
            v-for="recipe in recipes"
            :key="recipe.recipeId"
            :recipe="recipe"
          />
        </div>
      </div>

      <!-- Join Challenge Modal -->
      <modal-dialog v-if="showJoinModal" @close="showJoinModal = false">
        <template #header>Join Challenge</template>
        <template #default>
          <join-challenge-form
            :challengeId="challengeId"
            @submit="joinChallenge"
            @cancel="showJoinModal = false"
          />
        </template>
      </modal-dialog>
    </template>

    <div v-else class="error-message">
      Challenge not found
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jsonApi } from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import JoinChallengeForm from '@/components/JoinChallengeForm.vue'

const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated } = authStore

const challengeId = route.params.id
const challenge = ref(null)
const recipes = ref([])
const loading = ref(true)
const showJoinModal = ref(false)
const hasJoined = ref(false)

onMounted(async () => {
  try {
    const [challengeResponse, recipesResponse] = await Promise.all([
      jsonApi.get(`/api/challenges/${challengeId}`),
      jsonApi.get(`/api/challenges/${challengeId}/recipes`)
    ])

    challenge.value = challengeResponse.data
    recipes.value = recipesResponse.data
  } catch (error) {
    console.error('Failed to fetch challenge details:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const joinChallenge = async (recipeId) => {
  try {
    await jsonApi.post(`/api/challenges/${challengeId}/join?recipeId=${recipeId}`)
    hasJoined.value = true
    showJoinModal.value = false
    // Refresh recipes list
    const response = await jsonApi.get(`/api/challenges/${challengeId}/recipes`)
    recipes.value = response.data
  } catch (error) {
    console.error('Failed to join challenge:', error)
  }
}
</script>

<style scoped>
.challenge-details-container {
  padding: 20px;
}

.challenge-header {
  margin-bottom: 20px;
}

.challenge-meta {
  display: flex;
  gap: 20px;
  color: #666;
}

.challenge-description {
  margin: 20px 0;
  line-height: 1.6;
}

.challenge-actions {
  margin: 20px 0;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.error-message {
  text-align: center;
  color: #f44336;
  margin-top: 20px;
}
</style>
