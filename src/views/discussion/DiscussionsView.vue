<template>
  <div class="container">
    <div class="discussions-header">
      <h2>Discussions</h2>
      <base-button v-if="authStore.isAuthenticated" @click="handleOpenModal">
        Start Discussion
      </base-button>
    </div>

    <loading-spinner v-if="loading" />

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="discussions-grid">
      <discussion-card
        v-for="discussion in discussions"
        :key="discussion.discussionId"
        :discussion="discussion"
      />
    </div>

    <div v-if="discussions.length === 0" class="no-discussions">
      <p>No discussions yet.</p>
      <base-button v-if="authStore.isAuthenticated" @click="showCreateModal = true">
        Start First Discussion
      </base-button>
    </div>

    <modal-dialog v-if="showCreateModal" @close="showCreateModal = false">
      <template #header>Create Discussion</template>
      <start-discussion-form
        @submit="handleCreateDiscussion"
        @cancel="showCreateModal = false"
      />
    </modal-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { jsonApi } from '@/services/api'
import BaseButton from '@/components/common/BaseButton.vue'
import DiscussionCard from '@/components/discussion/DiscussionCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ModalDialog from '@/components/common/ModalDialog.vue'
import StartDiscussionForm from '@/components/discussion/StartDiscussionForm.vue'

const authStore = useAuthStore()
const discussions = ref([])
const loading = ref(true)
const error = ref(null)
const showCreateModal = ref(false)

onMounted(async () => {
  await fetchDiscussions()
})

const fetchDiscussions = async () => {
  try {
    const response = await jsonApi.get('/api/discussions')
    discussions.value = response.data
  } catch (err) {
    error.value = 'Failed to load discussions'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleOpenModal = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  showCreateModal.value = true
}

const handleCreateDiscussion = async (formData) => {
  try {
    const discussionData = {
      discussionId: 0,
      title: formData.title,
      description: formData.description,
      creationDate: '',
      user: {
        userId: authStore.user?.userId || 0,
        username:  '',
        email:  '',
        bio:  ''
      },
      repliesCount: 0
    }

    await jsonApi.post('/api/discussions', discussionData)
    await fetchDiscussions()
    showCreateModal.value = false
  } catch (err) {
    error.value = 'Failed to create discussion'
    console.error(err)
  }
}
</script>

<style scoped>
.discussions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.discussions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.no-discussions {
  text-align: center;
  padding: 40px;
  background-color: var(--background-color);
  border-radius: 8px;
}

.error-message {
  color: red;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

</style>
