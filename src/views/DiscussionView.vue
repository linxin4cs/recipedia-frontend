<template>
  <div class="container">
    <h2>Discussion Forum</h2>
    
    <div class="discussion-controls">
      <base-button 
        @click="showNewPostForm = true" 
        v-if="!showNewPostForm"
      >
        Start New Discussion
      </base-button>
      
      <div v-if="showNewPostForm" class="discussion-form">
        <div class="form-group">
          <label for="post-title">Title:</label>
          <input 
            type="text" 
            id="post-title"
            v-model="newPost.title" 
            placeholder="Discussion title"
            :disabled="discussionStore.loading"
          >
        </div>

        <div class="form-group">
          <label for="post-content">Content:</label>
          <textarea 
            id="post-content"
            v-model="newPost.content" 
            placeholder="What's on your mind?"
            :disabled="discussionStore.loading"
          ></textarea>
        </div>

        <div class="form-actions">
          <base-button 
            @click="createPost"
            :disabled="discussionStore.loading || !isFormValid"
          >
            {{ discussionStore.loading ? 'Posting...' : 'Post Discussion' }}
          </base-button>
          <base-button 
            type="secondary"
            @click="showNewPostForm = false"
            :disabled="discussionStore.loading"
          >
            Cancel
          </base-button>
        </div>
      </div>
    </div>

    <div class="discussion-filters">
      <select v-model="currentFilter">
        <option value="recent">Most Recent</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>

    <div v-if="discussionStore.loading" class="loading">
      Loading discussions...
    </div>

    <div v-else-if="discussionStore.error" class="error-message">
      {{ discussionStore.error }}
    </div>

    <div v-else class="posts">
      <discussion-post
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        :show-comments="activePost === post.id"
        @like="handleLike"
        @show-comments="toggleComments(post.id)"
        @add-comment="addComment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDiscussionStore } from '@/stores/discussions'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/BaseButton.vue'
import DiscussionPost from '@/components/DiscussionPost.vue'

const discussionStore = useDiscussionStore()
const authStore = useAuthStore()

const showNewPostForm = ref(false)
const currentFilter = ref('recent')
const activePost = ref(null)

const newPost = ref({
  title: '',
  content: ''
})

const isFormValid = computed(() => {
  return newPost.value.title.trim() && newPost.value.content.trim()
})

const filteredPosts = computed(() => {
  return currentFilter.value === 'popular' 
    ? discussionStore.sortedByPopular 
    : discussionStore.sortedByRecent
})

onMounted(async () => {
  await discussionStore.fetchPosts()
})

const createPost = async () => {
  if (!isFormValid.value) return

  try {
    await discussionStore.createPost({
      title: newPost.value.title,
      content: newPost.value.content,
      author: authStore.user?.username || 'Anonymous'
    })
    showNewPostForm.value = false
    newPost.value = { title: '', content: '' }
  } catch (error) {
    console.error('Failed to create post:', error)
  }
}

const handleLike = async (postId) => {
  await discussionStore.likePost(postId)
}

const toggleComments = (postId) => {
  activePost.value = activePost.value === postId ? null : postId
}

const addComment = async (postId, comment) => {
  try {
    await discussionStore.addComment(postId, {
      content: comment.content,
      author: authStore.user?.username || 'Anonymous'
    })
  } catch (error) {
    console.error('Failed to add comment:', error)
  }
}
</script>

<style scoped>
.discussion-controls {
  margin-bottom: 30px;
}

.discussion-form {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  height: 150px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.discussion-filters {
  margin: 20px 0;
}

.discussion-filters select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.posts {
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error-message {
  color: red;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>