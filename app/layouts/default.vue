<template>
  <div class="h-screen w-screen bg-paper-pattern flex flex-col">
    <!-- Topbar: Letterhead Style -->
    <header class="w-full px-8 py-5 border-b border-slate-200/60 bg-white/70 backdrop-blur-md z-20 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
          <Server class="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h1 class="font-serif-doc font-black text-slate-900 tracking-tight text-lg leading-none">
            ORCHESTRIX
          </h1>
          <span class="font-mono-tech text-[10px] text-slate-400 tracking-widest uppercase">
            Distributed System Blueprint
          </span>
        </div>
      </div>
      
      <!-- Indikator Sesi Aktif -->
      <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-slate-200 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="text-[10px] font-mono-tech font-bold tracking-wider text-slate-600">GUEST VERIFIED</span>
      </div>
    </header>

    <!-- Konten Halaman -->
    <main class="flex-1 relative overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Server } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>