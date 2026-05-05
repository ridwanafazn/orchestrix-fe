<template>
  <div class="h-full w-full p-8 flex flex-col gap-6 relative">
    
    <!-- Top Panel: Peta Infrastruktur (Drone View) -->
    <div class="w-full h-3/5 min-h-[450px] border border-slate-200 bg-white rounded-xl overflow-hidden relative flex flex-col shadow-paper">
      <!-- Panel Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
        <h2 class="text-[11px] font-bold tracking-widest text-slate-500 flex items-center gap-2 font-mono-tech">
          <Activity class="w-4 h-4 text-slate-700" />
          SYSTEM TOPOLOGY & DATA FLOW
        </h2>
        <div class="text-[10px] font-mono-tech flex items-center gap-2 bg-white px-3 py-1 border border-slate-200 rounded-md shadow-sm">
          <span class="text-slate-400">WS_LINK:</span>
          <span :class="isConnected ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'">
            {{ isConnected ? 'ESTABLISHED' : 'DISCONNECTED' }}
          </span>
        </div>
      </div>
      
      <!-- Canvas Area -->
      <div class="flex-1 relative flex items-center justify-center overflow-hidden bg-paper-pattern">
        <InfrastructureMap />
      </div>
    </div>

    <!-- Bottom Panel: Input & Observability -->
    <div class="flex-1 grid grid-cols-3 gap-6 min-h-[250px]">
      <div class="col-span-1">
        <Uploader />
      </div>
      <div class="col-span-2">
        <LiveLogger />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Activity } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useJobStore } from '~/stores/job'
import { useOrchestrixSocket } from '~/composables/useOrchestrixSocket'
import InfrastructureMap from '~/components/dashboard/InfrastructureMap.vue'
import Uploader from '~/components/dashboard/Uploader.vue'
import LiveLogger from '~/components/dashboard/LiveLogger.vue'

const authStore = useAuthStore()
const jobStore = useJobStore()
const router = useRouter()
const { connect, isConnected, lastMessage } = useOrchestrixSocket()

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/')
    return
  }
  connect()
  if (jobStore.logs.length === 0) {
    jobStore.addLog('[System] Spatial Dashboard active. Awaiting file uploads.', 'info')
  }
})

watch(lastMessage, (newVal) => {
  if (newVal && newVal.job_id) {
    jobStore.updateJobStatus(newVal)
  }
})
</script>