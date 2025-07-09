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
    // Update temperature
    const tempValue = document.querySelector('#gpu-temp .value')
    const tempBar = document.querySelector('.temp-bar')
    tempValue.textContent = Math.round(data.temperature)
    tempBar.style.width = `${Math.min(100, (data.temperature / 100) * 100)}%`
    tempBar.className = `bar-fill temp-bar ${data.temperature > 80 ? 'critical' : data.temperature > 70 ? 'warning' : ''}`

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

    // Update power draw (simulated)
    const powerValue = document.querySelector('#power-draw .value')
    const basePower = 65
    const powerIncrease = (data.powerLimit - 100) * 0.5 + (data.usage * 0.3)
    powerValue.textContent = Math.round(basePower + powerIncrease)
  }
}