<!-- Department.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectedDepartments = ref(props.modelValue)

// Course data
const courses = [
  { id: 1, name: 'BENG' },
  { id: 2, name: 'CSE' },
  { id: 3, name: 'DSC' },
  { id: 4, name: 'ECE' },
  { id: 5, name: 'LIGN' },
  { id: 6, name: 'MAE' },
  { id: 7, name: 'PSYC' }
]

const filteredCourses = computed(() => 
  courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const updateSelection = () => {
  console.log('Departments selected:', selectedDepartments.value) // Debug log
  emit('update:modelValue', selectedDepartments.value)
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
    <h3 class="text-lg font-medium mb-2">Department</h3>
    <ul class="list-none">
      <li v-for="department in departments" :key="department" class="mb-2">
        <label>
          <input
            type="radio"
            v-model="selectedDepartment"
            :value="department"
            class="mr-2"
          />
          {{ department }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      departments: [
        'BENG',
        'CSE',
        'DSC',
        'ECE',
        'LIGN',
        'MAE',
        'PSYC'
      ], // Original departments
    };
  },
  computed: {
    selectedDepartment: {
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

input[type='radio'] {
  accent-color: #4a5568; /* Gray */
}
</style>
