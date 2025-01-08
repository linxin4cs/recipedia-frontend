<template>
  <div class="container signup-container">
    <div v-if="authStore.error" class="error-message">
      {{ authStore.error }}
    </div>

    <div class="form-group">
      <label for="username">Username:</label>
      <input 
        type="text" 
        id="username" 
        v-model="signupData.username" 
        placeholder="Choose a username"
        :disabled="authStore.loading"
      >
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input 
        type="email" 
        id="email" 
        v-model="signupData.email" 
        placeholder="Enter your email"
        :disabled="authStore.loading"
      >
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input 
        type="password" 
        id="password" 
        v-model="signupData.password" 
        placeholder="Create a password"
        :disabled="authStore.loading"
      >
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password:</label>
      <input 
        type="password" 
        id="confirmPassword" 
        v-model="signupData.confirmPassword" 
        placeholder="Confirm your password"
        :disabled="authStore.loading"
      >
    </div>

    <base-button 
      @click="handleSignup"
      :disabled="authStore.loading || !isFormValid"
    >
      {{ authStore.loading ? 'Creating Account...' : 'Sign Up' }}
    </base-button>
    
    <p>Already have an account? <router-link to="/login">Log in here</router-link>.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const signupData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  const { username, email, password, confirmPassword } = signupData.value
  return username.trim() && 
         email.trim() && 
         password.length >= 6 && 
         password === confirmPassword
})

const handleSignup = async () => {
  if (!isFormValid.value) {
    authStore.error = 'Please check your input fields'
    return
  }

  try {
    await authStore.signup({
      username: signupData.value.username,
      email: signupData.value.email,
      password: signupData.value.password
    })
    router.push('/account')
  } catch (error) {
    console.error('Signup failed:', error)
  }
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 50px auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: red;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>