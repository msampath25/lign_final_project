<template>
    <div class="dropdown">
      <!-- Dropdown Button -->
      <button 
        @click="toggleDropdown" 
        class="dropdown-button"
      >
        {{ selectedDepartments.length ? `${selectedDepartments.length} Departments Selected` : 'Select Departments' }}
      </button>
  
      <!-- Dropdown Content -->
      <div 
        v-if="isOpen" 
        class="dropdown-content"
      >
        <!-- Search input -->
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search classes..."
            class="search-input"
          >
        </div>
  
        <!-- Class list with checkboxes -->
        <div class="class-list">
          <div 
            v-for="course in filteredCourses" 
            :key="course.id"
            class="dropdown-item"
          >
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                :value="course"
                v-model="selectedDepartments"
                @change="updateSelection"
              >
              <span class="course-name">{{ course.name }}</span>
            </label>
          </div>
        </div>
  
        <!-- Selected classes count -->
        <div class="selected-count" v-if="selectedDepartments.length">
          Selected: {{ selectedDepartments.length }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DeptButton',
    
    data() {
      return {
        isOpen: false,
        searchQuery: '',
        selectedDepartments: [],
        // Example course data - replace with your actual courses
        courses: [
          { id: 1, name: 'LING' },
          { id: 2, name: 'BENG' },
          { id: 3, name: 'CSE' },
          { id: 4, name: 'DSC' },
          { id: 5, name: 'MATH' },
        ]
      }
    },
  
    computed: {
      filteredCourses() {
        return this.courses.filter(course => 
          course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
    },
  
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
      },
  
      updateSelection() {
        // Emit selected classes to parent component
        this.$emit('classes-selected', this.selectedClasses)
      },
  
      // Optional: Click outside to close
      closeDropdown(e) {
        if (!this.$el.contains(e.target)) {
          this.isOpen = false
        }
      }
    },
  
    // Optional: Add event listener for clicking outside
    mounted() {
      document.addEventListener('click', this.closeDropdown)
    },
  
    beforeDestroy() {
      document.removeEventListener('click', this.closeDropdown)
    }
  }
  </script>
  
  <style scoped>
  .dropdown {
    position: relative;
    display: inline-block;
    min-width: 250px;
  }
  
  .dropdown-button {
    width: 100%;
    padding: 10px 20px;
    background-color: #4c57af;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
  }
  
  .dropdown-button:hover {
    background-color: #8b45a0;
  }
  
  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    border-radius: 4px;
    margin-top: 4px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .search-container {
    padding: 10px;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background-color: #fff;
  }
  
  .search-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .class-list {
    padding: 5px 0;
  }
  
  .dropdown-item {
    padding: 8px 16px;
  }
  
  .dropdown-item:hover {
    background-color: #f5f5f5;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
  }
  
  .course-name {
    font-size: 14px;
  }
  
  .selected-count {
    padding: 10px;
    background-color: #f5f5f5;
    border-top: 1px solid #eee;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  </style>