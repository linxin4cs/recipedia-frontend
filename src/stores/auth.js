import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    userProfile: state => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        // const response = await api.post('/auth/login', credentials)
        // Simulated response
        const response = {
          token: 'dummy-token',
          user: {
            id: 1,
            username: credentials.username,
            email: 'user@example.com'
          }
        }
        
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        // await api.post('/auth/logout')
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async fetchUserProfile() {
      if (!this.token) return
      
      try {
        // const user = await api.get('/auth/profile')
        // Simulated response
        const user = {
          id: 1,
          username: 'testuser',
          email: 'user@example.com'
        }
        this.user = user
      } catch (error) {
        console.error('Fetch profile error:', error)
      }
    },

    async signup(userData) {
      this.loading = true
      this.error = null
      try {
        // const response = await api.post('/auth/signup', userData)
        // Simulated response
        const response = {
          token: 'dummy-token',
          user: {
            id: 1,
            username: userData.username,
            email: userData.email
          }
        }
        
        this.token = response.token
        this.user = response.user
        localStorage.setItem('token', response.token)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})