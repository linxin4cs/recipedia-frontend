<template>
  <div class="rating" :class="{ 'rating-interactive': interactive }">
    <span 
      v-for="star in 5" 
      :key="star"
      @click="interactive && updateRating(star)"
      :class="{ 'filled': star <= value }"
    >
      ★
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: value => value >= 0 && value <= 5
  },
  interactive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const updateRating = (rating) => {
  emit('update:value', rating)
}
</script>

<style scoped>
.rating {
  color: #ddd;
  font-size: 1.5em;
}

.rating span.filled {
  color: gold;
}

.rating-interactive span {
  cursor: pointer;
}

.rating-interactive span:hover {
  color: gold;
}
</style> 