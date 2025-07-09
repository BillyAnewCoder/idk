export class PerformanceChart {
  constructor(container) {
    this.container = container
    this.dataPoints = {
      temperature: [],
      usage: [],
      memory: [],
      timestamps: []
    }
    this.maxDataPoints = 60 // 1 minute of data
    this.render()
    this.initChart()
  }

  render() {
    this.container.innerHTML = `
      <div class="performance-chart">
        <h3>Performance Monitoring</h3>
        <div class="chart-controls">
          <button class="chart-btn active" data-metric="temperature">Temperature</button>
          <button class="chart-btn" data-metric="usage">GPU Usage</button>
          <button class="chart-btn" data-metric="memory">Memory</button>
        </div>
        <div class="chart-container">
          <canvas id="performance-canvas" width="400" height="200"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color temp"></span>
            <span>Temperature (°C)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color usage"></span>
            <span>GPU Usage (%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color memory"></span>
            <span>Memory Usage (GB)</span>
          </div>
        </div>
      </div>
    `

    this.bindEvents()
  }

  bindEvents() {
    const chartButtons = this.container.querySelectorAll('.chart-btn')
    chartButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        chartButtons.forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
        this.activeMetric = e.target.dataset.metric
        this.drawChart()
      })
    })
  }

  initChart() {
    this.canvas = document.getElementById('performance-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.activeMetric = 'temperature'
    
    // Set canvas size
    const rect = this.canvas.getBoundingClientRect()
    this.canvas.width = rect.width * window.devicePixelRatio
    this.canvas.height = rect.height * window.devicePixelRatio
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    this.drawChart()
  }

  addDataPoint(data) {
    const now = new Date()
    
    this.dataPoints.temperature.push(data.temperature)
    this.dataPoints.usage.push(data.usage)
    this.dataPoints.memory.push(data.memoryUsage)
    this.dataPoints.timestamps.push(now)

    // Keep only the last N data points
    Object.keys(this.dataPoints).forEach(key => {
      if (this.dataPoints[key].length > this.maxDataPoints) {
        this.dataPoints[key].shift()
      }
    })

    this.drawChart()
  }

  drawChart() {
    if (!this.ctx) return

    const width = this.canvas.width / window.devicePixelRatio
    const height = this.canvas.height / window.devicePixelRatio
    const padding = 40

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height)

    // Draw background
    this.ctx.fillStyle = '#1a1a1a'
    this.ctx.fillRect(0, 0, width, height)

    // Draw grid
    this.drawGrid(width, height, padding)

    // Draw chart based on active metric
    if (this.dataPoints[this.activeMetric].length > 1) {
      this.drawLine(this.dataPoints[this.activeMetric], width, height, padding)
    }

    // Draw axes labels
    this.drawAxes(width, height, padding)
  }

  drawGrid(width, height, padding) {
    this.ctx.strokeStyle = '#333'
    this.ctx.lineWidth = 1

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (width - 2 * padding) * (i / 10)
      this.ctx.beginPath()
      this.ctx.moveTo(x, padding)
      this.ctx.lineTo(x, height - padding)
      this.ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - 2 * padding) * (i / 5)
      this.ctx.beginPath()
      this.ctx.moveTo(padding, y)
      this.ctx.lineTo(width - padding, y)
      this.ctx.stroke()
    }
  }

  drawLine(data, width, height, padding) {
    if (data.length < 2) return

    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Determine scale based on metric
    let maxValue = 100
    let color = '#ff6b6b'

    switch (this.activeMetric) {
      case 'temperature':
        maxValue = 100
        color = '#ff6b6b'
        break
      case 'usage':
        maxValue = 100
        color = '#4ecdc4'
        break
      case 'memory':
        maxValue = 4
        color = '#45b7d1'
        break
    }

    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2
    this.ctx.beginPath()

    data.forEach((value, index) => {
      const x = padding + (chartWidth * index) / (this.maxDataPoints - 1)
      const y = height - padding - (chartHeight * value) / maxValue

      if (index === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    })

    this.ctx.stroke()

    // Fill area under curve
    this.ctx.globalAlpha = 0.2
    this.ctx.fillStyle = color
    this.ctx.lineTo(padding + (chartWidth * (data.length - 1)) / (this.maxDataPoints - 1), height - padding)
    this.ctx.lineTo(padding, height - padding)
    this.ctx.fill()
    this.ctx.globalAlpha = 1
  }

  drawAxes(width, height, padding) {
    this.ctx.fillStyle = '#ccc'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'

    // Y-axis labels
    let maxValue = 100
    let unit = '%'

    switch (this.activeMetric) {
      case 'temperature':
        maxValue = 100
        unit = '°C'
        break
      case 'usage':
        maxValue = 100
        unit = '%'
        break
      case 'memory':
        maxValue = 4
        unit = 'GB'
        break
    }

    for (let i = 0; i <= 5; i++) {
      const value = (maxValue * (5 - i)) / 5
      const y = padding + (height - 2 * padding) * (i / 5)
      this.ctx.textAlign = 'right'
      this.ctx.fillText(value.toFixed(0) + unit, padding - 10, y + 4)
    }

    // X-axis labels (time)
    this.ctx.textAlign = 'center'
    for (let i = 0; i <= 5; i++) {
      const x = padding + (width - 2 * padding) * (i / 5)
      const secondsAgo = (5 - i) * 12 // 60 seconds total, 5 intervals
      this.ctx.fillText(`-${secondsAgo}s`, x, height - padding + 20)
    }
  }
}