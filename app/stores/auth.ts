import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Menggunakan useCookie agar token persisten (tetap ada saat direfresh)
    token: useCookie<string | null>('orchestrix_token', { 
      default: () => null,
      maxAge: 60 * 60 * 24, // 24 jam sesuai kontrak Go
      path: '/'
    }),
    isLoading: false,
    error: null as string | null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async authenticateGuest() {
      // Jika sudah ada token, tidak perlu hit API lagi
      if (this.token) return 

      this.isLoading = true
      this.error = null

      try {
        // Fallback ke localhost:8080 jika .env NUXT_PUBLIC_API_BASE belum ter-load
        const config = useRuntimeConfig()
        const baseURL = config.public.apiBase || 'http://localhost:8080'

        const response = await $fetch<{ token: string }>(`${baseURL}/api/v1/auth/guest`, {
          method: 'POST',
        })

        if (response.token) {
          this.token = response.token
          console.log('🔐 Auth: Guest session initiated')
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to authenticate as guest'
        console.error('🔐 Auth Error:', err)
      } finally {
        this.isLoading = false
      }
    },

    clearSession() {
      this.token = null
    }
  }
})