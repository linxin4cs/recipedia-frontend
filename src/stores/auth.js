import { defineStore } from 'pinia'
import { jsonApi, formApi } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await formApi.post('/api/auth/login', credentials)

        this.user = response.data
        this.token = JSON.stringify(response.data)

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

        this.user = response.data
        this.token = JSON.stringify(response.data)

        localStorage.setItem('token', this.token)
      } catch (error) {
        throw error
      }
    },

    async fetchUserProfile() {
      if (!this.token) return

      const tokenUser = JSON.parse(this.token)

      const response = await jsonApi.get(`/api/users/${tokenUser.userId}`)

      this.user = response.data
      this.token = JSON.stringify(response.data)

      localStorage.setItem('token', this.token)
    },

    async updateUserProfile(userData) {
      if (!this.token) return

      const response = await jsonApi.patch(`/api/users/${this.user.userId}`, userData)

      this.user = response.data
      this.token = JSON.stringify(response.data)

      localStorage.setItem('token', this.token)
    },

    async deleteAccount() {
      if (!this.token) return

      await jsonApi.delete(`/api/users/${this.user.userId}`)
      await this.logout()
    },

    async changePassword(passwordData) {
      if (!this.token) return

      await formApi.patch(`/api/auth/password/${this.user.userId}`, passwordData)
    }
  },
})
