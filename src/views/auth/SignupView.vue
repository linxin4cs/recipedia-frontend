<template>
  <div class="container signup-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="username">Username:</label>
      <input
        type="text"
        id="username"
        v-model="signupData.username"
        placeholder="Choose a username"
      >
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="signupData.password"
        placeholder="Create a password"
      >
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        v-model="signupData.confirmPassword"
        placeholder="Confirm your password"
      >
    </div>

    <base-button
      @click="handleSignup"
    >
      Sign Up
    </base-button>

    <p>Already have an account? <router-link to="/login">Log in here</router-link>.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const signupData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')

const isFormValid = computed(() => {
  const { username, password, confirmPassword } = signupData.value
  return username.trim() &&
         password.trim() &&
         password === confirmPassword
})

const handleSignup = async () => {
  if (!isFormValid.value) {
    error.value = 'Please check your input fields'
    return
  }

  error.value = ''

  try {
    await authStore.signup({
      username: signupData.value.username,
      password: signupData.value.password
    })

    await router.push('/')
  } catch (err) {
    error.value = err.response.statusText
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
