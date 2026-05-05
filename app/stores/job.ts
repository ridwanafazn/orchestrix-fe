import { defineStore } from 'pinia'

export interface Job {
  job_id: string
  filename: string
  status: string
  result_url?: string
}

export interface LogEntry {
  id: number
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export const useJobStore = defineStore('job', {
  state: () => ({
    jobs: [] as Job[],
    logs: [] as LogEntry[],
    logCounter: 0,
  }),
  
  actions: {
    addJob(job: Job) {
      this.jobs.push(job)
      this.addLog(`[Gateway] File '${job.filename}' accepted. Job ID: ${job.job_id.substring(0,8)}...`, 'info')
    },
    
    updateJobStatus(payload: any) {
      const { job_id, status, result_url } = payload
      const job = this.jobs.find(j => j.job_id === job_id)
      
      if (job) {
        job.status = status
        if (result_url) job.result_url = result_url
        
        const logType = status === 'COMPLETED' ? 'success' : (status === 'FAILED' ? 'error' : 'warning')
        this.addLog(`[Worker] Job ${job_id.substring(0,8)}... status shifted to ${status}`, logType)
      } else {
        // Jika job belum ada di state (mungkin dari session sebelumnya)
        this.jobs.push({ job_id, status, filename: 'Unknown_File', result_url })
        this.addLog(`[Hub] Tracked external job ${job_id.substring(0,8)}... as ${status}`, 'info')
      }
    },
    
    addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
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