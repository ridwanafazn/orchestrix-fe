import { defineStore } from 'pinia'

export interface Job {
  job_id: string
  filename: string
  status: string
  progress: number      // TELEMETRI BARU
  worker_id?: string    // TELEMETRI BARU
  result_url?: string
}

export interface LogEntry {
  id: number
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'critical' // Tambahan 'critical' untuk Chaos Engineering
}

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [] as Job[],
    logs: [] as LogEntry[],
    logCounter: 0,
  }),
  
  actions: {
    addJob(job: Partial<Job> & { job_id: string, filename: string }) {
      this.jobs.push({
        ...job,
        status: job.status || 'PENDING',
        progress: 0
      } as Job)
      this.addLog(`[Gateway] File '${job.filename}' accepted. Job ID: ${job.job_id.substring(0,8)}...`, 'info')
    },
    
    updateJobStatus(payload: any) {
      // Tangkap data telemetri kaya dari WebSocket
      const { job_id, status, progress, worker_id, result_url } = payload
      const job = this.jobs.find(j => j.job_id === job_id)
      
      if (job) {
        job.status = status
        if (progress !== undefined) job.progress = progress
        if (worker_id) job.worker_id = worker_id
        if (result_url) job.result_url = result_url
        
        // Logika Logging yang lebih cerdas berdasarkan status dan telemetri
        if (status === 'PROCESSING') {
          this.addLog(`[${worker_id || 'WorkerPool'}] Compressing... ${progress}%`, 'warning')
        } else if (status === 'COMPLETED') {
          this.addLog(`[${worker_id || 'WorkerPool'}] Job ${job_id.substring(0,8)}... COMPLETED successfully.`, 'success')
        } else if (status === 'FAILED') {
          this.addLog(`[SYSTEM_PANIC] ${worker_id || 'Worker'} crashed on ${job_id.substring(0,8)}! Routing to DLQ.`, 'critical')
        }
      } else {
        // Jika job belum ada di state (mungkin dari session sebelumnya)
        this.jobs.push({ 
          job_id, 
          status, 
          progress: progress || 0, 
          worker_id, 
          filename: 'Unknown_File', 
          result_url 
        })
        this.addLog(`[Hub] Tracked external job ${job_id.substring(0,8)}... as ${status}`, 'info')
      }
    },
    
    addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' | 'critical' = 'info') {
      const now = new Date()
      const time = now.toTimeString().split(' ')[0] // Format HH:MM:SS
      this.logs.push({
        id: this.logCounter++,
        timestamp: time,
        message,
        type
      })
    }
  }
})