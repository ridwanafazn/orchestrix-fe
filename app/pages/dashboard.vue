<template>
  <div class="h-full w-full p-3 flex flex-col gap-3 bg-slate-200 overflow-hidden">
    
    <div class="flex-[3] w-full border-2 border-slate-300 bg-white rounded-xl flex flex-col shadow-sm overflow-hidden relative">
      <div class="px-4 py-2.5 border-b-2 border-slate-200 flex justify-between items-center bg-slate-50 z-20 shrink-0">
        <h2 class="text-[11px] font-bold tracking-widest text-slate-700 flex items-center gap-2 font-mono-tech">
          <Activity class="w-3.5 h-3.5 text-blue-600" />
          INFRASTRUCTURE AND FLOW VISUALIZATION
        </h2>
        <div class="text-[9px] font-mono-tech flex items-center gap-2 bg-white px-2 py-1 border-2 border-slate-200 rounded-md shadow-sm">
          <span class="text-slate-500 font-bold">Websocket:</span>
          <span :class="isConnected ? 'text-emerald-600 font-bold animate-pulse' : 'text-red-500 font-bold'">
            {{ isConnected ? 'ESTABLISHED' : 'DISCONNECTED' }}
          </span>
        </div>
      </div>
      
      <!-- KUNCI PERUBAHAN: Menjadi Viewport murni, tanpa padding, tanpa flex centering yang memaksa layout -->
      <div class="flex-1 relative overflow-hidden bg-slate-50 w-full h-full">
        <InfrastructureMap />
      </div>
    </div>

    <div class="flex-[2] w-full grid grid-cols-1 lg:grid-cols-3 gap-3 overflow-hidden">
      <div class="col-span-1 h-full overflow-hidden">
        <Uploader @transmitted="handleOptimisticTransmission" />
      </div>
      <div class="col-span-1 lg:col-span-2 h-full overflow-hidden">
        <LiveLogger />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Activity } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useJobStore } from '~/stores/job'
import { useOrchestrixSocket } from '~/composables/useOrchestrixSocket'
import { useDroneAnimation } from '~/composables/useDroneAnimation'
import InfrastructureMap from '~/components/dashboard/InfrastructureMap.vue'
import Uploader from '~/components/dashboard/Uploader.vue'
import LiveLogger from '~/components/dashboard/LiveLogger.vue'

const authStore = useAuthStore()
const jobStore = useJobStore()
const router = useRouter()
const { connect, isConnected, lastMessage } = useOrchestrixSocket()

const { 
  shootPacket, 
  forkPacket, 
  forkChaos, 
  pulseNode, 
  hidePacket,
  startProcessingNode,
  stopProcessingNode,
  animateInitialRoute  
} = useDroneAnimation()

const animatedJobs = new Set<string>()

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

const handleOptimisticTransmission = async (jobId: string) => {
  await nextTick() 
  const pId = `packet-${jobId}`
  animatedJobs.add(pId) 
  animateInitialRoute(pId)
}

watch(lastMessage, async (newVal) => {
  if (!newVal || !newVal.job_id) return
  jobStore.updateJobStatus(newVal)
  const pId = `packet-${newVal.job_id}`

  await nextTick()

  switch (newVal.status) {
    case 'PENDING':
      if (!animatedJobs.has(pId)) {
        animatedJobs.add(pId)
        animateInitialRoute(pId)
      }
      break;
      
    case 'PROCESSING':
      if (!animatedJobs.has(`processing-${pId}`)) {
        animatedJobs.add(`processing-${pId}`)
        shootPacket(pId, 'node-queue', 'node-worker', 0.6)
        pulseNode('node-worker')
        setTimeout(() => {
          startProcessingNode('node-worker')
        }, 600)
      }
      break;
      
    case 'COMPLETED':
      animatedJobs.delete(pId)
      animatedJobs.delete(`processing-${pId}`)
      stopProcessingNode('node-worker')
      pulseNode('node-worker')
      
      forkPacket(pId, 'node-worker', 'node-storage', 'node-db', 0.6)
      
      pulseNode('node-storage')
      pulseNode('node-db')
      break;
      
    case 'FAILED':
      animatedJobs.delete(pId)
      animatedJobs.delete(`processing-${pId}`)
      stopProcessingNode('node-worker')
      pulseNode('node-worker') 
      
      forkChaos(pId, 'node-worker', 'node-dlq', 'node-db')
      
      setTimeout(() => {
        pulseNode('node-dlq')
        pulseNode('node-db')
      }, 700)
      break;
  }
})
</script>