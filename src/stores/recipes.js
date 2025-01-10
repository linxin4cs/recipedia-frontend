import { defineStore } from 'pinia'

export const useRecipeStore = defineStore('recipes', {
  state: () => ({
    recipes: [],
    trendyRecipes: [],
    userRecipes: [],
    currentRecipe: null,
    loading: false,
    error: null,
    searchResults: [],
    popularRecipes: []
  }),

  getters: {
    getRecipeById: state => id => {
      return state.recipes.find(recipe => recipe.id === id)
    },
    getFeaturedRecipes: state => {
      return state.recipes.filter(recipe => recipe.rating >= 4)
    }
  },

  actions: {
    async fetchRecipes() {
      this.loading = true
      try {
        // const response = await api.get('/recipes')
        // Simulated response
        const response = [
          {
            id: 1,
            title: 'Protein Pancakes',
            rating: 4,
            description: 'Healthy and delicious breakfast option'
          },
          {
            id: 2,
            title: 'Green Smoothie Bowl',
            rating: 5,
            description: 'Start your day with this nutritious bowl'
          }
        ]
        this.recipes = response
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchTrendyRecipes() {
      this.loading = true
      try {
        // const response = await api.get('/recipes/trendy')
        // Simulated response
        const response = [
          {
            id: 3,
            title: 'Trending Recipe 1',
            rating: 5,
            description: 'Currently trending recipe'
          }
        ]
        this.trendyRecipes = response
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createRecipe(recipeData) {
      this.loading = true
      try {
        // const response = await api.post('/recipes', recipeData)
        // Simulated response
        const response = {
          id: Date.now(),
          ...recipeData
        }
        this.recipes.push(response)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchRecipeById(id) {
      this.loading = true
      try {
        // const response = await api.get(`/recipes/${id}`)
        // Simulated response
        const response = {
          id: id,
          title: 'Sample Recipe',
          rating: 4,
          description: 'Sample description',
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          instructions: ['Step 1', 'Step 2']
        }
        this.currentRecipe = response
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserRecipes() {
      this.loading = true
      try {
        // const response = await api.get('/recipes/user')
        // Simulated response
        const response = [
          {
            id: 1,
            title: 'My First Recipe',
            rating: 4,
            description: 'A personal creation'
          }
        ]
        this.userRecipes = response
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async saveRecipe(recipeId) {
      this.loading = true
      try {
        const recipe = this.recipes.find(r => r.id === recipeId)
        if (recipe && !this.userRecipes.some(r => r.id === recipeId)) {
          this.userRecipes.push(recipe)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromSaved(recipeId) {
      this.loading = true
      try {
        const index = this.userRecipes.findIndex(r => r.id === recipeId)
        if (index > -1) {
          this.userRecipes.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addComment(recipeId, comment) {
      this.loading = true
      try {
        const response = {
          id: Date.now(),
          ...comment,
          date: new Date().toLocaleDateString()
        }

        if (this.currentRecipe?.id === recipeId) {
          if (!this.currentRecipe.comments) {
            this.currentRecipe.comments = []
          }
          this.currentRecipe.comments.push(response)
        }

        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchRecipes(query) {
      this.loading = true
      this.searchResults = []
      try {
        const response = this.recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase())
        )
        this.searchResults = response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPopularRecipes() {
      this.loading = true
      try {
        const response = await jsonApi.get('/api/recipes/popular')
        this.popularRecipes = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
