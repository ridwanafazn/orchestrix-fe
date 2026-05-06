<template>
  <!-- KUNCI: Tambahkan min-h-0 di div terluar agar tidak memaksa parent (grid) untuk meluap -->
  <div class="h-full w-full min-h-0 bg-slate-950 border-2 border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
    <!-- Header Logger Gelap -->
    <div class="px-4 py-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
      <h3 class="text-[11px] font-bold text-slate-300 font-mono-tech tracking-widest flex items-center gap-2">
        <Terminal class="w-4 h-4 text-emerald-400" />
        REALTIME LOGS
      </h3>
      <span class="text-[10px] text-slate-500 font-mono-tech flex items-center gap-2">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Live Stream
      </span>
    </div>
    
    <!-- Log Console (Kunci Flex-1, Overflow-Y, dan min-h-0) -->
    <div 
      ref="logContainer" 
      class="flex-1 min-h-0 overflow-y-auto p-4 font-mono text-[11px] bg-slate-950 text-slate-300 transition-all duration-300 scrollbar-dark"
    >
      <div v-if="jobStore.logs.length === 0" class="text-slate-600 italic">
        > Awaiting system events...
      </div>
      
      <div 
        v-for="log in jobStore.logs" 
        :key="log.id" 
        class="mb-2 leading-relaxed flex gap-3 hover:bg-slate-900/50 px-1 rounded transition-colors"
      >
        <span class="text-slate-500 shrink-0">[{{ log.timestamp }}]</span>
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

watch(() => jobStore.logs.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
})

const getLogColor = (type: string) => {
  switch (type) {
    case 'success': return 'text-emerald-400'
    case 'warning': return 'text-sky-400' 
    case 'error': return 'text-red-400'
    case 'critical': return 'text-red-500 font-bold bg-red-950/50 px-1 border border-red-900/50'
    default: return 'text-slate-300'
  }
}
</script>

<style scoped>
/* Custom Scrollbar untuk Terminal Gelap */
.scrollbar-dark::-webkit-scrollbar { width: 6px; }
.scrollbar-dark::-webkit-scrollbar-track { background: #020617; }
.scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
.scrollbar-dark::-webkit-scrollbar-thumb:hover { background: #475569; }
</style>