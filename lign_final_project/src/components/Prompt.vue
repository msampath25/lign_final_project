<template>
    <div class="prompt-container">
      <label class="prompt-label">What are you looking for in your classes?</label>
      
      <textarea
        v-model="promptText"
        class="prompt-input"
        placeholder="Example: I'm looking for classes that focus on computational linguistics and natural language processing. I prefer project-based courses with hands-on programming experience..."
        @input="handleInput"
      ></textarea>
      
      <div class="word-count" :class="{ 'near-limit': isNearLimit, 'at-limit': isAtLimit }">
        {{ wordCount }} / 500 words
      </div>
  
      <div v-if="isAtLimit" class="limit-warning">
        You've reached the 500 word limit
      </div>
      
      <button 
        @click="submitPrompt" 
        class="submit-button"
        :disabled="!promptText.trim()"
      >
        Submit Search Criteria
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchPrompt',
    
    data() {
      return {
        promptText: '',
        wordCount: 0
      }
    },
  
    computed: {
      isNearLimit() {
        return this.wordCount >= 450 && this.wordCount < 500
      },
      
      isAtLimit() {
        return this.wordCount >= 500
      }
    },
  
    methods: {
      handleInput() {
        // Count words
        const words = this.promptText.trim().split(/\s+/)
        this.wordCount = this.promptText.trim() ? words.length : 0
  
        // If over limit, truncate to last word under 500
        if (this.wordCount > 500) {
          const words = this.promptText.trim().split(/\s+/)
          this.promptText = words.slice(0, 500).join(' ')
        }
  
        // Save to localStorage
        localStorage.setItem('searchPrompt', this.promptText)
      },
  
      submitPrompt() {
        if (this.promptText.trim()) {
          this.$emit('prompt-submitted', this.promptText.trim())
        }
      },
  
      // Optional: Auto-resize textarea
      adjustTextareaHeight(event) {
        const textarea = event.target
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    },
  
    mounted() {
      // Load saved prompt if exists
      const savedPrompt = localStorage.getItem('searchPrompt')
      if (savedPrompt) {
        this.promptText = savedPrompt
        this.handleInput() // Update word count
      }
    }
  }
  </script>
  
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
    color: #333;
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