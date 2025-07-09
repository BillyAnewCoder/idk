import './style.css'
import { GPUMonitor } from './components/GPUMonitor.js'
import { ControlPanel } from './components/ControlPanel.js'
import { PerformanceChart } from './components/PerformanceChart.js'
import { StatusBar } from './components/StatusBar.js'
import { GPUSimulator } from './utils/GPUSimulator.js'
import { SystemMonitor } from './utils/SystemMonitor.js'
import { SystemInfo } from './components/SystemInfo.js'
import { RealTimeMonitor } from './utils/RealTimeMonitor.js'

class AfterburnerApp {
  constructor() {
    this.gpuSimulator = new GPUSimulator()
    this.systemMonitor = new SystemMonitor()
    this.realTimeMonitor = new RealTimeMonitor()
    this.updateInterval = null
    this.systemInterval = null
    this.isMonitoring = false
    this.useRealData = false
    
    this.init()
    this.initializeRealTimeMonitoring()
  }

  init() {
    const app = document.querySelector('#app')
    
    app.innerHTML = `
      <div class="afterburner-container">
        <header class="app-header">
          <div class="header-content">
            <div class="gpu-info">
              <h1>AMD Radeon RX 6550M</h1>
              <span class="driver-version">Driver: 23.11.1</span>
            </div>
            <div class="header-controls">
              <button class="btn-icon" id="minimize">−</button>
              <button class="btn-icon" id="real-data-toggle" title="Toggle Real Data">📊</button>
              <button class="btn-icon" id="settings">⚙</button>
              <button class="btn-icon close" id="close">×</button>
            </div>
          </div>
        </header>

        <div class="main-content">
          <div class="left-panel">
            <div id="gpu-monitor"></div>
            <div id="control-panel"></div>
            <div id="system-info"></div>
          </div>
          
          <div class="right-panel">
            <div id="performance-chart"></div>
            <div id="status-bar"></div>
          </div>
        </div>
      </div>
    `

    // Initialize components
    this.gpuMonitor = new GPUMonitor(document.getElementById('gpu-monitor'))
    this.controlPanel = new ControlPanel(document.getElementById('control-panel'), this.gpuData)
    this.performanceChart = new PerformanceChart(document.getElementById('performance-chart'))
    this.statusBar = new StatusBar(document.getElementById('status-bar'))
    this.systemInfo = new SystemInfo(document.getElementById('system-info'))

    // Bind events
    this.bindEvents()
  }

  initializeRealTimeMonitoring() {
    // Set up real-time monitor event listeners
    this.realTimeMonitor.on('connected', () => {
      console.log('Real-time monitoring connected')
      this.updateConnectionStatus(true)
    })

    this.realTimeMonitor.on('disconnected', () => {
      console.log('Real-time monitoring disconnected')
      this.updateConnectionStatus(false)
      // Fall back to simulation
      if (this.useRealData) {
        this.startSimulationMonitoring()
      }
    })

    this.realTimeMonitor.on('system-info', (systemInfo) => {
      console.log('Received system info:', systemInfo)
      this.updateSystemInfo(systemInfo)
    })

    this.realTimeMonitor.on('metrics-update', (metrics) => {
      if (this.useRealData) {
        this.updateComponentsWithRealData(metrics)
      }
    })

    this.realTimeMonitor.on('error', (error) => {
      console.error('Real-time monitoring error:', error)
      this.addSystemLog('Real-time monitoring error: ' + error.message)
    })

    // Try to connect
    this.realTimeMonitor.connect()
    
    // Start with simulation
    this.startSimulationMonitoring()
  }
  bindEvents() {
    // Control panel events
    this.controlPanel.onSettingsChange = (settings) => {
      this.gpuSimulator.updateSettings(settings)
      this.addSystemLog('Settings applied successfully')
    }

    // Window controls
    document.getElementById('close').addEventListener('click', () => {
      if (confirm('Are you sure you want to exit GPU Afterburner?')) {
        window.close()
      }
    })

    document.getElementById('minimize').addEventListener('click', () => {
      document.querySelector('.afterburner-container').classList.toggle('minimized')
    })
    
    // Add monitoring toggle
    const monitoringToggle = document.createElement('button')
    monitoringToggle.className = 'btn-icon'
    monitoringToggle.id = 'monitoring-toggle'
    monitoringToggle.innerHTML = '⏸'
    monitoringToggle.title = 'Pause/Resume Monitoring'
    document.querySelector('.header-controls').insertBefore(monitoringToggle, document.getElementById('settings'))
    
    monitoringToggle.addEventListener('click', () => {
      this.toggleMonitoring()
    })

    // Real data toggle
    document.getElementById('real-data-toggle').addEventListener('click', () => {
      this.toggleRealData()
    })
  }

  toggleRealData() {
    const toggleBtn = document.getElementById('real-data-toggle')
    
    if (this.useRealData) {
      this.useRealData = false
      toggleBtn.style.background = 'var(--bg-tertiary)'
      toggleBtn.title = 'Switch to Real Data'
      this.addSystemLog('Switched to simulated data')
      this.startSimulationMonitoring()
    } else {
      if (this.realTimeMonitor.isConnected) {
        this.useRealData = true
        toggleBtn.style.background = 'var(--success-color)'
        toggleBtn.title = 'Switch to Simulated Data'
        this.addSystemLog('Switched to real system data')
        this.stopSimulationMonitoring()
      } else {
        this.addSystemLog('Real-time monitoring not available')
      }
    }
  }

  updateConnectionStatus(connected) {
    const toggleBtn = document.getElementById('real-data-toggle')
    if (connected) {
      toggleBtn.style.opacity = '1'
      if (this.useRealData) {
        toggleBtn.style.background = 'var(--success-color)'
      }
    } else {
      toggleBtn.style.opacity = '0.5'
      toggleBtn.style.background = 'var(--bg-tertiary)'
    }
  }

  updateSystemInfo(systemInfo) {
    // Update the header with real GPU info
    if (systemInfo.graphics && systemInfo.graphics.length > 0) {
      const gpu = systemInfo.graphics[0]
      const gpuInfoElement = document.querySelector('.gpu-info h1')
      if (gpuInfoElement) {
        gpuInfoElement.textContent = gpu.model || gpu.name || 'AMD GPU'
      }
      
      const driverElement = document.querySelector('.driver-version')
      if (driverElement) {
        driverElement.textContent = `Driver: ${gpu.driverVersion || 'Unknown'}`
      }
    }
  }

  updateComponentsWithRealData(metrics) {
    if (!metrics) return

    // Convert real metrics to our expected format
    const gpuData = this.convertRealGPUData(metrics.gpu)
    const fullData = {
      ...gpuData,
      detailedStatus: this.calculateDetailedStatus(gpuData)
    }
    
    this.gpuMonitor.update(fullData)
    this.controlPanel.update(fullData)
    this.performanceChart.addDataPoint(fullData)
    this.statusBar.update(fullData)
    
    // Update system info with real data
    if (metrics.cpu || metrics.memory) {
      this.systemInfo.update({
        system: {
          cpuCores: metrics.cpu?.cores?.length || navigator.hardwareConcurrency,
          deviceMemory: Math.round(metrics.memory?.total / (1024 * 1024 * 1024)) || navigator.deviceMemory,
          platform: navigator.platform
        },
        memory: {
          usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
          jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0,
          usedPercent: metrics.memory?.usagePercent || 0
        }
      })
    }
  }

  convertRealGPUData(gpuMetrics) {
    if (!gpuMetrics) return this.gpuSimulator.update()

    return {
      temperature: gpuMetrics.temperature || 45,
      usage: gpuMetrics.usage || 0,
      memoryUsage: (gpuMetrics.memoryUsage / 1024) || 1.2, // Convert MB to GB
      totalMemory: (gpuMetrics.memoryTotal / 1024) || 4.0,
      fanSpeed: gpuMetrics.fanSpeed || 45,
      voltage: gpuMetrics.coreVoltage || 1.150,
      coreClock: gpuMetrics.coreClock || 1476,
      memoryClock: gpuMetrics.memoryClock || 1750,
      powerDraw: gpuMetrics.powerDraw || 45,
      workloadType: this.determineWorkloadType(gpuMetrics.usage),
      workloadIntensity: (gpuMetrics.usage || 0) / 100,
      powerLimit: 100
    }
  }

  determineWorkloadType(usage) {
    if (usage > 80) return 'stress'
    if (usage > 60) return 'gaming'
    if (usage > 30) return 'compute'
    return 'idle'
  }

  calculateDetailedStatus(gpuData) {
    const temp = gpuData.temperature
    const usage = gpuData.usage
    const power = gpuData.powerDraw
    
    return {
      thermalStatus: temp > 85 ? 'critical' : temp > 75 ? 'warning' : temp > 65 ? 'warm' : 'normal',
      performanceStatus: usage > 90 ? 'maximum' : usage > 70 ? 'high' : usage > 40 ? 'moderate' : 'low',
      powerStatus: power > 100 ? 'high' : power > 80 ? 'elevated' : 'normal',
      healthStatus: (temp > 90 || usage > 95) ? 'stressed' : (temp > 80 || usage > 85) ? 'good' : 'excellent'
    }
  }

  toggleMonitoring() {
    const toggleBtn = document.getElementById('monitoring-toggle')
    
    if (this.isMonitoring) {
      this.stopMonitoring()
      toggleBtn.innerHTML = '▶'
      toggleBtn.title = 'Resume Monitoring'
      this.addSystemLog('Monitoring paused')
    } else {
      this.startMonitoring()
      toggleBtn.innerHTML = '⏸'
      toggleBtn.title = 'Pause Monitoring'
      this.addSystemLog('Monitoring resumed')
    }
  }

  addSystemLog(message) {
    const logContainer = document.getElementById('monitoring-log')
    if (logContainer) {
      const now = new Date().toLocaleTimeString()
      const logEntry = document.createElement('div')
      logEntry.className = 'log-entry info'
      logEntry.innerHTML = `
        <span class="log-time">[${now}]</span>
        <span class="log-message">${message}</span>
      `
      logContainer.appendChild(logEntry)
      logContainer.scrollTop = logContainer.scrollHeight
    }
  }

  startSimulationMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    
    this.isMonitoring = true
    this.updateInterval = setInterval(() => {
      if (!this.useRealData) {
        this.updateComponents()
      }
    }, 500) // Update every 500ms for smoother real-time feel
    
    // Start system monitoring
    if (this.systemMonitor.isSupported) {
      this.systemInterval = this.systemMonitor.startMonitoring((metrics) => {
        this.systemInfo.update(metrics)
        
        // Use real system data to influence simulation if available
        if (metrics.simulatedGPU) {
          this.gpuSimulator.updateFromSystemMetrics(metrics.simulatedGPU)
        }
      }, 2000) // Update every 2 seconds
    }
  }
  
  stopSimulationMonitoring() {
    this.isMonitoring = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    
    if (this.systemInterval) {
      this.systemMonitor.stopMonitoring(this.systemInterval)
      this.systemInterval = null
    }
  }

  toggleMonitoring() {
    const toggleBtn = document.getElementById('monitoring-toggle')
    
    if (this.isMonitoring) {
      this.stopSimulationMonitoring()
      toggleBtn.innerHTML = '▶'
      toggleBtn.title = 'Resume Monitoring'
      this.addSystemLog('Monitoring paused')
    } else {
      this.startSimulationMonitoring()
      toggleBtn.innerHTML = '⏸'
      toggleBtn.title = 'Pause Monitoring'
      this.addSystemLog('Monitoring resumed')
    }
  }

  updateComponents() {
    const gpuData = this.gpuSimulator.update()
    const detailedStatus = this.gpuSimulator.getDetailedStatus()
    
    const fullData = {
      ...gpuData,
      detailedStatus
    }
    
    this.gpuMonitor.update(fullData)
    this.controlPanel.update(fullData)
    this.performanceChart.addDataPoint(fullData)
    this.statusBar.update(fullData)
  }
}

// Start the application
new AfterburnerApp()