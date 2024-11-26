<script setup>
import CourseLevel from './components/CourseLevel.vue';
import Department from './components/Department.vue';
import Prompt from './components/Prompt.vue';
import { ref, watchEffect } from 'vue';

// these are refs to store the data
const selectedLevels = ref(['lower', 'upper', 'graduate']);
const selectedDepartments = ref([]);
const searchPrompt = ref('');

// Add watchEffect for debugging
watchEffect(() => {
  console.log('Current state:', {
    levels: selectedLevels.value,
    departments: selectedDepartments.value,
    prompt: searchPrompt.value
  })
})

// // handler function for logging/debugging
// const handleLevelsChange = (levels) => {
//   console.log('Levels changed:', levels);
//   selectedLevels.value = levels
// };

// const handleDepartmentsChange = (departments) => {
//   console.log('Departments changed:', departments);
//   selectedDepartments.value = departments
// };

// const handlePromptSubmit = (prompt) => {
//   console.log('Prompt submitted:', prompt);
//   searchPrompt.value = prompt
// };
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: none;
}

.filter-section, .prompt-section {
  background: none;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

/* Remove any potential overlays */
*::before, *::after {
  background: none;
}
</style><template>
  <div class="container mx-auto px-4 py-8" style="background: none;">
    <h1 class="text-3xl font-bold mb-8 text-center text-white bg-transparent">UCSD Course Search</h1>
    
    <div class="grid gap-6 max-w-2xl mx-auto">
      <!-- Filters Section -->
      <div class="filter-section space-y-4">
        <h2 class="text-xl font-semibold mb-4 text-white bg-transparent">Filter Courses</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <CourseLevel v-model="selectedLevels" />
          <Department v-model="selectedDepartments" />
        </div>
      </div>

      <!-- Prompt Section -->
      <div class="prompt-section mt-8">
        <h2 class="text-xl font-semibold mb-4 text-white bg-transparent">Generate Search</h2>
        <Prompt v-model="searchPrompt" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: none;
}

.filter-section, .prompt-section {
  background: none;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

/* Remove any potential overlays */
*::before, *::after {
  background: none;
}
</style>