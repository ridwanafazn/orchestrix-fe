<template>
  <div class="h-full w-full bg-white border border-slate-200 rounded-xl shadow-paper flex flex-col p-5">
    <h3 class="text-xs font-bold text-slate-800 font-serif-doc mb-3 uppercase tracking-wider flex items-center gap-2">
      <UploadCloud class="w-4 h-4" /> Data Ingestion
    </h3>
    
    <!-- Drag & Drop Area -->
    <div 
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      :class="[ 
        'flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden',
        isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
      ]"
      @click="triggerFileInput"
    >
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        @change="handleFileSelect"
        accept="image/png, image/jpeg, application/pdf"
      />
      
      <div v-if="isUploading" class="flex flex-col items-center text-emerald-600 gap-2">
        <Loader2 class="w-8 h-8 animate-spin" />
        <span class="text-xs font-mono-tech font-bold">TRANSMITTING...</span>
      </div>
      
      <div v-else class="flex flex-col items-center text-slate-500 gap-2 p-4 text-center">
        <FileUp class="w-8 h-8 text-slate-400 mb-1" />
        <span class="text-sm font-medium text-slate-700">Drop file or click to browse</span>
        <span class="text-[10px] font-mono-tech text-slate-400">JPG, PNG, PDF (Max 5MB)</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud, FileUp, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useJobStore } from '~/stores/job'

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)

const authStore = useAuthStore()
const jobStore = useJobStore()
const config = useRuntimeConfig()

const triggerFileInput = () => {
  if (!isUploading.value) fileInput.value?.click()
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) uploadFile(file)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) uploadFile(file)
  if (fileInput.value) fileInput.value.value = '' // Reset input
}

const uploadFile = async (file: File) => {
  if (isUploading.value) return
  isUploading.value = true

  const formData = new FormData()
  formData.append('file', file)

  try {
    const baseURL = config.public.apiBase || 'http://localhost:8080'
    jobStore.addLog(`[Client] Initiating upload for ${file.name}...`, 'info')

    const response = await $fetch<any>(`${baseURL}/api/v1/jobs/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData
    })

    if (response.job_id) {
      jobStore.addJob({
        job_id: response.job_id,
        filename: file.name,
        status: response.status || 'PENDING'
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    jobStore.addLog(`[Client] Upload failed: ${error.message}`, 'error')
  } finally {
    isUploading.value = false
  }
}
</script>