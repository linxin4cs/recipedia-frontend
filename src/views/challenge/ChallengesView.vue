<template>
  <div class="challenges-container">
    <h2>Cooking Challenges</h2>

    <loading-spinner v-if="loading" />

    <div v-else class="challenges-grid">
      <challenge-card
        v-for="challenge in challenges"
        :key="challenge.challengeId"
        :challenge="challenge"
        @click="viewChallenge(challenge.challengeId)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jsonApi } from '@/services/api.js'
import ChallengeCard from '@/components/challenge/ChallengeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()

const challenges = ref([])
const loading = ref(true)

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

</script>

<style scoped>
.challenges-container {
  padding: 20px;
}

.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
}
</style>
