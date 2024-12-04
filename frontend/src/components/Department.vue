<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const departments = [
  'BENG',
  'CSE',
  'DSC',
  'ECE',
  'LIGN',
  'MAE',
  'PSYC'
];

// Keep the local state for UI updates
const selectedDepartment = ref(props.modelValue);

// Watch for changes from parent
watch(() => props.modelValue, (newValue) => {
  selectedDepartment.value = newValue;
});

// Watch for local changes and emit them
watch(selectedDepartment, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<template>
  <div>
    <h3 class="text-lg font-medium mb-2">Department</h3>
    <div class="grid grid-cols-2 gap-2">
      <label
        v-for="department in departments"
        :key="department"
        class="checkbox-container"
        :class="{ 'selected': selectedDepartment === department }"
      >
        <div class="text-content">
          <span class="name">{{ department }}</span>
        </div>
        <input
          type="radio"
          :value="department"
          v-model="selectedDepartment"
          name="department"
          class="radio-input"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.checkbox-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem; /* Increased padding */
  border: 1px solid #3a5576;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: white;
  transition: all 0.2s ease;
  min-width: 500px; /* Added minimum width */
  height: 80px; /* Added fixed height to make boxes larger */
  justify-content: space-between; /* Better spacing of content */
}

/* Rest of the styles remain the same */
.checkbox-container.selected {
  background-color: #3a5576;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 0.25rem;
}

.name {
  font-weight: 500;
  font-size: 0.875rem;
  color: #3a5576;
  transition: color 0.2s ease;
}

.checkbox-container.selected .name {
  color: #FFD700;
}

.radio-input {
  width: 14px;
  height: 14px;
  margin: 0;
  cursor: pointer;
}

.checkbox-container.selected .radio-input {
  accent-color: #FFD700;
}

.checkbox-container:hover {
  background-color: #f0f4f8;
}

.checkbox-container.selected:hover {
  background-color: #2c4259;
}
</style>