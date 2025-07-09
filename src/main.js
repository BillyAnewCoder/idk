import './style.css'
import { GPUMonitor } from './components/GPUMonitor.js'
import { ControlPanel } from './components/ControlPanel.js'
import { PerformanceChart } from './components/PerformanceChart.js'
import { StatusBar } from './components/StatusBar.js'

class AfterburnerApp {
  constructor() {
    this.gpuData = {
      temperature: 65,
      coreClockOffset: 0,
      memoryClockOffset: 0,
      powerLimit: 100,
      fanSpeed: 45,
      voltage: 1.2,
      usage: 78,
      memoryUsage: 3.2,
      totalMemory: 4.0
    }
    
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
      this.updateGPUSettings(settings)
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
  }

  updateGPUSettings(settings) {
    Object.assign(this.gpuData, settings)
    this.simulateGPUResponse()
  }

  simulateGPUResponse() {
    // Simulate GPU response to settings changes
    const { coreClockOffset, memoryClockOffset, powerLimit } = this.gpuData
    
    // Temperature increases with higher clocks and power
    const tempIncrease = (Math.abs(coreClockOffset) * 0.01) + (Math.abs(memoryClockOffset) * 0.005) + ((powerLimit - 100) * 0.1)
    this.gpuData.temperature = Math.min(95, 65 + tempIncrease + (Math.random() * 5 - 2.5))
    
    // Usage fluctuates
    this.gpuData.usage = Math.max(0, Math.min(100, this.gpuData.usage + (Math.random() * 10 - 5)))
    
    // Memory usage changes slightly
    this.gpuData.memoryUsage = Math.max(0, Math.min(this.gpuData.totalMemory, 
      this.gpuData.memoryUsage + (Math.random() * 0.2 - 0.1)))
  }

  startMonitoring() {
    setInterval(() => {
      this.simulateGPUResponse()
      this.updateComponents()
    }, 1000)
  }

  updateComponents() {
    this.gpuMonitor.update(this.gpuData)
    this.controlPanel.update(this.gpuData)
    this.performanceChart.addDataPoint(this.gpuData)
    this.statusBar.update(this.gpuData)
  }
}

// Start the application
new AfterburnerApp()