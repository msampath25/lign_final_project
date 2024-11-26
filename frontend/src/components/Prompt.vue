<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const promptText = ref('')
const wordCount = ref(0)

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const isNearLimit = computed(() => {
  return wordCount.value >= 450 && wordCount.value < 500
})

const isAtLimit = computed(() => {
  return wordCount.value >= 500
})

const handleInput = () => {
  // Count words
  const words = promptText.value.trim().split(/\s+/)
  wordCount.value = promptText.value.trim() ? words.length : 0

  // If over limit, truncate to last word under 500
  if (wordCount.value > 500) {
    const words = promptText.value.trim().split(/\s+/)
    promptText.value = words.slice(0, 500).join(' ')
  }

  // Emit the new value for v-model
  emit('update:modelValue', promptText.value)
}

const submitPrompt = () => {
  if (promptText.value.trim()) {
    emit('update:modelValue', promptText.value.trim())
  }
}

// Optional: Auto-resize textarea
const adjustTextareaHeight = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

// Sync promptText with modelValue
watch(() => props.modelValue, (newValue) => {
  promptText.value = newValue
})

onMounted(() => {
  // Initialize promptText with modelValue
  promptText.value = props.modelValue
})
</script>

<template>
  <div class="prompt-container">
    <label class="prompt-label">What are you looking for in your classes?</label>
    
    <textarea
      v-model="promptText"
      class="prompt-input"
      placeholder="Example: I'm looking for classes that focus on computational linguistics and natural language processing. I prefer project-based courses with hands-on programming experience..."
      @input="handleInput"
      @keyup="adjustTextareaHeight"
    ></textarea>
    
    <div class="word-count" :class="{ 'near-limit': isNearLimit, 'at-limit': isAtLimit }">
      {{ wordCount }} / 500 words
    </div>

    <div v-if="isAtLimit" class="limit-warning">
      You've reached the 500 word limit
    </div>
  </div>
</template>

<style scoped>
.prompt-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.prompt-label {
  display: block;
  font-size: 1.1em;
  margin-bottom: 10px;
  color: #ffffff;
  font-weight: 500;
}

.prompt-input {
  width: 100%;
  min-height: 200px;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.prompt-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.prompt-input::placeholder {
  color: #999;
  font-size: 0.9em;
}

.word-count {
  text-align: right;
  margin-top: 8px;
  color: #666;
  font-size: 0.9em;
}

.word-count.near-limit {
  color: #ff9800;
}

.word-count.at-limit {
  color: #f44336;
}

.limit-warning {
  color: #f44336;
  font-size: 0.9em;
  margin-top: 4px;
}

.submit-button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .prompt-container {
    padding: 10px;
  }
  
  .prompt-input {
    min-height: 150px;
  }
}
</style>