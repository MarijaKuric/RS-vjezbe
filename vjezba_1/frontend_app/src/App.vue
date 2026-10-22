<script setup>
import { ref } from 'vue'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

// U Zadatku 2 ovdje stavljamo stvarni URL vašeg backend-a na Renderu
const BACKEND_URL = 'https://rs-vjezbe-backend.onrender.com/api/poruka'

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(BACKEND_URL)
    if (!response.ok) {
      throw new Error(`Greška: ${response.status}`)
    }
    const result = await response.json()
    data.value = result
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>Raspodijeljeni sustavi - Vježba 1</h1>
    <h2>Vue.js Frontend Aplikacija</h2>
    
    <button @click="fetchData" :disabled="loading">
      {{ loading ? 'Učitavanje...' : 'Pozovi Backend API' }}
    </button>

    <div v-if="error" class="error-box">
      <p><strong>Greška prilikom dohvaćanja:</strong> {{ error }}</p>
      <small>(Backend još nije postavljen ili je URL pogrešan)</small>
    </div>

    <div v-if="data" class="result-box">
      <h3>Odgovor s poslužitelja:</h3>
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #33a06f;
}

button:disabled {
  background-color: #ccc;
}

.error-box {
  margin-top: 20px;
  color: #d9534f;
  background-color: #fdf7f7;
  padding: 10px;
  border: 1px solid #d9534f;
  border-radius: 4px;
}

.result-box {
  margin-top: 20px;
  text-align: left;
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 6px;
  color: #333;
}
</style>