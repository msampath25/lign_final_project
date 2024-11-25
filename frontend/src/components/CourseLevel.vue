<template>
    <div class="course-level-selector">
      <button 
        @click="toggleDropdown" 
        class="level-button"
      >
        {{ getSelectedLevelsText }}
      </button>
  
      <div 
        v-if="isOpen" 
        class="level-content"
      >
        <!-- Multiple selection with checkboxes -->
        <div class="level-options">
          <label class="level-option">
            <input 
              type="checkbox"
              v-model="selectedLevels"
              value="lower"
            >
            Lower Division (1-99)
          </label>
  
          <label class="level-option">
            <input 
              type="checkbox"
              v-model="selectedLevels"
              value="upper"
            >
            Upper Division (100-199)
          </label>
  
          <label class="level-option">
            <input 
              type="checkbox"
              v-model="selectedLevels"
              value="graduate"
            >
            Graduate (200+)
          </label>
        </div>
  
        <!-- Optional: Add a select/deselect all option -->
        <div class="select-all">
          <label>
            <input 
              type="checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
            >
            Select All
          </label>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CourseLevel',
    
    data() {
      return {
        isOpen: false,
        selectedLevels: [],
        selectAll: false
      }
    },
  
    computed: {
      getSelectedLevelsText() {
        if (this.selectedLevels.length === 0) {
          return 'Select Course Levels'
        }
        if (this.selectedLevels.length === 3) {
          return 'All Levels Selected'
        }
        const levelNames = {
          lower: 'Lower Division',
          upper: 'Upper Division',
          graduate: 'Graduate'
        }
        return this.selectedLevels.map(level => levelNames[level]).join(', ')
      }
    },
  
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
      },
  
      toggleSelectAll() {
        if (this.selectAll) {
          this.selectedLevels = ['lower', 'upper', 'graduate']
        } else {
          this.selectedLevels = []
        }
        this.updateSelection()
      },
  
      updateSelection() {
        // Save to localStorage
        localStorage.setItem('selectedLevels', JSON.stringify(this.selectedLevels))
        // Emit to parent
        this.$emit('levels-selected', this.selectedLevels)
      },
  
      closeDropdown(e) {
        if (!this.$el.contains(e.target)) {
          this.isOpen = false
        }
      }
    },
  
    watch: {
      selectedLevels: {
        handler(newVal) {
          this.selectAll = newVal.length === 3
          this.updateSelection()
        },
        deep: true
      }
    },
  
    mounted() {
      // Load saved selections
      const savedLevels = localStorage.getItem('selectedLevels')
      if (savedLevels) {
        this.selectedLevels = JSON.parse(savedLevels)
      }
      document.addEventListener('click', this.closeDropdown)
    },
  
    beforeDestroy() {
      document.removeEventListener('click', this.closeDropdown)
    }
  }
  </script>
  
  <style scoped>
  .course-level-selector {
    position: relative;
    display: inline-block;
    min-width: 200px;
  }
  
  .level-button {
    width: 100%;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
  }
  
  .level-button:hover {
    background-color: #45a049;
  }
  
  .level-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
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
    background-color: #f9f9f9;
  }
  
  input[type="checkbox"] {
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
    user-select: none;
  }
  </style>