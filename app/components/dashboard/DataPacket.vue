<template>
  <div 
    :id="`packet-${job.job_id}`"
    class="absolute w-3 h-3 rounded-full z-50 pointer-events-none"
    style="top: 0; left: 0; opacity: 0; transform: translate(-50%, -50%) translateZ(40px); transform-style: preserve-3d; background-color: #38bdf8; box-shadow: 0 0 15px 2px rgba(56, 189, 248, 0.8);"
  >
    <!-- Efek Ping (Berdenyut) bawaan Tailwind -->
    <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: inherit;"></div>
  </div>
</template>

<script setup lang="ts">
// Komponen ini sekarang sepenuhnya pasif (Dumb Component).
// Pergerakan, perubahan warna (seperti saat Failed/Chaos), 
// dan opacity dikendalikan sepenuhnya oleh useDroneAnimation.ts di dashboard.vue

defineProps({
  job: { type: Object, required: true }
})
</script>