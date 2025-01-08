import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    alerts: [],
    isLoading: false,
    loadingMessage: '',
    theme: localStorage.getItem('theme') || 'light'
  }),

  actions: {
    showAlert(message, type = 'info', timeout = 3000) {
      const id = Date.now()
      this.alerts.push({ id, message, type })
      
      if (timeout > 0) {
        setTimeout(() => {
          this.removeAlert(id)
        }, timeout)
      }
      
      return id
    },

    removeAlert(id) {
      const index = this.alerts.findIndex(alert => alert.id === id)
      if (index > -1) {
        this.alerts.splice(index, 1)
      }
    },

    startLoading(message = 'Loading...') {
      this.isLoading = true
      this.loadingMessage = message
    },

    stopLoading() {
      this.isLoading = false
      this.loadingMessage = ''
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
}) 