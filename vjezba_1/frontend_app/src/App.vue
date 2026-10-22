<script setup>
import { ref, computed } from 'vue'

// URL tvog backend-a
const BACKEND_URL = 'https://rs-vjezbe-backend.onrender.com/api/poruka'

// Stanja
const requestsCount = ref(5) // Zadana količina zahtjeva za serijski poziv
const loading = ref(false)
const results = ref([]) // Pohrana rezultata svakog zahtjeva: { id, status, data, error, time }

// Izračunata statistika
const totalRequests = computed(() => results.value.length)
const successCount = computed(() => results.value.filter(r => r.status === 'success').length)
const errorCount = computed(() => results.value.filter(r => r.status === 'error').length)

// Pomoćna funkcija za slanje JEDNOG zahtjeva
const sendSingleRequest = async (id) => {
  const startTime = performance.now()
  try {
    const response = await fetch(BACKEND_URL)
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)

    if (!response.ok) {
      throw new Error(`Greška HTTP ${response.status}`)
    }
    const data = await response.json()
    return {
      id,
      status: 'success',
      data,
      error: null,
      duration
    }
  } catch (err) {
    const endTime = performance.now()
    return {
      id,
      status: 'error',
      data: null,
      error: err.message,
      duration: Math.round(endTime - startTime)
    }
  }
}

// 1. Poziv JEDNOG zahtjeva
const fetchOne = async () => {
  loading.value = true
  results.value = []
  const res = await sendSingleRequest(1)
  results.value = [res]
  loading.value = false
}

// 2. Poziv VIŠE zahtjeva odjednom (Paralelno pomoću Promise.all)
const fetchMultiple = async () => {
  if (requestsCount.value < 1) return
  
  loading.value = true
  results.value = []

  // Kreiramo niz obećanja (promises)
  const promises = []
  for (let i = 1; i <= requestsCount.value; i++) {
    promises.push(sendSingleRequest(i))
  }

  // Izvršavamo sve zahtjeve u isto vrijeme
  const responses = await Promise.all(promises)
  results.value = responses
  loading.value = false
}
</script>

<template>
  <div class="page-wrapper">
    <div class="card">
      <header class="card-header">
        <span class="badge">Vježba 1 — Testiranje Opterećenja</span>
        <h1>Raspodijeljeni sustavi</h1>
        <h2>Slanje višestrukih API zahtjeva</h2>
      </header>

      <!-- Upravljačka ploča -->
      <div class="controls-area">
        <div class="input-group">
          <label for="countInput">Broj zahtjeva:</label>
          <input 
            id="countInput"
            type="number" 
            v-model.number="requestsCount" 
            min="1" 
            max="20"
            :disabled="loading"
          />
        </div>

        <div class="button-group">
          <button @click="fetchOne" :disabled="loading" class="btn-secondary">
            Pošalji 1 zahtjev
          </button>
          
          <button @click="fetchMultiple" :disabled="loading" class="btn-primary">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'Slanje...' : `Pošalji ${requestsCount} zahtjeva` }}</span>
          </button>
        </div>
      </div>

      <!-- Statistika (prikazuje se nakon slanja) -->
      <transition name="fade">
        <div v-if="totalRequests > 0" class="stats-bar">
          <div class="stat-item">
            <span class="stat-label">Ukupno:</span>
            <span class="stat-value">{{ totalRequests }}</span>
          </div>
          <div class="stat-item success">
            <span class="stat-label">Uspješno:</span>
            <span class="stat-value">{{ successCount }}</span>
          </div>
          <div class="stat-item error" v-if="errorCount > 0">
            <span class="stat-label">Neuspješno:</span>
            <span class="stat-value">{{ errorCount }}</span>
          </div>
        </div>
      </transition>

      <!-- Lista Rezultata -->
      <transition name="fade">
        <div v-if="results.length > 0" class="results-container">
          <h3>Rezultati zahtjeva:</h3>
          
          <div 
            v-for="item in results" 
            :key="item.id" 
            class="result-card"
            :class="item.status"
          >
            <div class="result-header">
              <span class="request-id">Zahtjev #{{ item.id }}</span>
              <span class="duration-tag">{{ item.duration }} ms</span>
            </div>

            <!-- Sadržaj ako je uspješno -->
            <div v-if="item.status === 'success'" class="result-body">
              <pre><code>{{ JSON.stringify(item.data, null, 2) }}</code></pre>
            </div>

            <!-- Sadržaj ako je greška -->
            <div v-else class="result-body error-text">
              <strong>Neuspješno:</strong> {{ item.error }}
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Pozadina i osnova */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* Glavna kartica */
.card {
  background: #ffffff;
  width: 100%;
  max-width: 650px;
  padding: 36px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(14, 116, 144, 0.1), 0 8px 10px -6px rgba(14, 116, 144, 0.05);
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.badge {
  display: inline-block;
  background-color: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

h1 {
  margin: 0 0 6px 0;
  font-size: 24px;
  color: #0f172a;
  font-weight: 700;
}

h2 {
  margin: 0;
  font-size: 15px;
  color: #0284c7;
  font-weight: 500;
}

/* Upravljačke kontrole */
.controls-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.input-group input {
  width: 70px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: #0284c7;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #0284c7;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background-color: #0369a1;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #334155;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #cbd5e1;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Spinner */
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

/* Traka za statistiku */
.stats-bar {
  display: flex;
  justify-content: space-around;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #0369a1;
}

.stat-value {
  font-weight: 700;
}

.stat-item.success .stat-value {
  color: #16a34a;
}

.stat-item.error .stat-value {
  color: #dc2626;
}

/* Lista rezultata */
.results-container h3 {
  font-size: 16px;
  color: #1e293b;
  margin-bottom: 12px;
}

.result-card {
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 12px 16px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.result-card.success {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}

.result-card.error {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}

.request-id {
  color: #475569;
}

.duration-tag {
  background-color: #e2e8f0;
  color: #334155;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.error-text {
  color: #dc2626;
  font-size: 13px;
}

pre {
  margin: 0;
  background-color: #0f172a;
  color: #38bdf8;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 12px;
  line-height: 1.4;
}

/* Animacije */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>