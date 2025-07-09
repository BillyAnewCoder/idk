import './style.css'
import { GPUMonitor } from './components/GPUMonitor.js'
import { ControlPanel } from './components/ControlPanel.js'
import { PerformanceChart } from './components/PerformanceChart.js'
import { StatusBar } from './components/StatusBar.js'
import { GPUSimulator } from './utils/GPUSimulator.js'

class AfterburnerApp {
  constructor() {
    this.gpuSimulator = new GPUSimulator()
    this.updateInterval = null
    this.isMonitoring = false
    
    this.init()
    this.startMonitoring()
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
              <button class="btn-icon" id="settings">⚙</button>
              <button class="btn-icon close" id="close">×</button>
            </div>
          </div>
        </header>

        <div class="main-content">
          <div class="left-panel">
            <div id="gpu-monitor"></div>
            <div id="control-panel"></div>
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

    // Bind events
    this.bindEvents()
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

  startMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    
    this.isMonitoring = true
    this.updateInterval = setInterval(() => {
      this.updateComponents()
    }, 500) // Update every 500ms for smoother real-time feel
  }
  
  stopMonitoring() {
    this.isMonitoring = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
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