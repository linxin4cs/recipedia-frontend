<template>
  <button
    :class="[
      'base-button',
      `type-${type}`,
      { disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.type-primary {
  background-color: var(--main-color);
  color: white;
}

.type-primary:hover:not(.disabled) {
  background-color: var(--hover-color);
}

.type-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.type-secondary:hover:not(.disabled) {
  background-color: #d0d0d0;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>