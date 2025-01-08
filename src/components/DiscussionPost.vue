<template>
  <div class="post">
    <div class="post-header">
      <h3>{{ post.title }}</h3>
      <div class="post-meta">
        <span>Posted by <strong>{{ post.author }}</strong></span>
        <span>{{ post.date }}</span>
      </div>
    </div>
    
    <p class="post-content">{{ post.content }}</p>
    
    <div class="post-actions">
      <base-button 
        type="secondary"
        @click="handleLike"
      >
        👍 {{ post.likes }}
      </base-button>
      <base-button 
        type="secondary"
        @click="$emit('show-comments')"
      >
        💬 {{ post.comments.length }} Comments
      </base-button>
    </div>

    <div class="comments-section" v-if="showComments">
      <recipe-comments 
        :comments="post.comments"
        @add-comment="$emit('add-comment', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import RecipeComments from './RecipeComments.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showComments: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['like', 'show-comments', 'add-comment'])

const handleLike = () => {
  emit('like', props.post.id)
}
</script>

<style scoped>
.post {
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.post-header {
  margin-bottom: 15px;
}

.post-header h3 {
  margin: 0 0 10px 0;
}

.post-meta {
  color: #666;
  font-size: 0.9em;
  display: flex;
  gap: 15px;
}

.post-content {
  margin-bottom: 20px;
}

.post-actions {
  display: flex;
  gap: 10px;
}

.comments-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
</style> 