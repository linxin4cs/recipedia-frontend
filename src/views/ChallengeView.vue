<template>
  <div class="challenges-container">
    <h2>Cooking Challenges</h2>
    
    <div class="challenges-header">
      <base-button 
        v-if="isAuthenticated"
        @click="showCreateModal = true"
      >
        Create Challenge
      </base-button>
    </div>

    <loading-spinner v-if="loading" />
    
    <div v-else class="challenges-grid">
      <challenge-card
        v-for="challenge in challenges"
        :key="challenge.challengeId"
        :challenge="challenge"
        @click="viewChallenge(challenge.challengeId)"
      />
    </div>

    <!-- Create Challenge Modal -->
    <modal-dialog v-if="showCreateModal" @close="showCreateModal = false">
      <template #header>Create New Challenge</template>
      <template #default>
        <create-challenge-form @submit="createChallenge" @cancel="showCreateModal = false" />
      </template>
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jsonApi } from '@/services/api'
import ChallengeCard from '@/components/ChallengeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import BaseButton from '@/components/BaseButton.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import CreateChallengeForm from '@/components/CreateChallengeForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated } = authStore

const challenges = ref([])
const loading = ref(true)
const showCreateModal = ref(false)

onMounted(async () => {
  try {
    const response = await jsonApi.get('/api/challenges')
    challenges.value = response.data
  } catch (error) {
    console.error('Failed to fetch challenges:', error)
  } finally {
    loading.value = false
  }
})

const viewChallenge = (challengeId) => {
  router.push(`/challenges/${challengeId}`)
}

const createChallenge = async (challengeData) => {
  try {
    const response = await jsonApi.post('/api/challenges', challengeData)
    challenges.value.push(response.data)
    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create challenge:', error)
  }
}
</script>

<style scoped>
.challenges-container {
  padding: 20px;
}

.challenges-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>
