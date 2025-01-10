<template>
  <form @submit.prevent="handleSubmit" class="change-password-form">
    <div class="form-group">
      <input
        type="password"
        v-model="passwordData.currentPassword"
        placeholder="Current Password"
        required
      />
    </div>

    <div class="form-group">
      <input
        type="password"
        v-model="passwordData.newPassword"
        placeholder="New Password"
        required
      />
    </div>

    <div class="form-group">
      <input
        type="password"
        v-model="passwordData.confirmPassword"
        placeholder="Confirm Password"
        required
      />
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
        :disabled="!isPasswordDataValid"
      >
        Save Password
      </base-button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['submit', 'cancel'])

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isPasswordDataValid = computed(() => {
  return (
    passwordData.value.currentPassword.trim() &&
    passwordData.value.newPassword.trim() &&
    passwordData.value.confirmPassword.trim() &&
    passwordData.value.newPassword === passwordData.value.confirmPassword
  )
})

const handleSubmit = () => {
  if (!isPasswordDataValid.value) return

  emit('submit', {
    oldPassword: passwordData.value.currentPassword,
    newPassword: passwordData.value.newPassword
  })
}
</script>

<style scoped>
.change-password-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
