import { ref, onBeforeUnmount } from 'vue'
import { useAuthStore } from '~/stores/auth'

export const useOrchestrixSocket = () => {
  const authStore = useAuthStore()
  const socket = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const lastMessage = ref<any>(null) // Akan di-watch oleh Pinia/Komponen GSAP
  const error = ref<string | null>(null)

  const connect = () => {
    // Hindari koneksi ganda
    if (socket.value?.readyState === WebSocket.OPEN) return
    
    if (!authStore.token) {
      error.value = 'No authentication token found. Handshake aborted.'
      return
    }

    const config = useRuntimeConfig()
    const httpURL = config.public.apiBase || 'http://localhost:8080'
    // Ubah protokol http/https menjadi ws/wss
    const wsBaseURL = httpURL.replace(/^http/, 'ws')
    
    // Injeksi token ke query string. Pastikan Gin backend membaca query "token" 
    // jika header "Authorization" kosong.
    const wsUrl = `${wsBaseURL}/ws?token=${authStore.token}`
    
    try {
      socket.value = new WebSocket(wsUrl)

      socket.value.onopen = () => {
        isConnected.value = true
        error.value = null
        console.log('🔌 WS: Connected to Orchestrix Hub')
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          lastMessage.value = data // Update state reaktif
          console.log('📥 WS Payload:', data)
        } catch (err) {
          console.error('🔌 WS Parse Error:', err)
        }
      }

      socket.value.onerror = (event) => {
        console.error('🔌 WS Error:', event)
        error.value = 'Connection disrupted'
      }

      socket.value.onclose = (event) => {
        isConnected.value = false
        console.log(`🔌 WS: Disconnected (Code: ${event.code})`)
        
        // Auto-reconnect logic (Opsional, sangat berguna untuk sistem terdistribusi)
        // setTimeout(() => connect(), 3000)
      }
    } catch (err: any) {
      error.value = err.message
      console.error('🔌 WS Initialization Error:', err)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close(1000, 'Client leaving')
      socket.value = null
      isConnected.value = false
    }
  }

  // Auto-cleanup memory leak (penting untuk SPA)
  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect
  }
}