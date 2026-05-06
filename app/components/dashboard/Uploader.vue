<template>
  <div class="h-full w-full min-h-0 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col p-4 relative overflow-hidden">
    
    <!-- Header & Toggle Dev Mode -->
    <div class="flex justify-between items-center mb-3 shrink-0">
      <h3 class="text-xs font-bold text-slate-800 font-mono-tech uppercase tracking-wider flex items-center gap-2">
        <UploadCloud class="w-4 h-4" /> Data Ingestion
      </h3>
      <button @click="devMode = !devMode" :class="['text-[9px] font-mono-tech px-2 py-1 rounded border', devMode ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100']">
        DEV MODE
      </button>
    </div>
    
    <!-- Area Normal: Drag & Drop ATAU Staging -->
    <div v-if="!devMode" class="flex-1 min-h-0 flex flex-col relative">
      <!-- State 1: Staging Area -->
      <div v-if="stagedFile" class="flex-1 border-2 border-emerald-400 bg-emerald-50 rounded-lg flex flex-col items-center justify-center p-4 relative">
        <button @click="stagedFile = null" class="absolute top-2 right-2 p-1 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm">
          <X class="w-4 h-4" />
        </button>
        <FileCheck class="w-8 h-8 text-emerald-500 mb-2" />
        <span class="text-sm font-bold text-slate-700 truncate w-full text-center">{{ stagedFile.name }}</span>
        <span class="text-[10px] text-slate-500 mb-4">{{ (stagedFile.size / 1024 / 1024).toFixed(2) }} MB</span>
        <button @click="transmitData" :disabled="isUploading" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono-tech tracking-widest rounded shadow-md disabled:opacity-50 flex items-center gap-2">
          <Loader2 v-if="isUploading" class="w-4 h-4 animate-spin" />
          {{ isUploading ? 'TRANSMITTING...' : 'TRANSMIT DATA' }}
        </button>
      </div>

      <!-- State 2: Input Kosong -->
      <div v-else @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop" @click="triggerFileInput" :class="['flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer', isDragging ? 'border-sky-400 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100']">
        <input type="file" ref="fileInput" class="hidden" @change="handleFileSelect" />
        <FileUp class="w-8 h-8 text-slate-400 mb-1 transition-transform group-hover:-translate-y-1" />
        <span class="text-sm font-medium text-slate-700">Drop file or click to browse</span>
      </div>
    </div>

    <!-- Area Dev Mode: Skenario Pengujian -->
    <div v-else class="flex-1 min-h-0 border-2 border-indigo-200 bg-indigo-50/50 rounded-lg p-3 flex flex-col gap-2 overflow-y-auto">
      <!-- <p class="text-[10px] font-mono-tech text-indigo-500 font-bold mb-1 text-center">SYSTEM STRESS TEST SUITE</p>
       -->
      <button @click="simulateBurst" :disabled="isUploading" class="flex items-center gap-3 p-2 bg-white border border-indigo-200 rounded hover:bg-indigo-50 transition-colors text-left">
        <Zap class="w-5 h-5 text-yellow-500 shrink-0" />
        <div>
          <p class="text-xs font-bold text-slate-700">Burst Traffic (10x)</p>
          <p class="text-[8px] text-slate-500">Inject 10 dummy jobs simultaneously</p>
        </div>
      </button>

      <button @click="simulateChaos" :disabled="isUploading" class="flex items-center gap-3 p-2 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors text-left">
        <Skull class="w-5 h-5 text-red-500 shrink-0" />
        <div>
          <p class="text-xs font-bold text-red-700">Inject Chaos</p>
          <p class="text-[8px] text-red-500">Force worker to fail and route to DLQ</p>
        </div>
      </button>

      <button @click="simulateHeavy" :disabled="isUploading" class="flex items-center gap-3 p-2 bg-white border border-sky-200 rounded hover:bg-sky-50 transition-colors text-left">
        <Hourglass class="w-5 h-5 text-sky-500 shrink-0" />
        <div>
          <p class="text-xs font-bold text-sky-700">Heavy Computation</p>
          <p class="text-[8px] text-sky-600">Simulate 15-second slow processing</p>
        </div>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud, FileUp, Loader2, X, FileCheck, Zap, Skull, Hourglass } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useJobStore } from '~/stores/job'
import { useRuntimeConfig } from '#app'

const emit = defineEmits(['transmitted'])

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const stagedFile = ref<File | null>(null)
const devMode = ref(false)

const authStore = useAuthStore()
const jobStore = useJobStore()
const config = useRuntimeConfig()
const baseURL = config.public.apiBase || 'http://localhost:8080'

const triggerFileInput = () => fileInput.value?.click()
const handleDrop = (e: DragEvent) => { isDragging.value = false; if (e.dataTransfer?.files[0]) stagedFile.value = e.dataTransfer.files[0] }
const handleFileSelect = (e: Event) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) stagedFile.value = f; if(fileInput.value) fileInput.value.value = '' }

// 1. Eksekusi Normal
const transmitData = async () => {
  if (!stagedFile.value || isUploading.value) return
  isUploading.value = true
  const formData = new FormData()
  formData.append('file', stagedFile.value)

  try {
    const response = await $fetch<any>(`${baseURL}/api/v1/jobs/upload`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${authStore.token}` }, body: formData
    })
    if (response.job_id) {
      jobStore.addJob({ job_id: response.job_id, filename: stagedFile.value.name, status: 'PENDING' })
      emit('transmitted', response.job_id) // Beri tahu dashboard untuk memulai animasi optimistik!
    }
  } catch (error: any) {
    jobStore.addLog(`[Client] Upload failed: ${error.message}`, 'error')
  } finally {
    isUploading.value = false
    stagedFile.value = null
  }
}

// 2. Skenario Uji: Helper Pembuat Dummy File
const createDummyBlob = (name: string) => new File(["dummy data orchestrator test"], name, { type: "text/plain" })

const executeTest = async (file: File, endpointSuffix: string = '') => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await $fetch<any>(`${baseURL}/api/v1/jobs/upload${endpointSuffix}`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${authStore.token}` }, body: formData
    })
    if (response.job_id) {
      jobStore.addJob({ job_id: response.job_id, filename: file.name, status: 'PENDING' })
      emit('transmitted', response.job_id)
    }
  } catch (error: any) {
    jobStore.addLog(`[Test] Execution failed: ${error.message}`, 'error')
  }
}

// 3. Eksekusi Skenario
const simulateBurst = async () => {
  isUploading.value = true
  jobStore.addLog(`[System] Initiating Burst Traffic Test (10x)...`, 'warning')
  for(let i=1; i<=10; i++) {
    await executeTest(createDummyBlob(`burst_payload_${i}.bin`))
    await new Promise(r => setTimeout(r, 200)) // Jeda 200ms antar tembakan agar visual bagus
  }
  isUploading.value = false
}

const simulateChaos = async () => {
  isUploading.value = true
  jobStore.addLog(`[System] Injecting Poison Pill for DLQ test...`, 'critical')
  // Menambahkan parameter ?chaos=true (Backend perlu diatur untuk merespons parameter ini jika ada)
  await executeTest(createDummyBlob('poison_pill.bin'), '?force_error=true')
  isUploading.value = false
}

const simulateHeavy = async () => {
  isUploading.value = true
  jobStore.addLog(`[System] Dispatching Heavy Computation Matrix...`, 'info')
  await executeTest(createDummyBlob('heavy_matrix.data'), '?heavy=true')
  isUploading.value = false
}
</script>