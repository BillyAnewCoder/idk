export class GPUSimulator {
  constructor() {
    this.baseData = {
      temperature: 45,
      usage: 15,
      memoryUsage: 1.2,
      fanSpeed: 30,
      voltage: 1.150,
      coreClock: 1476,
      memoryClock: 1750,
      powerDraw: 45
    }
    
    this.currentData = { ...this.baseData }
    this.settings = {
      coreClockOffset: 0,
      memoryClockOffset: 0,
      powerLimit: 100,
      fanSpeed: 45,
      autoFan: true
    }
    
    this.workloadSimulation = {
      intensity: 0.2, // 0-1 scale
      duration: 0,
      type: 'idle' // idle, gaming, compute, stress
    }
    
    this.thermalHistory = []
    this.startTime = Date.now()
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
    this.simulateSettingsImpact()
  }

  simulateSettingsImpact() {
    // Core clock offset affects temperature and power
    const coreImpact = Math.abs(this.settings.coreClockOffset) * 0.015
    
    // Memory clock offset affects temperature and power
    const memoryImpact = Math.abs(this.settings.memoryClockOffset) * 0.008
    
    // Power limit affects maximum performance and heat
    const powerImpact = (this.settings.powerLimit - 100) * 0.12
    
    // Calculate new base temperature
    this.baseData.temperature = Math.max(35, Math.min(95, 
      45 + coreImpact + memoryImpact + powerImpact
    ))
    
    // Adjust base power draw
    this.baseData.powerDraw = Math.max(25, Math.min(120,
      45 + (this.settings.coreClockOffset * 0.08) + 
      (this.settings.memoryClockOffset * 0.04) + 
      ((this.settings.powerLimit - 100) * 0.3)
    ))
  }

  simulateWorkload() {
    const time = (Date.now() - this.startTime) / 1000
    
    // Simulate different workload patterns
    let targetIntensity = 0.2
    
    // Create realistic usage patterns
    if (time % 60 < 15) {
      // Gaming burst every minute
      targetIntensity = 0.7 + Math.sin(time * 2) * 0.2
      this.workloadSimulation.type = 'gaming'
    } else if (time % 120 < 10) {
      // Compute workload every 2 minutes
      targetIntensity = 0.9
      this.workloadSimulation.type = 'compute'
    } else if (time % 180 < 5) {
      // Stress test every 3 minutes
      targetIntensity = 1.0
      this.workloadSimulation.type = 'stress'
    } else {
      // Idle with occasional spikes
      targetIntensity = 0.1 + Math.random() * 0.3
      this.workloadSimulation.type = 'idle'
    }
    
    // Smooth transition to target intensity
    this.workloadSimulation.intensity += (targetIntensity - this.workloadSimulation.intensity) * 0.05
    this.workloadSimulation.intensity = Math.max(0, Math.min(1, this.workloadSimulation.intensity))
  }

  simulateTemperature() {
    const intensity = this.workloadSimulation.intensity
    const ambientTemp = 22
    const maxTemp = 95
    
    // Calculate target temperature based on workload and settings
    let targetTemp = this.baseData.temperature + (intensity * 25)
    
    // Add thermal inertia - temperature changes slowly
    const tempDiff = targetTemp - this.currentData.temperature
    this.currentData.temperature += tempDiff * 0.02
    
    // Add some realistic noise
    this.currentData.temperature += (Math.random() - 0.5) * 1.5
    
    // Clamp temperature
    this.currentData.temperature = Math.max(ambientTemp, Math.min(maxTemp, this.currentData.temperature))
    
    // Store thermal history
    this.thermalHistory.push(this.currentData.temperature)
    if (this.thermalHistory.length > 300) {
      this.thermalHistory.shift()
    }
  }

  simulateFanResponse() {
    if (this.settings.autoFan) {
      // Automatic fan curve based on temperature
      const temp = this.currentData.temperature
      let targetFanSpeed
      
      if (temp < 50) {
        targetFanSpeed = 25
      } else if (temp < 65) {
        targetFanSpeed = 30 + ((temp - 50) / 15) * 20
      } else if (temp < 80) {
        targetFanSpeed = 50 + ((temp - 65) / 15) * 30
      } else {
        targetFanSpeed = 80 + ((temp - 80) / 15) * 20
      }
      
      // Smooth fan speed changes
      const fanDiff = targetFanSpeed - this.currentData.fanSpeed
      this.currentData.fanSpeed += fanDiff * 0.1
    } else {
      // Manual fan control
      const targetFanSpeed = this.settings.fanSpeed
      const fanDiff = targetFanSpeed - this.currentData.fanSpeed
      this.currentData.fanSpeed += fanDiff * 0.05
    }
    
    this.currentData.fanSpeed = Math.max(0, Math.min(100, this.currentData.fanSpeed))
  }

  simulateUsage() {
    const intensity = this.workloadSimulation.intensity
    
    // Base usage from workload intensity
    let targetUsage = intensity * 85 + (Math.random() * 10)
    
    // Power limit affects maximum achievable usage
    if (this.settings.powerLimit < 100) {
      targetUsage *= (this.settings.powerLimit / 100)
    }
    
    // Thermal throttling
    if (this.currentData.temperature > 85) {
      const throttleFactor = Math.max(0.5, 1 - ((this.currentData.temperature - 85) / 10))
      targetUsage *= throttleFactor
    }
    
    // Smooth usage changes
    const usageDiff = targetUsage - this.currentData.usage
    this.currentData.usage += usageDiff * 0.08
    
    this.currentData.usage = Math.max(0, Math.min(100, this.currentData.usage))
  }

  simulateMemoryUsage() {
    const intensity = this.workloadSimulation.intensity
    const maxMemory = 4.0
    
    // Memory usage correlates with GPU usage but with different patterns
    let targetMemory = 0.8 + (intensity * 2.5) + (Math.sin(Date.now() / 10000) * 0.3)
    
    // Different workload types use memory differently
    switch (this.workloadSimulation.type) {
      case 'gaming':
        targetMemory += 0.5
        break
      case 'compute':
        targetMemory += 1.0
        break
      case 'stress':
        targetMemory = maxMemory * 0.95
        break
    }
    
    // Smooth memory usage changes
    const memoryDiff = targetMemory - this.currentData.memoryUsage
    this.currentData.memoryUsage += memoryDiff * 0.03
    
    this.currentData.memoryUsage = Math.max(0.5, Math.min(maxMemory, this.currentData.memoryUsage))
  }

  simulateVoltage() {
    const baseVoltage = 1.150
    const usage = this.currentData.usage / 100
    const coreOffset = this.settings.coreClockOffset
    
    // Voltage increases with usage and core clock offset
    let targetVoltage = baseVoltage + (usage * 0.100) + (Math.abs(coreOffset) * 0.0002)
    
    // Add some realistic fluctuation
    targetVoltage += (Math.random() - 0.5) * 0.005
    
    // Smooth voltage changes
    const voltageDiff = targetVoltage - this.currentData.voltage
    this.currentData.voltage += voltageDiff * 0.1
    
    this.currentData.voltage = Math.max(1.000, Math.min(1.350, this.currentData.voltage))
  }

  simulateClocks() {
    const baseCoreClock = 1476
    const baseMemoryClock = 1750
    
    // Apply user offsets
    this.currentData.coreClock = baseCoreClock + this.settings.coreClockOffset
    this.currentData.memoryClock = baseMemoryClock + this.settings.memoryClockOffset
    
    // Thermal throttling affects actual clocks
    if (this.currentData.temperature > 85) {
      const throttleFactor = Math.max(0.8, 1 - ((this.currentData.temperature - 85) / 20))
      this.currentData.coreClock *= throttleFactor
    }
    
    // Power limit throttling
    if (this.settings.powerLimit < 100) {
      const powerFactor = Math.max(0.7, this.settings.powerLimit / 100)
      this.currentData.coreClock *= powerFactor
    }
    
    // Add realistic clock fluctuations during load
    const usage = this.currentData.usage / 100
    this.currentData.coreClock += (Math.random() - 0.5) * usage * 50
    this.currentData.memoryClock += (Math.random() - 0.5) * usage * 25
  }

  simulatePowerDraw() {
    const usage = this.currentData.usage / 100
    const temp = this.currentData.temperature
    
    // Power draw based on usage, temperature, and settings
    let targetPower = this.baseData.powerDraw + (usage * 40) + ((temp - 45) * 0.5)
    
    // Add realistic fluctuations
    targetPower += (Math.random() - 0.5) * 5
    
    // Smooth power changes
    const powerDiff = targetPower - this.currentData.powerDraw
    this.currentData.powerDraw += powerDiff * 0.1
    
    this.currentData.powerDraw = Math.max(20, Math.min(150, this.currentData.powerDraw))
  }

  update() {
    this.simulateWorkload()
    this.simulateTemperature()
    this.simulateFanResponse()
    this.simulateUsage()
    this.simulateMemoryUsage()
    this.simulateVoltage()
    this.simulateClocks()
    this.simulatePowerDraw()
    
    return {
      ...this.currentData,
      totalMemory: 4.0,
      workloadType: this.workloadSimulation.type,
      workloadIntensity: this.workloadSimulation.intensity,
      powerLimit: this.settings.powerLimit,
      thermalHistory: [...this.thermalHistory]
    }
  }

  getDetailedStatus() {
    const temp = this.currentData.temperature
    const usage = this.currentData.usage
    const power = this.currentData.powerDraw
    
    return {
      thermalStatus: temp > 85 ? 'critical' : temp > 75 ? 'warning' : temp > 65 ? 'warm' : 'normal',
      performanceStatus: usage > 90 ? 'maximum' : usage > 70 ? 'high' : usage > 40 ? 'moderate' : 'low',
      powerStatus: power > 100 ? 'high' : power > 80 ? 'elevated' : 'normal',
      healthStatus: (temp > 90 || usage > 95) ? 'stressed' : (temp > 80 || usage > 85) ? 'good' : 'excellent'
    }
  }
}