<template>
  <div class="recipe-details-container">
    <loading-spinner v-if="loading" />

    <template v-else-if="recipe">
      <div class="recipe-header">
        <div class="title-section">
          <h2>{{ recipe.title }}</h2>
          <base-button
            v-if="isRecipeOwner"
            type="danger"
            @click="handleDeleteRecipe"
          >
            Delete Recipe
          </base-button>
        </div>
        <div class="recipe-meta">
          <span class="category">{{ recipe.category }}</span>
          <div class="meta-info">
            <span class="views">Views: {{ recipe.viewCount }}</span>
            <span class="rating">★ {{ formatRating(recipe.averageRating) }}</span>
          </div>
        </div>
      </div>

      <div class="recipe-author">
        <span>By {{ recipe.author.username }}</span>
        <span>{{ formatDate(recipe.creationDate) }}</span>
      </div>

      <p class="recipe-description">{{ recipe.description }}</p>

      <div v-if="recipe.challenge" class="challenge-info">
        <h3>Part of Challenge: {{ recipe.challenge.title }}</h3>
        <p>{{ recipe.challenge.description }}</p>
        <div class="challenge-dates">
          {{ formatDate(recipe.challenge.startDate) }} - {{ formatDate(recipe.challenge.endDate) }}
        </div>
      </div>

      <div class="recipe-content">
        <div class="ingredients-section">
          <h3>Ingredients</h3>
          <ul>
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <div class="instructions-section">
          <h3>Instructions</h3>
          <p>{{ recipe.instructions }}</p>
        </div>
      </div>

      <div class="comments-section">
        <h3>Comments</h3>

        <div v-if="authStore.isAuthenticated" class="comment-form">
          <textarea
            v-model="newComment"
            placeholder="Write your comment..."
            rows="3"
          ></textarea>
          <base-button
            @click="handleCreateComment"
            :disabled="!newComment.trim()"
          >
            Post Comment
          </base-button>
        </div>

        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.commentId" class="comment">
            <div class="comment-header">
              <div class="comment-info">
                <strong>{{ comment.user.username }}</strong>
                <span class="comment-date">{{ formatDate(comment.creationTime) }}</span>
              </div>
              <base-button
                v-if="isCommentOwner(comment)"
                type="danger"
                @click="handleDeleteComment(comment.commentId)"
              >
                Delete
              </base-button>
            </div>
            <p class="comment-text">{{ comment.text }}</p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="error-message">
      Recipe not found
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jsonApi } from '@/services/api'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const authStore = useAuthStore()
const router = useRouter()

const recipe = ref(null)
const loading = ref(true)
const comments = ref([])
const newComment = ref('')

const isRecipeOwner = computed(() => {
  return authStore.user?.userId === recipe.value?.author?.userId
})

onMounted(async () => {
  await Promise.all([
    fetchRecipe(),
    fetchComments()
  ])
})

const fetchRecipe = async () => {
  try {
    const recipeId = route.params.recipeId || route.params.id
    const userId = authStore.isAuthenticated && authStore.user 
      ? `?userId=${authStore.user.userId}` 
      : ''
    const response = await jsonApi.get(`/api/recipes/${recipeId}${userId}`)
    recipe.value = response.data
  } catch (error) {
    console.error('Failed to fetch recipe:', error)
  } finally {
    loading.value = false
  }
}

const fetchComments = async () => {
  try {
    const response = await jsonApi.get(`/api/recipes/${route.params.id}/comments`)
    comments.value = response.data
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
}

const handleCreateComment = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!newComment.value.trim()) return

  try {
    const commentData = {
      commentId: 0,
      text: newComment.value,
      creationTime: '',
      user: {
        userId: authStore.user.userId,
        username: '',
        email: '',
        bio: ''
      },
      recipeId: parseInt(route.params.id)
    }

    const response = await jsonApi.post('/api/comments', commentData)
    comments.value.push(response.data)
    newComment.value = ''
  } catch (error) {
    console.error('Failed to create comment:', error)
  }
}

const handleDeleteComment = async (commentId) => {
  if (!confirm('Are you sure you want to delete this comment?')) return

  try {
    await jsonApi.delete(`/api/comments/${commentId}`)
    comments.value = comments.value.filter(comment => comment.commentId !== commentId)
  } catch (error) {
    console.error('Failed to delete comment:', error)
  }
}

const isCommentOwner = (comment) => {
  return authStore.user?.userId === comment.user.userId
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : '0.0'
}

const handleDeleteRecipe = async () => {
  if (!confirm('Are you sure you want to delete this recipe?')) return

  try {
    await jsonApi.delete(`/api/recipes/${recipe.value.recipeId}`)
    router.push('/account')
  } catch (error) {
    console.error('Failed to delete recipe:', error)
  }
}
</script>

<style scoped>
.recipe-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

.recipe-header {
  margin-bottom: 20px;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-section h2 {
  margin: 0;
  font-size: 2em;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.meta-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.category {
  color: #666;
  font-size: 14px;
  border: 1px solid #666;
  padding: 4px 8px;
  border-radius: 4px;
}

.views {
  color: #666;
  font-size: 14px;
}

.rating {
  font-size: 14px;
  color: #f57c00;
}

.recipe-author {
  color: #666;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.recipe-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.challenge-info {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.challenge-dates {
  color: #666;
  margin-top: 10px;
}

.recipe-content {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  gap: 60px;
  margin-top: 40px;
}

.ingredients-section ul {
  list-style-type: none;
  padding: 0;
}

.ingredients-section li {
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.ingredients-section li::before {
  content: "•";
  position: absolute;
  left: 0;
}

.instructions-section {
  line-height: 1.8;
}

.comments-section {
  margin-top: 60px;
}

.comment-form {
  margin: 20px 0 40px;
}

.comment-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  resize: vertical;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.comment-date {
  color: #666;
  font-size: 0.9em;
}

.comment-text {
  line-height: 1.6;
  color: #333;
}

.error-message {
  text-align: center;
  color: #f44336;
  margin-top: 20px;
}
</style>
