export class StatusBar {
  constructor(container) {
    this.container = container
    this.render()
  }

  render() {
    this.container.innerHTML = `
      <div class="status-bar">
        <div class="status-section">
          <h4>System Status</h4>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-label">Driver Status:</span>
              <span class="status-value good" id="driver-status">OK</span>
            </div>
            <div class="status-item">
              <span class="status-label">GPU Health:</span>
              <span class="status-value good" id="gpu-health">Excellent</span>
            </div>
            <div class="status-item">
              <span class="status-label">Thermal Status:</span>
              <span class="status-value" id="thermal-status">Normal</span>
            </div>
            <div class="status-item">
              <span class="status-label">Power Status:</span>
              <span class="status-value" id="power-status">Stable</span>
            </div>
          </div>
        </div>

        <div class="status-section">
          <h4>GPU Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Base Clock:</span>
              <span class="info-value">1476 MHz</span>
            </div>
            <div class="info-item">
              <span class="info-label">Boost Clock:</span>
              <span class="info-value">2589 MHz</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory Clock:</span>
              <span class="info-value">1750 MHz</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory Size:</span>
              <span class="info-value">4096 MB</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory Type:</span>
              <span class="info-value">GDDR6</span>
            </div>
            <div class="info-item">
              <span class="info-label">Bus Width:</span>
              <span class="info-value">64-bit</span>
            </div>
          </div>
        </div>

        <div class="status-section">
          <h4>Monitoring Log</h4>
          <div class="log-container" id="monitoring-log">
            <div class="log-entry">
              <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
              <span class="log-message">GPU monitoring started</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  update(data) {
    const status = data.detailedStatus || {}
    
    // Update thermal status
    const thermalStatus = document.getElementById('thermal-status')
    switch (status.thermalStatus) {
      case 'critical':
        thermalStatus.textContent = 'Critical'
        thermalStatus.className = 'status-value error'
        break
      case 'warning':
        thermalStatus.textContent = 'Hot'
        thermalStatus.className = 'status-value warning'
        break
      case 'warm':
        thermalStatus.textContent = 'Warm'
        thermalStatus.className = 'status-value caution'
        break
      default:
        thermalStatus.textContent = 'Normal'
        thermalStatus.className = 'status-value good'
    }
    
    // Update GPU health
    const gpuHealth = document.getElementById('gpu-health')
    switch (status.healthStatus) {
      case 'stressed':
        gpuHealth.textContent = 'Stressed'
        gpuHealth.className = 'status-value warning'
        break
      case 'good':
        gpuHealth.textContent = 'Good'
        gpuHealth.className = 'status-value caution'
        break
      default:
        gpuHealth.textContent = 'Excellent'
        gpuHealth.className = 'status-value good'
    }
    
    // Update power status
    const powerStatus = document.getElementById('power-status')
    switch (status.powerStatus) {
      case 'high':
        powerStatus.textContent = 'High'
        powerStatus.className = 'status-value warning'
        break
      case 'elevated':
        powerStatus.textContent = 'Elevated'
        powerStatus.className = 'status-value caution'
        break
      default:
        powerStatus.textContent = 'Stable'
        powerStatus.className = 'status-value good'
    }
    
    // Add performance status
    let perfStatus = document.getElementById('performance-status')
    if (!perfStatus) {
      const statusGrid = document.querySelector('.status-grid')
      const perfHTML = `
        <div class="status-item">
          <span class="status-label">Performance:</span>
          <span class="status-value" id="performance-status">Low</span>
        </div>
      `
      statusGrid.insertAdjacentHTML('beforeend', perfHTML)
      perfStatus = document.getElementById('performance-status')
    }
    
    switch (status.performanceStatus) {
      case 'maximum':
        perfStatus.textContent = 'Maximum'
        perfStatus.className = 'status-value good'
        break
      case 'high':
        perfStatus.textContent = 'High'
        perfStatus.className = 'status-value good'
        break
      case 'moderate':
        perfStatus.textContent = 'Moderate'
        perfStatus.className = 'status-value caution'
        break
      default:
        perfStatus.textContent = 'Low'
        perfStatus.className = 'status-value'
    }
    
    // Enhanced logging with workload information
    this.addEnhancedLogEntry(data, status)
  }
  
  addEnhancedLogEntry(data, status) {
    const logContainer = document.getElementById('monitoring-log')
    const now = new Date().toLocaleTimeString()
    
    // Log workload changes
    if (data.workloadType !== this.lastWorkloadType) {
      this.addLog(logContainer, now, `Workload changed to ${data.workloadType}`, 'info')
      this.lastWorkloadType = data.workloadType
    }
    
    // Log thermal events
    if (status.thermalStatus === 'critical' && this.lastThermalStatus !== 'critical') {
      this.addLog(logContainer, now, `Critical temperature: ${Math.round(data.temperature)}°C`, 'error')
    } else if (status.thermalStatus === 'warning' && !['warning', 'critical'].includes(this.lastThermalStatus)) {
      this.addLog(logContainer, now, `High temperature detected: ${Math.round(data.temperature)}°C`, 'warning')
    } else if (status.thermalStatus === 'normal' && ['warning', 'critical'].includes(this.lastThermalStatus)) {
      this.addLog(logContainer, now, 'Temperature normalized', 'good')
    }
    this.lastThermalStatus = status.thermalStatus
    
    // Log performance changes
    if (status.performanceStatus === 'maximum' && this.lastPerfStatus !== 'maximum') {
      this.addLog(logContainer, now, 'Maximum performance achieved', 'good')
    }
    this.lastPerfStatus = status.performanceStatus
    
    // Log power events
    if (status.powerStatus === 'high' && this.lastPowerStatus !== 'high') {
      this.addLog(logContainer, now, `High power draw: ${Math.round(data.powerDraw)}W`, 'warning')
    }
    this.lastPowerStatus = status.powerStatus
    
    // Keep log size manageable
    const entries = logContainer.querySelectorAll('.log-entry')
    if (entries.length > 15) {
      entries[1].remove() // Keep the first "started" entry
    }
  }

  addLog(container, time, message, type = 'info') {
    const logEntry = document.createElement('div')
    logEntry.className = `log-entry ${type}`
    logEntry.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="log-message">${message}</span>
    `
    container.appendChild(logEntry)
    container.scrollTop = container.scrollHeight
  }

  updateThermalStatus(data, thermalStatus) {
    if (data.temperature > 85) {
      thermalStatus.textContent = 'Hot'
      thermalStatus.className = 'status-value warning'
    } else if (data.temperature > 75) {
      thermalStatus.textContent = 'Warm'
      thermalStatus.className = 'status-value caution'
    } else {
      thermalStatus.textContent = 'Normal'
      thermalStatus.className = 'status-value good'
    }

    // Update GPU health based on temperature and usage
    const gpuHealth = document.getElementById('gpu-health')
    if (data.temperature > 90 || data.usage > 95) {
      gpuHealth.textContent = 'Stressed'
      gpuHealth.className = 'status-value warning'
    } else if (data.temperature > 80 || data.usage > 85) {
      gpuHealth.textContent = 'Good'
      gpuHealth.className = 'status-value caution'
    } else {
      gpuHealth.textContent = 'Excellent'
      gpuHealth.className = 'status-value good'
    }

    // Update power status
    const powerStatus = document.getElementById('power-status')
    if (data.powerLimit > 110) {
      powerStatus.textContent = 'High'
      powerStatus.className = 'status-value caution'
    } else {
      powerStatus.textContent = 'Stable'
      powerStatus.className = 'status-value good'
    }

    // Add log entries for significant events
    this.addLogEntry(data)
  }

  addLogEntry(data) {
    const logContainer = document.getElementById('monitoring-log')
    const now = new Date().toLocaleTimeString()

    // Check for events worth logging
    if (data.temperature > 85 && !this.lastTempWarning) {
      this.addLog(logContainer, now, 'High temperature detected', 'warning')
      this.lastTempWarning = true
    } else if (data.temperature < 80 && this.lastTempWarning) {
      this.addLog(logContainer, now, 'Temperature normalized', 'good')
      this.lastTempWarning = false
    }

    // Keep log size manageable
    const entries = logContainer.querySelectorAll('.log-entry')
    if (entries.length > 10) {
      entries[1].remove() // Keep the first "started" entry
    }
  }

  addLog(container, time, message, type = 'info') {
    const logEntry = document.createElement('div')
    logEntry.className = `log-entry ${type}`
    logEntry.innerHTML = `
      <span class="log-time">[${time}]</span>
      <span class="log-message">${message}</span>
    `
    container.appendChild(logEntry)
    container.scrollTop = container.scrollHeight
  }
}