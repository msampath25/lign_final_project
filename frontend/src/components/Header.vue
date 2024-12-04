<template>
    <header class="header">
      <div class="header-content">
        <h1>UCSD Course Search</h1>
        <img src="@/assets/sunny_g.jpg" alt="UCSD Logo" class="logo">
      </div>
      <nav>
        <p>Search and explore UCSD courses by department, requirements, and keywords</p>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header'
  }
  </script>
  
  <style scoped>
  .header {
    background-color: #ffffff;
    padding: 20px;
    color: #3a5576;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-content h1 {
    font-weight: bolder;
  }

  .header p {
    font-weight: bold;
  }
  
  .logo {
    height: 75px; /* Adjust this value based on your logo size */
    width: auto;
  }
  </style>