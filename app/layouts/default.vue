<template>
  <!-- KUNCI: Gunakan h-[100dvh] mutlak, dan overflow-hidden untuk mengunci layar -->
  <div class="h-[100dvh] w-full bg-paper-pattern flex flex-col overflow-hidden">
    
    <!-- Topbar: Letterhead Style (Dirampingkan: py-5 menjadi py-3, px-8 menjadi px-6) -->
    <header class="w-full px-6 py-3 border-b border-slate-200/60 bg-white/70 backdrop-blur-md z-20 flex justify-between items-center shrink-0">
      <div class="flex items-center gap-3">
        <div class="p-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
          <Server class="w-4 h-4 text-slate-700" />
        </div>
        <div>
          <h1 class="font-serif-doc font-black text-slate-900 tracking-tight text-base leading-none">
            ORCHESTRIX
          </h1>
          <!-- <span class="font-mono-tech text-[9px] text-slate-400 tracking-widest uppercase">
            Distributed System Blueprint
          </span> -->
        </div>
      </div>
      
      <!-- Indikator Sesi Aktif -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-slate-200 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="text-[9px] font-mono-tech font-bold tracking-wider text-slate-600">GUEST VERIFIED</span>
      </div>
    </header>

    <!-- Konten Halaman -->
    <!-- KUNCI: overflow-hidden dipasang kembali agar child mengikuti batas layar -->
    <main class="flex-1 relative flex flex-col overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Server } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>