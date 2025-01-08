<template>
  <div class="container login-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="username">Username:</label>
      <input
        type="text"
        id="username"
        v-model="credentials.username"
        placeholder="Enter Username"
      >
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="credentials.password"
        placeholder="Enter Password"
      >
    </div>

    <base-button
      @click="handleLogin"
      :disabled="!isFormValid"
    >
      Login
    </base-button>

    <p>Don't have an account?
      <router-link to="/signup">Sign up here</router-link>
      .
    </p>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  username: '',
  password: ''
})

const error = ref('')

const isFormValid = computed(() => {
  return credentials.value.username.trim() && credentials.value.password.trim()
})

const handleLogin = async () => {
  if (!isFormValid.value) return

  error.value = ''

  try {
    await authStore.login(credentials.value)
    await router.push('/')
  } catch (err) {
    error.value = err.response.statusText
  }
}
</script>

<style scoped>
.login-container {
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
