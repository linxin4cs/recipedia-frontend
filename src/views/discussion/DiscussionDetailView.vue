<template>
  <div class="container">
    <loading-spinner v-if="loading" />

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <template v-else>
      <div class="discussion-header">
        <h2>{{ discussion.title }}</h2>
        <base-button
          v-if="isOwner"
          type="danger"
          @click="handleDelete"
        >
          Delete Discussion
        </base-button>
      </div>

      <div class="discussion-meta">
        <span class="discussion-author">{{ discussion.user.username }}</span>
        <span class="discussion-date">{{ new Date(discussion.creationDate).toLocaleDateString() }}</span>
      </div>

      <p class="discussion-description">{{ discussion.description }}</p>

      <div class="replies-section">
        <h3>Replies ({{ replies.length }})</h3>

        <div class="reply-form">
          <textarea
            v-model="newReply"
            placeholder="Write your reply..."
            rows="4"
          ></textarea>
          <base-button
            @click="handleCreateReply"
            :disabled="!newReply.trim()"
          >
            Post Reply
          </base-button>
        </div>

        <div class="replies-list">
          <div v-for="reply in replies" :key="reply.replyId" class="reply">
            <div class="reply-header">
              <div class="reply-info">
                <strong>{{ reply.user.username }}</strong>
                <span class="reply-date">{{ new Date(reply.creationTime).toLocaleDateString() }}</span>
              </div>
              <base-button
                v-if="isReplyOwner(reply)"
                type="danger"
                @click="handleDeleteReply(reply.replyId)"
              >
                Delete
              </base-button>
            </div>
            <p>{{ reply.text }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jsonApi } from '@/services/api'
import BaseButton from '@/components/BaseButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const discussion = ref({})
const replies = ref([])
const loading = ref(true)
const error = ref(null)
const newReply = ref('')

const isOwner = computed(() => {
  return authStore.user?.userId === discussion.value?.user?.userId
})

const isReplyOwner = (reply) => {
  return authStore.user?.userId === reply.user.userId
}

onMounted(async () => {
  await fetchDiscussionAndReplies()
})

const fetchDiscussionAndReplies = async () => {
  try {
    const [discussionRes, repliesRes] = await Promise.all([
      jsonApi.get(`/api/discussions/${route.params.id}`),
      jsonApi.get(`/api/discussions/${route.params.id}/replies`)
    ])
    discussion.value = discussionRes.data
    replies.value = repliesRes.data
  } catch (err) {
    error.value = 'Failed to load discussion'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleCreateReply = async () => {
  if (!newReply.value.trim()) return

  try {
    const replyData = {
      replyId: 0,
      text: newReply.value,
      creationTime: '',
      user: {
        userId: authStore.user.userId,
        username: '',
        email: '',
        bio: ''
      },
      discussionId: parseInt(route.params.id)
    }

    const response = await jsonApi.post('/api/replies', replyData)
    replies.value.push(response.data)
    newReply.value = ''
  } catch (err) {
    error.value = 'Failed to post reply'
    console.error(err)
  }
}

const handleDeleteReply = async (replyId) => {
  if (!confirm('Are you sure you want to delete this reply?')) return

  try {
    await jsonApi.delete(`/api/replies/${replyId}`)
    replies.value = replies.value.filter(reply => reply.replyId !== replyId)
  } catch (err) {
    error.value = 'Failed to delete reply'
    console.error(err)
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this discussion?')) return

  try {
    await jsonApi.delete(`/api/discussions/${route.params.id}`)
    await router.push('/discussions')
  } catch (err) {
    error.value = 'Failed to delete discussion'
    console.error(err)
  }
}
</script>

<style scoped>
.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.discussion-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.discussion-meta {
  display: flex;
  gap: 15px;
  color: #666;
  margin-bottom: 30px;
}

.replies-section {
  margin-top: 40px;
}

.reply-form {
  margin-bottom: 30px;
}

.reply-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.reply {
  background-color: var(--background-color);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reply-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.reply-date {
  color: #666;
  font-size: 0.9em;
}

.error-message {
  color: red;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
