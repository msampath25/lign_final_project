<!-- SubmitButton.vue -->
<script setup>
const emit = defineEmits(['submit'])

const handleClick = () => {
  emit('submit')
}
</script>

<template>
  <button
    class="submit-button"
    @click="$emit('submit')"
  >
    Submit
  </button>
</template>

<style scoped>
.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease-in-out;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
