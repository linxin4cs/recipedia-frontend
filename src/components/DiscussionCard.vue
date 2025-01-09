<template>
  <div class="discussion-card" @click="() => router.push(`/discussions/${discussion.discussionId}`)">
    <h3 class="discussion-title">{{ discussion.title }}</h3>
    <p class="discussion-description">{{ discussion.description }}</p>
    <div class="discussion-info">
      <div class="discussion-meta">
        <span class="discussion-author">{{ discussion.user.username }}</span>
        <span class="discussion-date">{{ new Date(discussion.creationDate).toLocaleDateString() }}</span>
      </div>
      <span class="replies-count">Replies: {{ discussion.repliesCount }}</span>
    </div>
  </div>
</template>

<script setup>

import {useRouter} from "vue-router";

const router = useRouter()

defineProps({
  discussion: {
    type: Object,
    required: true,
    default: () => ({
      discussionId: 0,
      title: '',
      description: '',
      creationDate: '',
      user: {
        userId: null,
        username: '',
        email: null,
        bio: null
      },
      repliesCount: 0
    })
  }
})
</script>

<style scoped>
.discussion-card {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.discussion-card:hover {
  background-color: #f9f9f9;
}

.discussion-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 12px 0;
}

.discussion-description {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.discussion-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.discussion-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.discussion-author {
  color: #666;
  font-size: 14px;
}

.discussion-date {
  color: #888;
  font-size: 14px;
}

.replies-count {
  font-size: 14px;
  color: #f57c00;
  padding: 4px 8px;
  border: 1px solid #f57c00;
  border-radius: 4px;
}
</style>
