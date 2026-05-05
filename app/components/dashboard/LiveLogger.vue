<template>
  <div class="h-full w-full bg-slate-50 border border-slate-200 rounded-xl shadow-paper flex flex-col overflow-hidden">
    <!-- Header Logger -->
    <div class="px-4 py-2 border-b border-slate-200 bg-white flex justify-between items-center">
      <h3 class="text-[11px] font-bold text-slate-600 font-mono-tech tracking-wider flex items-center gap-2">
        <Terminal class="w-4 h-4 text-slate-500" />
        AUDIT TRAIL LOGS
      </h3>
      <span class="text-[10px] text-slate-400 font-mono-tech">
        Event-Driven Stream
      </span>
    </div>
    
    <!-- Log Console -->
    <div 
      ref="logContainer" 
      class="flex-1 overflow-y-auto p-4 font-mono-tech text-xs bg-slate-50"
    >
      <div v-if="jobStore.logs.length === 0" class="text-slate-400 italic">
        Awaiting system events...
      </div>
      
      <div 
        v-for="log in jobStore.logs" 
        :key="log.id" 
        class="mb-2 leading-relaxed flex gap-3"
      >
        <span class="text-slate-400 shrink-0">[{{ log.timestamp }}]</span>
        <span :class="getLogColor(log.type)">
          {{ log.message }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Terminal } from 'lucide-vue-next'
import { useJobStore } from '~/stores/job'

const jobStore = useJobStore()
const logContainer = ref<HTMLElement | null>(null)

// Auto-scroll ke bawah saat ada log baru
watch(() => jobStore.logs.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

const getLogColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-emerald-600 font-medium'
    case 'warning': return 'text-amber-600'
    case 'error': return 'text-red-500 font-bold'
    default: return 'text-slate-700'
  }
}
</script>