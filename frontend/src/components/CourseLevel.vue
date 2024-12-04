<template>
  <div>
    <h3 class="text-lg font-medium mb-2">Course Level</h3>
    <label
      v-for="level in levels"
      :key="level.id"
      class="checkbox-container"
      :class="{ selected: selectedLevels.includes(level.value) }"
    >
      <div class="text-content">
        <span class="name">{{ level.name }}</span>
        <span class="description">{{ level.description }}</span>
      </div>
      <input
        type="checkbox"
        :value="level.value"
        v-model="selectedLevels"
      />
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const levels = [
  { id: 1, name: 'Lower Division', value: 'lower', description: '(1-99)' },
  { id: 2, name: 'Upper Division', value: 'upper', description: '(100-199)' },
  { id: 3, name: 'Graduate', value: 'graduate', description: '(200+)' }
];

const selectedLevels = ref([]);
</script>

<style scoped>
.checkbox-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #3a5576;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 120px;
  background-color: white;
  transition: all 0.2s ease;
}

.checkbox-container.selected {
  background-color: #3a5576;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5rem;
}

.name {
  font-weight: 500;
  font-size: 0.9rem;
}

.description {
  font-size: 0.8rem;
  color: #6b7280;
}

.checkbox-container.selected .name,
.checkbox-container.selected .description {
  color: #FFD700;
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
}

.checkbox-container.selected input[type="checkbox"] {
  accent-color: #FFD700;
}
</style>