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
  <div>
    <h3 class="text-lg font-medium mb-2">Course Level</h3>
    <ul class="list-none">
      <li v-for="level in courseLevels" :key="level" class="mb-2">
        <label>
          <input
            type="checkbox"
            v-model="selectedLevels"
            :value="level"
            class="mr-2"
          />
          {{ level }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      courseLevels: ['Lower Division (1-99)', 'Upper Division (100-199)', 'Graduate (200+)'], // Original levels
    };
  },
  computed: {
    selectedLevels: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>

<style scoped>
.list-none {
  list-style: none;
  padding: 0;
}

label {
  cursor: pointer;
  display: flex;
  align-items: center;
}

input[type='checkbox'] {
  accent-color: #4a5568; /* Gray */
}
</style>
