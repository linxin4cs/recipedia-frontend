<template>
  <form @submit.prevent="handleSubmit" class="create-challenge-form">
    <div class="form-group">
      <label for="title">Challenge Title</label>
      <input 
        id="title"
        v-model="formData.title"
        type="text"
        required
        class="form-control"
        placeholder="Enter challenge title"
      >
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        required
        class="form-control"
        rows="4"
        placeholder="Describe your challenge"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="startDate">Start Date</label>
      <input
        id="startDate"
        v-model="formData.startDate"
        type="date"
        required
        class="form-control"
        :min="today"
      >
    </div>

    <div class="form-group">
      <label for="endDate">End Date</label>
      <input
        id="endDate"
        v-model="formData.endDate"
        type="date"
        required
        class="form-control"
        :min="formData.startDate || today"
      >
    </div>

    <div class="form-actions">
      <base-button type="button" @click="$emit('cancel')" class="cancel-btn">
        Cancel
      </base-button>
      <base-button type="submit">
        Create Challenge
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
  description: '',
  startDate: '',
  endDate: ''
})

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    startDate: new Date(formData.value.startDate).toISOString(),
    endDate: new Date(formData.value.endDate).toISOString()
  })
}
</script>

<style scoped>
.create-challenge-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #666;
}

.cancel-btn:hover {
  background-color: #555;
}
</style> 