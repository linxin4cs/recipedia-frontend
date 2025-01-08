<template>
  <div class="comments">
    <div class="comment-form">
      <h4>Add a Comment</h4>
      <textarea 
        v-model="newComment.content"
        placeholder="Write your comment here..."
        rows="4"
      ></textarea>
      <base-button 
        @click="submitComment"
        :disabled="!newComment.content.trim()"
      >
        Post Comment
      </base-button>
    </div>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-header">
          <strong>{{ comment.author }}</strong>
          <span class="comment-date">{{ comment.date }}</span>
        </div>
        <p>{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-comment'])

const newComment = ref({
  content: ''
})

const submitComment = () => {
  if (newComment.value.content.trim()) {
    emit('add-comment', {
      id: Date.now(),
      author: 'Current User',
      date: new Date().toLocaleDateString(),
      content: newComment.value.content
    })
    newComment.value.content = ''
  }
}
</script>

<style scoped>
.comments {
  margin-top: 20px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.comments-list {
  margin-top: 20px;
}

.comment {
  background-color: var(--background-color);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-date {
  color: #666;
  font-size: 0.9em;
}

.comment p {
  margin: 0;
}
</style> 