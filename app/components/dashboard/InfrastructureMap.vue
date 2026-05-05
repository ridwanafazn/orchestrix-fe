<template>
  <!-- Pembungkus ruang 3D dipaksa via inline-style -->
  <div class="relative w-full h-[600px] flex items-center justify-center overflow-visible" style="perspective: 2500px;">
    
    <!-- ISO BOARD (The 3D Canvas) -->
    <div id="iso-board-main" class="iso-board relative w-[800px] h-[550px] bg-white border border-slate-200 rounded-2xl flex">
      
      <!-- Mesin Render Animasi Cahaya -->
      <DataPacket v-for="job in jobStore.jobs" :key="job.job_id" :job="job" />

      <!-- PUBLIC ZONE (Kiri) -->
      <div class="absolute left-0 top-0 bottom-0 w-[240px] border-r-2 border-dashed border-slate-300 bg-slate-50/80 rounded-l-2xl">
        <span class="absolute top-6 left-6 font-mono-tech text-xs font-bold text-slate-400">PUBLIC ZONE</span>
      </div>

      <!-- PRIVATE SUBNET (Kanan) -->
      <div class="absolute right-0 top-0 bottom-0 left-[240px]">
        <span class="absolute top-6 right-6 font-mono-tech text-xs font-bold text-slate-400">PRIVATE SUBNET</span>
      </div>

      <!-- THE NODES (Koordinat Absolut untuk presisi GSAP & CSS 3D) -->
      
      <!-- 1. Client -->
      <div id="node-client" class="iso-node-stand absolute flex flex-col items-center gap-3 w-20" style="left: 80px; top: 230px;">
        <div class="w-14 h-14 bg-white border border-slate-200 rounded-lg shadow-paper flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1 bg-slate-200"></div> <!-- Efek alas -->
          <MonitorSmartphone class="w-6 h-6 text-slate-600" />
        </div>
        <span class="font-mono-tech text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">Client</span>
      </div>

      <!-- 2. API Gateway -->
      <div id="node-api" class="iso-node-stand absolute flex flex-col items-center gap-3 w-20 z-10" style="left: 240px; top: 230px;">
        <div class="w-14 h-14 bg-white border-2 border-slate-800 rounded-lg shadow-paper flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1 bg-slate-800"></div>
          <Globe class="w-6 h-6 text-slate-800" />
        </div>
        <span class="font-mono-tech text-[10px] font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">API Gateway</span>
      </div>

      <!-- 3. RabbitMQ Hub -->
      <div id="node-queue" class="iso-node-stand absolute flex flex-col items-center gap-3 w-24" style="left: 420px; top: 230px;">
        <div class="w-16 h-16 bg-orange-50 border-2 border-orange-200 rounded-full shadow-paper flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1.5 bg-orange-200"></div>
          <ArrowRightLeft class="w-7 h-7 text-orange-600 z-10" />
        </div>
        <span class="font-mono-tech text-[10px] font-bold text-orange-700 bg-white px-2 py-1 rounded shadow-sm border border-orange-100">RabbitMQ Hub</span>
      </div>

      <!-- 4. Worker Pool -->
      <div id="node-worker" class="iso-node-stand absolute flex flex-col items-center gap-3 w-20" style="left: 580px; top: 100px;">
        <div class="w-14 h-14 bg-white border border-slate-200 rounded-lg shadow-paper flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1 bg-slate-200"></div>
          <Cpu class="w-6 h-6 text-slate-600" />
        </div>
        <span class="font-mono-tech text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">Worker Pool</span>
      </div>

      <!-- 5. PostgreSQL -->
      <div id="node-db" class="iso-node-stand absolute flex flex-col items-center gap-3 w-20" style="left: 580px; top: 380px;">
        <div class="w-14 h-14 bg-white border border-slate-200 rounded-lg shadow-paper flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1 bg-slate-200"></div>
          <Database class="w-6 h-6 text-slate-600" />
        </div>
        <span class="font-mono-tech text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">PostgreSQL</span>
      </div>

      <!-- 6. MinIO Vault -->
      <div id="node-storage" class="iso-node-stand absolute flex flex-col items-center gap-3 w-20" style="left: 700px; top: 230px;">
        <div class="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-lg shadow-paper flex items-center justify-center relative overflow-hidden">
          <div class="absolute bottom-0 w-full h-1 bg-emerald-200"></div>
          <HardDrive class="w-6 h-6 text-emerald-600 z-10" />
        </div>
        <span class="font-mono-tech text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded shadow-sm border border-emerald-100">MinIO Vault</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Globe, ArrowRightLeft, Cpu, Database, MonitorSmartphone, HardDrive } from 'lucide-vue-next'
import { useJobStore } from '~/stores/job'
import DataPacket from '~/components/dashboard/DataPacket.vue'

const jobStore = useJobStore()
</script>