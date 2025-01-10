<template>
  <form @submit.prevent="handleSubmit" class="create-discussion-form">
    <div class="form-group">
      <input
        v-model="formData.title"
        placeholder="Discussion Title"
        required
      />
    </div>
    <div class="form-group">
      <textarea
        v-model="formData.description"
        placeholder="Discussion Description"
        required
      ></textarea>
    </div>
    <div class="form-actions">
      <base-button type="secondary" @click="$emit('cancel')">
        Cancel
      </base-button>
      <base-button type="primary" :disabled="!isFormValid">
        Create
      </base-button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  title: '',
  description: ''
})

const isFormValid = computed(() => {
  return formData.value.title.trim() && formData.value.description.trim()
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  
  emit('submit', { ...formData.value })
  formData.value = { title: '', description: '' }
}
</script>

<style scoped>
.create-discussion-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
