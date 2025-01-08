<template>
  <div class="container not-found">
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <base-button @click="$router.push('/')">
      Return to Home
    </base-button>
  </div>
</template>

<script setup>
import BaseButton from '@/components/BaseButton.vue'
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px 20px;
}

h2 {
  font-size: 2em;
  margin-bottom: 20px;
}

p {
  margin-bottom: 30px;
  color: #666;
}
</style> 