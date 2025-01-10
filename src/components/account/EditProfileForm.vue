<template>
  <form @submit.prevent="handleSubmit" class="edit-profile-form">
    <div class="form-group">
      <input
        v-model="formData.username"
        placeholder="Username"
        required
      />
    </div>

    <div class="form-group">
      <input
        v-model="formData.email"
        placeholder="Email"
        type="email"
        required
      />
    </div>

    <div class="form-group">
      <textarea
        v-model="formData.bio"
        placeholder="Bio"
      ></textarea>
    </div>

    <div class="form-actions">
      <base-button
        type="secondary"
        class="cancel-btn"
        @click="$emit('cancel')"
      >
        Cancel
      </base-button>
      <base-button
        type="primary"
        :disabled="!isFormValid"
      >
        Save Changes
      </base-button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  initialData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  username: props.initialData.username,
  email: props.initialData.email,
  bio: props.initialData.bio
})

const hasChanges = computed(() => {
  return formData.value.username !== props.initialData.username ||
         formData.value.email !== props.initialData.email ||
         formData.value.bio !== props.initialData.bio
})

const isFormValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return formData.value.username.trim() && emailRegex.test(formData.value.email) && hasChanges.value
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  emit('submit', { ...formData.value })
}
</script>

<style scoped>
.edit-profile-form {
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
