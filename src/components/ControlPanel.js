export class ControlPanel {
  constructor(container, initialData) {
    this.container = container
    this.data = initialData
    this.onSettingsChange = null
    this.render()
    this.bindEvents()
  }

  render() {
    this.container.innerHTML = `
      <div class="control-panel">
        <h3>GPU Control</h3>
        
        <div class="control-section">
          <div class="control-group">
            <label>Core Clock Offset</label>
            <div class="slider-container">
              <input type="range" id="core-clock" min="-200" max="200" value="0" step="5">
              <span class="slider-value" id="core-clock-value">+0 MHz</span>
            </div>
          </div>

          <div class="control-group">
            <label>Memory Clock Offset</label>
            <div class="slider-container">
              <input type="range" id="memory-clock" min="-500" max="500" value="0" step="10">
              <span class="slider-value" id="memory-clock-value">+0 MHz</span>
            </div>
          </div>

          <div class="control-group">
            <label>Power Limit</label>
            <div class="slider-container">
              <input type="range" id="power-limit" min="50" max="120" value="100" step="1">
              <span class="slider-value" id="power-limit-value">100%</span>
            </div>
          </div>

          <div class="control-group">
            <label>Fan Speed</label>
            <div class="slider-container">
              <input type="range" id="fan-speed" min="0" max="100" value="45" step="1">
              <span class="slider-value" id="fan-speed-value">45%</span>
            </div>
            <div class="fan-mode">
              <label class="checkbox-label">
                <input type="checkbox" id="auto-fan" checked>
                Auto Fan Control
              </label>
            </div>
          </div>
        </div>

        <div class="control-buttons">
          <button class="btn btn-primary" id="apply-settings">Apply</button>
          <button class="btn btn-secondary" id="reset-settings">Reset</button>
          <button class="btn btn-warning" id="save-profile">Save Profile</button>
        </div>

        <div class="profile-section">
          <h4>Profiles</h4>
          <div class="profile-buttons">
            <button class="btn btn-profile active" data-profile="default">Default</button>
            <button class="btn btn-profile" data-profile="gaming">Gaming</button>
            <button class="btn btn-profile" data-profile="silent">Silent</button>
          </div>
        </div>
      </div>
    `
  }

  bindEvents() {
    // Slider events
    const sliders = this.container.querySelectorAll('input[type="range"]')
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        this.updateSliderValue(e.target)
      })
    })

    // Button events
    document.getElementById('apply-settings').addEventListener('click', () => {
      this.applySettings()
    })

    document.getElementById('reset-settings').addEventListener('click', () => {
      this.resetSettings()
    })

    document.getElementById('save-profile').addEventListener('click', () => {
      this.saveProfile()
    })

    // Profile buttons
    const profileButtons = this.container.querySelectorAll('.btn-profile')
    profileButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.loadProfile(e.target.dataset.profile)
        profileButtons.forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
      })
    })

    // Auto fan checkbox
    document.getElementById('auto-fan').addEventListener('change', (e) => {
      const fanSlider = document.getElementById('fan-speed')
      fanSlider.disabled = e.target.checked
      if (e.target.checked) {
        fanSlider.parentElement.classList.add('disabled')
      } else {
        fanSlider.parentElement.classList.remove('disabled')
      }
    })
  }

  updateSliderValue(slider) {
    const valueSpan = document.getElementById(slider.id + '-value')
    let value = parseInt(slider.value)
    let unit = ''
    let prefix = ''

    switch (slider.id) {
      case 'core-clock':
      case 'memory-clock':
        unit = ' MHz'
        prefix = value >= 0 ? '+' : ''
        break
      case 'power-limit':
      case 'fan-speed':
        unit = '%'
        break
    }

    valueSpan.textContent = prefix + value + unit
  }

  applySettings() {
    const settings = {
      coreClockOffset: parseInt(document.getElementById('core-clock').value),
      memoryClockOffset: parseInt(document.getElementById('memory-clock').value),
      powerLimit: parseInt(document.getElementById('power-limit').value),
      fanSpeed: parseInt(document.getElementById('fan-speed').value)
    }

    if (this.onSettingsChange) {
      this.onSettingsChange(settings)
    }

    // Show apply feedback
    const applyBtn = document.getElementById('apply-settings')
    const originalText = applyBtn.textContent
    applyBtn.textContent = 'Applied!'
    applyBtn.classList.add('success')
    
    setTimeout(() => {
      applyBtn.textContent = originalText
      applyBtn.classList.remove('success')
    }, 1500)
  }

  resetSettings() {
    document.getElementById('core-clock').value = 0
    document.getElementById('memory-clock').value = 0
    document.getElementById('power-limit').value = 100
    document.getElementById('fan-speed').value = 45
    
    // Update value displays
    const sliders = this.container.querySelectorAll('input[type="range"]')
    sliders.forEach(slider => this.updateSliderValue(slider))
    
    this.applySettings()
  }

  saveProfile() {
    const profileName = prompt('Enter profile name:')
    if (profileName) {
      // In a real app, this would save to localStorage or a backend
      alert(`Profile "${profileName}" saved!`)
    }
  }

  loadProfile(profileName) {
    const profiles = {
      default: { core: 0, memory: 0, power: 100, fan: 45 },
      gaming: { core: 100, memory: 200, power: 110, fan: 70 },
      silent: { core: -50, memory: -100, power: 80, fan: 30 }
    }

    const profile = profiles[profileName]
    if (profile) {
      document.getElementById('core-clock').value = profile.core
      document.getElementById('memory-clock').value = profile.memory
      document.getElementById('power-limit').value = profile.power
      document.getElementById('fan-speed').value = profile.fan

      const sliders = this.container.querySelectorAll('input[type="range"]')
      sliders.forEach(slider => this.updateSliderValue(slider))
      
      this.applySettings()
    }
  }

  update(data) {
    // Update any dynamic control panel elements if needed
  }
}