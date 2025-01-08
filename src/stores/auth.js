import { defineStore } from 'pinia'
import { jsonApi, formApi } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userProfile: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await formApi.post('/api/auth/login', credentials)

        this.user = response
        this.token = JSON.stringify(response)

        localStorage.setItem('token', this.token)
      } catch (error) {
        throw error
      }
    },

    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    async signup(userData) {
      try {
        const response = await formApi.post('/api/auth/register', userData)

        this.user = response
        this.token = JSON.stringify(response)

        localStorage.setItem('token', this.token)
      } catch (error) {
        throw error
      }
    },

    async fetchUserProfile() {
      if (!this.token) return

      // const user = await api.get('/auth/profile')
      // Simulated response
      const user = {
        id: 1,
        username: 'testuser',
        email: 'user@example.com',
      }
      this.user = user
    },
  },
})
