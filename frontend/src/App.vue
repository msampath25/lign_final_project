<script setup>
import Header from './components/Header.vue';
import CourseLevel from './components/CourseLevel.vue';
import Department from './components/Department.vue';
import Prompt from './components/Prompt.vue'
import SubmitButton from './components/SubmitButton.vue';
import ClearConversation from './components/ClearConversation.vue';
import { ref, watchEffect, onMounted } from 'vue';
import Papa from 'papaparse';
import axios from 'axios';

// Generate a unique conversation ID for the session
const conversationId = ref(crypto.randomUUID());

// these are refs to store the data
const chatHistory = ref([
  { role: 'system', 
    content: `You are an academic advisor for UCSD. Your goal is to provide up to 5 course recommendations based on the user's input, CAPES data (capesSummary), and course info (courseDescriptions). 
    First look through the courseDescriptions to find appropriate classes. Then, from capesSummary, gather the percent who recommend class (P), hours of work per week (H), average grade received (GR), and top professor (TP) for the relevant courses. 
    Rank the results based on these metrics. Do not make up course names and descriptions, pull them from the courseDescriptions, which describes every course im capesSummary. There should be no missing values.`
  },
]);
const selectedLevels = ref(['lower', 'upper', 'graduate']);
const selectedDepartments = ref('');
const searchPrompt = ref('');
const openAIResponse = ref('');
const isLoading = ref(false);
const isResponseReceived = ref(false);

// Add watchEffect for debugging
watchEffect(() => {
  console.log('Current state:', {
    levels: selectedLevels.value,
    departments: selectedDepartments.value,
    prompt: searchPrompt.value,
    chatHistory: chatHistory.value
  })
})

const processCapesData = async () => {
  const capesFile = await fetch('/average_capes_data.csv');
  const text = await capesFile.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      complete: (results) => {
        // Extract relevant columns and structure data
        const summary = results.data.map((row) => ({
          C: row.C,
          R: row.R,
          H: row.H,
          GE: row.GE,
          GR: row.GR,
          P: row.P,
          PR: row.PR,
        }));
        resolve(summary); // Return the filtered and formatted data
      },
      error: (error) => reject(error),
    });
  });
};

const fetchCourseData = async (department, courseNamesFromCSV) => {
  const response = await fetch(`/${department}.html`);
  const htmlContent = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Extract course names and descriptions
  const courseNames = [...doc.querySelectorAll('.course-name')];
  const courseDescriptions = [...doc.querySelectorAll('.course-descriptions')];

  // Filter courses based on course codes in the CSV
  const filteredCourses = courseNames.map((courseEl, index) => {
    const fullCourseName = courseEl.textContent.trim();
    
    // Extract course code from the full name (e.g., "BENG 1 Intro to Bioengineering" -> "BENG 1")
    const courseCode = fullCourseName.split('.')[0].split('/')[0];  // Take only the first part (e.g., "BENG 1")

    // Check if the course code is in the list of course codes from the CSV
    if (courseNamesFromCSV.includes(courseCode)) {
      const descriptionEl = courseDescriptions[index];
      const description = descriptionEl ? descriptionEl.textContent.trim() : 'No description available';
      
      return { name: fullCourseName, description };
    }
    return null;
  }).filter(course => course !== null);  // Remove null values from the array

  return filteredCourses;  // Return the relevant data for the courses
};

// Function to handle submissions
const handleSubmit = async () => {
  isLoading.value = true;
  isResponseReceived.value = false;

  const capesData = await processCapesData();
  const courseNamesFromCSV = capesData.map(course => course.C);
  // Fetch course data for selected departments
  const courseData = [];
  const departmentCourses = await fetchCourseData(selectedDepartments.value, courseNamesFromCSV);
  console.log(departmentCourses)
  courseData.push(...departmentCourses);
  
  const userMessage = { 
    role: 'user', 
    content: JSON.stringify({
      levels: selectedLevels.value,
      departments: selectedDepartments.value,
      prompt: searchPrompt.value,
      capesSummary: capesData, // Include CAPES data
      courseDescriptions: courseData // Course website data
    })
  };

  chatHistory.value.push(userMessage); // Add user's message to chat history

  try {
    const response = await axios.post('http://localhost:3000/chat', {
      messages: chatHistory.value,
      conversationId: conversationId.value // Pass the conversation ID
    });

    if (response.data.success) {
      const aiResponse = response.data.message?.content || 'No recommendations found.';
      openAIResponse.value = aiResponse;

      // Add AI's response to the chat history for context in the next request
      chatHistory.value.push({ role: 'assistant', content: aiResponse });
    } else {
      throw new Error(response.data.error || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    openAIResponse.value = error.response?.data?.error || 'Failed to fetch recommendations';
  } finally {
    
    isLoading.value = false;
    isResponseReceived.value = true;
    searchPrompt.value = ''; // Clear the input prompt
  }
};

// Function to clear conversation
const clearConversation = async () => {
  try {
    await axios.post('http://localhost:3000/clear-conversation', {
      conversationId: conversationId.value // Pass the conversation ID to clear
    });
    
    // Reset everything
    chatHistory.value = [
      { role: 'system', 
        content: `You are an academic advisor for UCSD. Your goal is to provide up to 5 course recommendations based on the user's input, CAPES data (capesSummary), and course info (courseDescriptions). 
        First look through the courseDescriptions to find appropriate classes. Then, from capesSummary, gather the percent who recommend class (P), hours of work per week (H), average grade received (GR), and top professor (TP) for the relevant courses. 
        Rank the results based on these metrics. Do not make up course names and descriptions, pull them from the courseDescriptions, which describes every course im capesSummary. There should be no missing values.`
      },
    ];

    openAIResponse.value = '';
    searchPrompt.value = '';
    isResponseReceived.value = false;
    
    // Generate a new conversation ID
    conversationId.value = crypto.randomUUID();
    
    console.log('Conversation cleared');
  } catch (error) {
    console.error('Error clearing conversation:', error.message);
  }
};

// Optional: Persist conversation ID in local storage to maintain context across page reloads
onMounted(() => {
  // Check if there's a stored conversation ID
  const storedConversationId = localStorage.getItem('conversationId');
  
  if (storedConversationId) {
    conversationId.value = storedConversationId;
  } else {
    // Store the new conversation ID
    localStorage.setItem('conversationId', conversationId.value);
  }
});

function formatResponse(response) {
  // First, bold the course titles (any department code followed by numbers)
  let formatted = response.replace(/([A-Z]{2,4}\s+\d+[A-Z]?[^:\n]*)/g, '**$1**');
  
  // Italicize the descriptions that come after "Description:"
  formatted = formatted.replace(/Description: ([^-\n]+)/g, 'Description: _$1_');
  
  // Convert markdown to HTML
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  
  return formatted;
}
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

<template>
  <div class="app-container">
    <Header />

    <!-- Split Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8 py-8 h-full">
      <!-- Left Section: Filter, Prompt, and Buttons -->
      <div class="left-section flex flex-col gap-6">
        <!-- Filter Section -->
        <div class="filter-section bg-gray-800 p-4 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4 text-white">Filter Courses</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <CourseLevel v-model="selectedLevels" />
            <Department v-model="selectedDepartments" />
          </div>
        </div>

        <!-- Prompt Section -->
        <div class="prompt-section bg-gray-800 p-4 rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-4 text-white">Generate Search</h2>
          <Prompt v-model="searchPrompt" />
        </div>

        <!-- Button Section -->
        <div class="button-section flex gap-4 justify-center bg-gray-900 p-4 rounded shadow-lg">
          <SubmitButton class="w-1/2" @submit="handleSubmit" />
          <ClearConversation class="w-1/2" @clear="clearConversation" />
        </div>
      </div>

      <!-- Right Section: Response -->
      <div class="response-section bg-gray-800 p-4 rounded shadow-lg">
        <h2 class="text-lg font-semibold mb-2 text-white">Recommendations</h2>
        <div v-if="isLoading">Generating response...</div>
        <div
          v-else-if="isResponseReceived"
          v-html="openAIResponse.replace(/\*/g, '').replace(/\n/g, '<br>')"
        ></div>
        <div v-else>No response yet</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure full-screen usage */
.app-container {
  background-color: #ffffff;
  min-height: 100vh;
  color: #2c6596; /* Text color */
}

/* Adjust grid layout */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column by default */
  gap: 1.5rem;
  height: 100%;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr; /* Two equal columns for large screens */
  }
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-section,
.prompt-section,
.response-section,
.button-section {
  width: 100%;
  height: auto;
  padding: 1rem;
}

.button-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

input[type='checkbox'],
input[type='radio'] {
  accent-color: #4a5568; /* Gray */
}
</style>
