<!-- ClearConversation.vue -->
<script setup>
const emit = defineEmits(['clear']);

const handleClick = () => {
  emit('clear');
};
</script>

<template>
  <button
    class="clear-button"
    @click="handleClick"
  >
    Clear Conversation
  </button>
</template>

<style scoped>
.clear-button {
  background-color: #E53935; /* Red background */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease-in-out;
}

.clear-button:hover {
  background-color: #D32F2F; /* Slightly darker red on hover */
}
</style>