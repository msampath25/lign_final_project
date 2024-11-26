<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'  // Removed watch

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)
const selectedLevels = ref(props.modelValue)
const selectAll = ref(false)

// Course level data
const levels = [
  { id: 1, name: 'Lower Division', value: 'lower', description: '(1-99)' },
  { id: 2, name: 'Upper Division', value: 'upper', description: '(100-199)' },
  { id: 3, name: 'Graduate', value: 'graduate', description: '(200+)' }
]

// Computed property for button text
const getSelectedLevelsText = computed(() => {
  if (selectedLevels.value.length === 0) {
    return 'Select Course Levels'
  }
  if (selectedLevels.value.length === levels.length) {
    return 'All Levels Selected'
  }
  return `${selectedLevels.value.length} Levels Selected`
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const updateSelection = () => {
  // Update selectAll state here instead of using watch
  selectAll.value = selectedLevels.value.length === 3
  emit('update:modelValue', selectedLevels.value)
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedLevels.value = ['lower', 'upper', 'graduate']
  } else {
    selectedLevels.value = []
  }
  updateSelection()
}

// Optional: Click outside to close
const closeDropdown = (e) => {
  if (!e.target.closest('.dropdown')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="dropdown">
    <button 
      @click="toggleDropdown" 
      class="dropdown-button"
    >
      {{ getSelectedLevelsText }}
    </button>

    <div 
      v-if="isOpen" 
      class="dropdown-content"
    >
      <div class="class-list">
        <div 
          v-for="level in levels" 
          :key="level.id"
          class="dropdown-item"
        >
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              :value="level.value"
              v-model="selectedLevels"
              @change="updateSelection"
            >
            <span class="course-name">{{ level.name }} {{ level.description }}</span>
          </label>
        </div>
      </div>

      <div class="select-all">
        <label class="checkbox-label">
          <input 
            type="checkbox"
            v-model="selectAll"
            @change="toggleSelectAll"
          >
          <span class="course-name">Select All</span>
        </label>
      </div>
    </div>
  </div>
</template>
  <style scoped>
  .course-level-selector {
    position: relative;
    display: inline-block;
    min-width: 200px;
  }
  
  .level-button {
    width: 100%;
    padding: 10px 20px;
    background-color: #056469;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
  }
  
  .level-button:hover {
    background-color: #17801c;
  }
  
  .level-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #000000;
    box-shadow: 0px 8px 16px 0px rgba(156, 15, 15, 0.2);
    border-radius: 4px;
    margin-top: 4px;
    z-index: 1;
  }
  
  .level-options {
    padding: 10px;
  }
  
  .level-option {
    display: block;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .level-option:hover {
    background-color: #f5f5f5;
  }
  
  .select-all {
    padding: 10px;
    border-top: 1px solid #eee;
    background-color: #090000;
  }
  
  input[type="checkbox"] {
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
    user-select: none;
  }
  </style>