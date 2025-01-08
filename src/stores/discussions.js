import { defineStore } from 'pinia'

export const useDiscussionStore = defineStore('discussions', {
  state: () => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  }),

  getters: {
    sortedByRecent: state => {
      return [...state.posts].sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    sortedByPopular: state => {
      return [...state.posts].sort((a, b) => b.likes - a.likes)
    }
  },

  actions: {
    async fetchPosts() {
      this.loading = true
      try {
        // const response = await api.get('/discussions')
        // Simulated response
        const response = [
          {
            id: 1,
            title: 'How to increase my calories intake?',
            author: 'UserB',
            date: 'October 15, 2024',
            content: 'It is really hard to stick to 4k kcal diet. Any tips?',
            likes: 5,
            comments: []
          }
        ]
        this.posts = response
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createPost(postData) {
      this.loading = true
      try {
        // const response = await api.post('/discussions', postData)
        // Simulated response
        const response = {
          id: Date.now(),
          ...postData,
          likes: 0,
          comments: [],
          date: new Date().toLocaleDateString()
        }
        this.posts.unshift(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async likePost(postId) {
      try {
        // await api.post(`/discussions/${postId}/like`)
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          post.likes++
        }
      } catch (error) {
        this.error = error.message
      }
    },

    async addComment(postId, comment) {
      try {
        // const response = await api.post(`/discussions/${postId}/comments`, comment)
        // Simulated response
        const response = {
          id: Date.now(),
          ...comment,
          date: new Date().toLocaleDateString()
        }
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          post.comments.push(response)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})
