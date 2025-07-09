export class GPUMonitor {
  constructor(container) {
    this.container = container
    this.render()
  }

  render() {
    this.container.innerHTML = `
      <div class="gpu-monitor">
        <h3>GPU Monitoring</h3>
        
        <div class="monitor-grid">
          <div class="monitor-item">
            <div class="monitor-label">GPU Temperature</div>
            <div class="monitor-value" id="gpu-temp">
              <span class="value">65</span>
              <span class="unit">°C</span>
            </div>
            <div class="monitor-bar">
              <div class="bar-fill temp-bar" style="width: 65%"></div>
            </div>
          </div>

          <div class="monitor-item">
            <div class="monitor-label">GPU Usage</div>
            <div class="monitor-value" id="gpu-usage">
              <span class="value">78</span>
              <span class="unit">%</span>
            </div>
            <div class="monitor-bar">
              <div class="bar-fill usage-bar" style="width: 78%"></div>
            </div>
          </div>

          <div class="monitor-item">
            <div class="monitor-label">Memory Usage</div>
            <div class="monitor-value" id="memory-usage">
              <span class="value">3.2</span>
              <span class="unit">GB</span>
            </div>
            <div class="monitor-bar">
              <div class="bar-fill memory-bar" style="width: 80%"></div>
            </div>
          </div>

          <div class="monitor-item">
            <div class="monitor-label">Fan Speed</div>
            <div class="monitor-value" id="fan-speed">
              <span class="value">45</span>
              <span class="unit">%</span>
            </div>
            <div class="monitor-bar">
              <div class="bar-fill fan-bar" style="width: 45%"></div>
            </div>
          </div>

          <div class="monitor-item">
            <div class="monitor-label">Core Voltage</div>
            <div class="monitor-value" id="core-voltage">
              <span class="value">1.200</span>
              <span class="unit">V</span>
            </div>
          </div>

          <div class="monitor-item">
            <div class="monitor-label">Power Draw</div>
            <div class="monitor-value" id="power-draw">
              <span class="value">85</span>
              <span class="unit">W</span>
            </div>
          </div>
        </div>
      </div>
    `
  }

  update(data) {
    const status = data.detailedStatus || {}
    
    // Update temperature
    const tempValue = document.querySelector('#gpu-temp .value')
    const tempBar = document.querySelector('.temp-bar')
    tempValue.textContent = Math.round(data.temperature)
    tempBar.style.width = `${Math.min(100, (data.temperature / 100) * 100)}%`
    
    // Update temperature bar styling based on status
    let tempClass = 'bar-fill temp-bar'
    if (status.thermalStatus === 'critical') tempClass += ' critical'
    else if (status.thermalStatus === 'warning') tempClass += ' warning'
    tempBar.className = tempClass

    // Update usage
    const usageValue = document.querySelector('#gpu-usage .value')
    const usageBar = document.querySelector('.usage-bar')
    usageValue.textContent = Math.round(data.usage)
    usageBar.style.width = `${data.usage}%`

    // Update memory
    const memoryValue = document.querySelector('#memory-usage .value')
    const memoryBar = document.querySelector('.memory-bar')
    memoryValue.textContent = data.memoryUsage.toFixed(1)
    memoryBar.style.width = `${(data.memoryUsage / data.totalMemory) * 100}%`

    // Update fan speed
    const fanValue = document.querySelector('#fan-speed .value')
    const fanBar = document.querySelector('.fan-bar')
    fanValue.textContent = Math.round(data.fanSpeed)
    fanBar.style.width = `${data.fanSpeed}%`

    // Update voltage
    const voltageValue = document.querySelector('#core-voltage .value')
    voltageValue.textContent = data.voltage.toFixed(3)

    // Update power draw
    const powerValue = document.querySelector('#power-draw .value')
    powerValue.textContent = Math.round(data.powerDraw)
    
    // Add workload type indicator
    this.updateWorkloadIndicator(data.workloadType, data.workloadIntensity)
  }
  
  updateWorkloadIndicator(workloadType, intensity) {
    let indicator = document.querySelector('.workload-indicator')
    if (!indicator) {
      // Create workload indicator if it doesn't exist
      const monitorGrid = document.querySelector('.monitor-grid')
      const indicatorHTML = `
        <div class="monitor-item workload-indicator">
          <div class="monitor-label">Workload Type</div>
          <div class="monitor-value">
            <span class="workload-type">Idle</span>
            <span class="workload-intensity">20%</span>
          </div>
          <div class="monitor-bar">
            <div class="bar-fill workload-bar" style="width: 20%"></div>
          </div>
        </div>
      `
      monitorGrid.insertAdjacentHTML('beforeend', indicatorHTML)
      indicator = document.querySelector('.workload-indicator')
    }
    
    const typeElement = indicator.querySelector('.workload-type')
    const intensityElement = indicator.querySelector('.workload-intensity')
    const barElement = indicator.querySelector('.workload-bar')
    
    typeElement.textContent = workloadType.charAt(0).toUpperCase() + workloadType.slice(1)
    intensityElement.textContent = Math.round(intensity * 100) + '%'
    barElement.style.width = `${intensity * 100}%`
    
    // Color code based on workload type
    barElement.className = `bar-fill workload-bar ${workloadType}`
  }
}