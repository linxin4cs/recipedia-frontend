<template>
  <div class="search-field">
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('submit')"
      :placeholder="placeholder"
    >
    <base-button 
      @click="$emit('submit')"
      :disabled="!modelValue?.trim()"
    >
      Search
    </base-button>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
})

defineEmits(['update:modelValue', 'submit'])
</script>

<style scoped>
.search-field {
  display: flex;
  gap: 10px;
  flex: 1;
}

.search-field input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.search-field input:focus {
  outline: none;
  border-color: var(--main-color);
}
</style>