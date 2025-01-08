<template>
  <transition name="fade">
    <div 
      v-if="show"
      class="alert"
      :class="type"
    >
      {{ message }}
      <button class="close" @click="$emit('close')">&times;</button>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: value => ['info', 'success', 'warning', 'error'].includes(value)
  },
  show: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.alert {
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
}

.alert.info {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.alert.success {
  background-color: #e8f5e9;
  color: #1b5e20;
}

.alert.warning {
  background-color: #fff3e0;
  color: #e65100;
}

.alert.error {
  background-color: #ffebee;
  color: #b71c1c;
}

.close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 