export class SystemInfo {
  constructor(container) {
    this.container = container
    this.render()
  }

  render() {
    this.container.innerHTML = `
      <div class="system-info">
        <h3>System Information</h3>
        
        <div class="info-sections">
          <div class="info-section">
            <h4>Hardware</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">CPU Cores:</span>
                <span class="info-value" id="cpu-cores">-</span>
              </div>
              <div class="info-item">
                <span class="info-label">Device Memory:</span>
                <span class="info-value" id="device-memory">-</span>
              </div>
              <div class="info-item">
                <span class="info-label">Platform:</span>
                <span class="info-value" id="platform">-</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h4>Graphics</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">WebGL Vendor:</span>
                <span class="info-value" id="webgl-vendor">-</span>
              </div>
              <div class="info-item">
                <span class="info-label">WebGL Renderer:</span>
                <span class="info-value" id="webgl-renderer">-</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h4>Memory Usage</h4>
            <div class="memory-monitor">
              <div class="memory-item">
                <span class="memory-label">JS Heap Used:</span>
                <span class="memory-value" id="heap-used">-</span>
                <div class="memory-bar">
                  <div class="bar-fill memory-used-bar" id="heap-used-bar"></div>
                </div>
              </div>
              <div class="memory-item">
                <span class="memory-label">Heap Limit:</span>
                <span class="memory-value" id="heap-limit">-</span>
              </div>
            </div>
          </div>

          <div class="info-section" id="battery-section" style="display: none;">
            <h4>Battery</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Level:</span>
                <span class="info-value" id="battery-level">-</span>
              </div>
              <div class="info-item">
                <span class="info-label">Charging:</span>
                <span class="info-value" id="battery-charging">-</span>
              </div>
            </div>
          </div>

          <div class="info-section" id="network-section" style="display: none;">
            <h4>Network</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Connection:</span>
                <span class="info-value" id="network-type">-</span>
              </div>
              <div class="info-item">
                <span class="info-label">Downlink:</span>
                <span class="info-value" id="network-downlink">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  update(metrics) {
    if (!metrics) return

    // Update system info
    if (metrics.system) {
      document.getElementById('cpu-cores').textContent = metrics.system.cpuCores || '-'
      document.getElementById('device-memory').textContent = 
        metrics.system.deviceMemory ? `${metrics.system.deviceMemory} GB` : '-'
      document.getElementById('platform').textContent = metrics.system.platform || '-'

      if (metrics.system.webgl) {
        document.getElementById('webgl-vendor').textContent = metrics.system.webgl.vendor || '-'
        document.getElementById('webgl-renderer').textContent = metrics.system.webgl.renderer || '-'
      }
    }

    // Update memory info
    if (metrics.memory) {
      const usedMB = (metrics.memory.usedJSHeapSize / 1024 / 1024).toFixed(1)
      const limitMB = (metrics.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)
      
      document.getElementById('heap-used').textContent = `${usedMB} MB`
      document.getElementById('heap-limit').textContent = `${limitMB} MB`
      
      const usedBar = document.getElementById('heap-used-bar')
      usedBar.style.width = `${metrics.memory.usedPercent}%`
      
      // Color code based on usage
      if (metrics.memory.usedPercent > 80) {
        usedBar.className = 'bar-fill memory-used-bar critical'
      } else if (metrics.memory.usedPercent > 60) {
        usedBar.className = 'bar-fill memory-used-bar warning'
      } else {
        usedBar.className = 'bar-fill memory-used-bar'
      }
    }

    // Update battery info
    if (metrics.battery) {
      document.getElementById('battery-section').style.display = 'block'
      document.getElementById('battery-level').textContent = `${metrics.battery.level.toFixed(0)}%`
      document.getElementById('battery-charging').textContent = metrics.battery.charging ? 'Yes' : 'No'
    }

    // Update network info
    if (metrics.network) {
      document.getElementById('network-section').style.display = 'block'
      document.getElementById('network-type').textContent = metrics.network.effectiveType || '-'
      document.getElementById('network-downlink').textContent = 
        metrics.network.downlink ? `${metrics.network.downlink} Mbps` : '-'
    }
  }
}