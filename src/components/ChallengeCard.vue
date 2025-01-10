<template>
  <div class="challenge-card" @click="$emit('click')">
    <h3 class="challenge-title">{{ challenge.title }}</h3>
    <p class="challenge-description">{{ challenge.description }}</p>
    <div class="challenge-info">
      <div class="challenge-dates">
        <span>{{ formatDate(challenge.startDate) }} - {{ formatDate(challenge.endDate) }}</span>
      </div>
      <span class="participants-count">{{ challenge.numberOfRecipes }} Recipes</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  challenge: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.challenge-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.challenge-card:hover {
  transform: translateY(-2px);
}

.challenge-title {
  margin: 0 0 10px 0;
  color: #333;
}

.challenge-description {
  color: #666;
  font-size: 14px;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.challenge-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.challenge-dates {
  color: #888;
}

.participants-count {
  color: var(--main-color);
  font-weight: bold;
}
</style>
