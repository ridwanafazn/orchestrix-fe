<template>
  <div class="h-full w-full flex flex-col items-center justify-center p-6 relative">
    
    <!-- White Card (Paper Effect) -->
    <div class="relative z-10 max-w-sm w-full bg-white border border-slate-100 rounded-xl p-10 shadow-paper text-center">
      
      <div class="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <Shield class="w-7 h-7 text-slate-700" />
      </div>
      
      <h2 class="font-serif-doc text-2xl font-black text-slate-800 mb-3">Security Clearance</h2>
      <p class="text-slate-500 text-sm mb-8 leading-relaxed">
        Please initiate a sterile guest session to access the Orchestrix infrastructure topology.
      </p>
      
      <button 
        @click="handleEnter" 
        :disabled="authStore.isLoading"
        class="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all shadow-md active:shadow-sm active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <Loader2 v-if="authStore.isLoading" class="w-5 h-5 animate-spin" />
        <span v-else class="tracking-wide">Authorize Session</span>
      </button>
      
      <p v-if="authStore.error" class="mt-5 text-xs text-red-500 font-mono-tech bg-red-50 p-2 rounded border border-red-100">
        {{ authStore.error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Shield, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleEnter = async () => {
  await authStore.authenticateGuest()
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
}
</script>