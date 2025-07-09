export class SystemMonitor {
  constructor() {
    this.isSupported = this.checkSupport()
    this.systemInfo = {}
    this.performanceObserver = null
    this.memoryInfo = null
    
    if (this.isSupported) {
      this.initializeMonitoring()
    }
  }

  checkSupport() {
    return !!(
      navigator.hardwareConcurrency &&
      performance.memory &&
      navigator.deviceMemory
    )
  }

  async initializeMonitoring() {
    // Get basic system information
    this.systemInfo = {
      cpuCores: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      onLine: navigator.onLine
    }

    // Monitor performance metrics
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          this.handlePerformanceEntries(list.getEntries())
        })
        
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'resource'] })
      } catch (e) {
        console.warn('Performance Observer not fully supported:', e)
      }
    }

    // Get GPU information if available
    await this.getGPUInfo()
  }

  async getGPUInfo() {
    try {
      if ('gpu' in navigator) {
        const adapter = await navigator.gpu.requestAdapter()
        if (adapter) {
          this.systemInfo.gpu = {
            vendor: adapter.info?.vendor || 'Unknown',
            architecture: adapter.info?.architecture || 'Unknown',
            device: adapter.info?.device || 'Unknown',
            description: adapter.info?.description || 'WebGPU Adapter'
          }
        }
      }
      
      // Try to get WebGL renderer info
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          this.systemInfo.webgl = {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            version: gl.getParameter(gl.VERSION),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
          }
        }
      }
    } catch (e) {
      console.warn('GPU info not available:', e)
    }
  }

  handlePerformanceEntries(entries) {
    entries.forEach(entry => {
      if (entry.entryType === 'navigation') {
        this.systemInfo.pageLoad = {
          domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          loadComplete: entry.loadEventEnd - entry.loadEventStart,
          totalTime: entry.loadEventEnd - entry.fetchStart
        }
      }
    })
  }

  getMemoryInfo() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        usedPercent: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
      }
    }
    return null
  }

  getBatteryInfo() {
    return new Promise((resolve) => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          resolve({
            charging: battery.charging,
            level: battery.level * 100,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          })
        }).catch(() => resolve(null))
      } else {
        resolve(null)
      }
    })
  }

  getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  }

  async getCurrentMetrics() {
    const metrics = {
      timestamp: Date.now(),
      memory: this.getMemoryInfo(),
      network: this.getNetworkInfo(),
      battery: await this.getBatteryInfo(),
      system: this.systemInfo,
      performance: {
        timing: performance.timing,
        now: performance.now()
      }
    }

    // Simulate some GPU-like metrics based on available data
    if (metrics.memory) {
      metrics.simulatedGPU = {
        memoryUsage: (metrics.memory.usedPercent / 100) * 4, // Scale to 4GB
        temperature: 45 + (metrics.memory.usedPercent * 0.3) + (Math.random() * 10),
        usage: Math.min(100, metrics.memory.usedPercent + (Math.random() * 20)),
        fanSpeed: Math.max(30, Math.min(80, 30 + (metrics.memory.usedPercent * 0.5)))
      }
    }

    return metrics
  }

  startMonitoring(callback, interval = 1000) {
    const monitor = async () => {
      const metrics = await this.getCurrentMetrics()
      callback(metrics)
    }

    monitor() // Initial call
    return setInterval(monitor, interval)
  }

  stopMonitoring(intervalId) {
    if (intervalId) {
      clearInterval(intervalId)
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }
  }
}