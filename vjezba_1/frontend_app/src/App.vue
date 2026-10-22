<script setup>
import { ref } from 'vue'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

// U Zadatku 2 ovdje stavljamo stvarni URL vašeg backend-a na Renderu
const BACKEND_URL = 'https://rs-vjezbe-backend.onrender.com/'

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
  <div class="page-wrapper">
    <div class="card">
      <header class="card-header">
        <span class="badge">Vježba 1</span>
        <h1>Raspodijeljeni sustavi</h1>
        <h2>Vue.js Frontend Aplikacija</h2>
      </header>
      
      <div class="action-area">
        <button @click="fetchData" :disabled="loading" class="btn-primary">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Učitavanje...' : 'Pozovi Backend API' }}</span>
        </button>
      </div>

      <!-- Prikaz greške -->
      <transition name="fade">
        <div v-if="error" class="status-box error-box">
          <div class="status-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <strong>Greška prilikom dohvaćanja:</strong>
          </div>
          <p class="error-message">{{ error }}</p>
          <small class="error-help">(Backend još nije postavljen ili je URL pogrešan)</small>
        </div>
      </transition>

      <!-- Prikaz rezultata -->
      <transition name="fade">
        <div v-if="data" class="status-box result-box">
          <div class="status-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <strong>Odgovor s poslužitelja:</strong>
          </div>
          <pre><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Pozadina i glavna struktura */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

/* Glavna kartica */
.card {
  background: #ffffff;
  width: 100%;
  max-width: 580px;
  padding: 36px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(14, 116, 144, 0.1), 0 8px 10px -6px rgba(14, 116, 144, 0.05);
  text-align: center;
}

/* Zaglavlje */
.card-header {
  margin-bottom: 28px;
}

.badge {
  display: inline-block;
  background-color: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

h1 {
  margin: 0 0 6px 0;
  font-size: 26px;
  color: #0f172a;
  font-weight: 700;
}

h2 {
  margin: 0;
  font-size: 16px;
  color: #0284c7;
  font-weight: 500;
}

/* Interaktivni gumb */
.action-area {
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  background-color: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background-color: #0369a1;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

/* Spinner animacija */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Okviri za status (rezultat i greška) */
.status-box {
  margin-top: 20px;
  padding: 18px;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
}

.status-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

/* Greška */
.error-box {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.error-title svg {
  stroke: #dc2626;
}

.error-message {
  margin: 4px 0;
  font-weight: 500;
}

.error-help {
  display: block;
  color: #b91c1c;
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.8;
}

/* Rezultat */
.result-box {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
}

.result-box .status-title svg {
  stroke: #0284c7;
}

pre {
  margin: 10px 0 0 0;
  background-color: #0f172a;
  color: #38bdf8;
  padding: 14px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  font-size: 13px;
  line-height: 1.5;
}

/* Animacije prikaza */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>