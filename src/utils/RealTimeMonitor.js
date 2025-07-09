export class RealTimeMonitor {
  constructor() {
    this.ws = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.listeners = new Map()
    this.systemInfo = null
    this.lastMetrics = null
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}`
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('Connected to real-time monitoring server')
        this.isConnected = true
        this.reconnectAttempts = 0
        this.emit('connected')
      }
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('Disconnected from monitoring server')
        this.isConnected = false
        this.emit('disconnected')
        this.attemptReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.attemptReconnect()
    }
  }

  handleMessage(message) {
    switch (message.type) {
      case 'system-info':
        this.systemInfo = message.data
        this.emit('system-info', message.data)
        break
        
      case 'real-time-update':
        this.lastMetrics = message.data
        this.emit('metrics-update', message.data)
        break
        
      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.emit('max-reconnect-attempts')
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
    
    setTimeout(() => {
      this.connect()
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  // API methods for manual data fetching
  async fetchSystemInfo() {
    try {
      const response = await fetch('/api/system-info')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch system info:', error)
      throw error
    }
  }

  async fetchGPUMetrics() {
    try {
      const response = await fetch('/api/gpu-metrics')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch GPU metrics:', error)
      throw error
    }
  }

  async fetchCPUMetrics() {
    try {
      const response = await fetch('/api/cpu-metrics')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch CPU metrics:', error)
      throw error
    }
  }

  async fetchMemoryMetrics() {
    try {
      const response = await fetch('/api/memory-metrics')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch memory metrics:', error)
      throw error
    }
  }

  async fetchThermalMetrics() {
    try {
      const response = await fetch('/api/thermal-metrics')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch thermal metrics:', error)
      throw error
    }
  }

  async startMonitoring() {
    try {
      const response = await fetch('/api/monitoring/start', { method: 'POST' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to start monitoring:', error)
      throw error
    }
  }

  async stopMonitoring() {
    try {
      const response = await fetch('/api/monitoring/stop', { method: 'POST' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to stop monitoring:', error)
      throw error
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      hasSystemInfo: !!this.systemInfo,
      hasMetrics: !!this.lastMetrics
    }
  }

  getSystemInfo() {
    return this.systemInfo
  }

  getLastMetrics() {
    return this.lastMetrics
  }
}