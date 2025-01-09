<template>
  <div class="challenge-card" @click="() => router.push(`/challenges/${challenge.challengeId}`)">
    <h3 class="challenge-title">{{ challenge.title }}</h3>
    <p class="challenge-description">{{ challenge.description }}</p>
    <div class="challenge-info">
      <span class="challenge-dates">
        {{ new Date(challenge.startDate).toLocaleDateString() }} -
        {{ new Date(challenge.endDate).toLocaleDateString() }}
      </span>
      <span class="recipes-count">Recipes: {{ challenge.numberOfRecipes }}</span>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

defineProps({
  challenge: {
    type: Object,
    required: true,
    default: () => ({
      challengeId: 0,
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      numberOfRecipes: 0
    })
  }
})
</script>

<style scoped>
.challenge-card {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.challenge-card:hover {
  background-color: #f9f9f9;
}

.challenge-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 12px 0;
}

.challenge-description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.challenge-info {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.challenge-dates {
  color: #666;
  font-size: 14px;
}

.recipes-count {
  font-size: 14px;
  color: #f57c00;
  padding: 4px 8px;
  border: 1px solid #f57c00;
  border-radius: 4px;
}
</style>
