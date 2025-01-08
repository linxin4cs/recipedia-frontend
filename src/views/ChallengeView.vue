<template>
  <div class="container">
    <div class="current-challenge">
      <h2>{{ currentChallenge.title }}</h2>
      <p><strong>Goals:</strong> {{ currentChallenge.goals }}</p>
      <div class="challenge-timer" v-if="currentChallenge.endDate">
        <p>Time Remaining: {{ timeRemaining }}</p>
      </div>
      
      <div class="challenge-actions">
        <base-button @click="participateInChallenge">
          Participate
        </base-button>
      </div>
    </div>

    <div class="winners-section">
      <h3>Winners</h3>
      <div class="recipe-grid">
        <recipe-card
          v-for="recipe in currentChallenge.winners"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>

    <div class="previous-challenges">
      <h3>Previous Challenges</h3>
      <div class="challenge-list">
        <div 
          v-for="challenge in previousChallenges" 
          :key="challenge.id"
          class="challenge-card"
        >
          <h4>{{ challenge.title }}</h4>
          <p>{{ challenge.description }}</p>
          <base-button 
            type="secondary"
            @click="viewChallenge(challenge.id)"
          >
            View Results
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const router = useRouter()

const currentChallenge = ref({
  id: 1,
  title: 'Bulk challenge',
  goals: 'Create the best pelmeni\'s dish',
  endDate: new Date('2024-12-31'),
  winners: [
    {
      id: 1,
      title: 'Pelmeni with mayo',
      rating: 5,
      description: 'Traditional pelmeni with a twist'
    },
    {
      id: 2,
      title: 'Pelmeni with smetana',
      rating: 4,
      description: 'Classic Russian style'
    }
  ]
})

const previousChallenges = ref([
  {
    id: 1,
    title: 'Healthy Desserts Week',
    description: 'Create desserts under 200 calories'
  },
  {
    id: 2,
    title: 'Vegetarian Challenge',
    description: 'Best meat-free recipes'
  }
])

const timeRemaining = computed(() => {
  const now = new Date()
  const end = new Date(currentChallenge.value.endDate)
  const diff = end - now
  
  if (diff <= 0) return 'Challenge ended'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return `${days} days remaining`
})

const participateInChallenge = () => {
  router.push('/create?challenge=' + currentChallenge.value.id)
}

const viewChallenge = (challengeId) => {
  router.push('/challenge/' + challengeId)
}
</script>

<style scoped>
.current-challenge {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.challenge-timer {
  margin: 15px 0;
  font-size: 1.2em;
  color: var(--main-color);
}

.challenge-actions {
  margin-top: 20px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.challenge-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.challenge-card {
  background-color: var(--background-color);
  padding: 15px;
  border-radius: 8px;
}

.challenge-card h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.challenge-card p {
  margin-bottom: 15px;
}
</style>