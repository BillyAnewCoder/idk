(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=e(a);fetch(a.href,i)}})();class p{constructor(t){this.container=t,this.render()}render(){this.container.innerHTML=`
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
    `}update(t){const e=t.detailedStatus||{},s=document.querySelector("#gpu-temp .value"),a=document.querySelector(".temp-bar");s.textContent=Math.round(t.temperature),a.style.width=`${Math.min(100,t.temperature/100*100)}%`;let i="bar-fill temp-bar";e.thermalStatus==="critical"?i+=" critical":e.thermalStatus==="warning"&&(i+=" warning"),a.className=i;const n=document.querySelector("#gpu-usage .value"),o=document.querySelector(".usage-bar");n.textContent=Math.round(t.usage),o.style.width=`${t.usage}%`;const r=document.querySelector("#memory-usage .value"),c=document.querySelector(".memory-bar");r.textContent=t.memoryUsage.toFixed(1),c.style.width=`${t.memoryUsage/t.totalMemory*100}%`;const m=document.querySelector("#fan-speed .value"),d=document.querySelector(".fan-bar");m.textContent=Math.round(t.fanSpeed),d.style.width=`${t.fanSpeed}%`;const u=document.querySelector("#core-voltage .value");u.textContent=t.voltage.toFixed(3);const h=document.querySelector("#power-draw .value");h.textContent=Math.round(t.powerDraw),this.updateWorkloadIndicator(t.workloadType,t.workloadIntensity)}updateWorkloadIndicator(t,e){let s=document.querySelector(".workload-indicator");s||(document.querySelector(".monitor-grid").insertAdjacentHTML("beforeend",`
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
      `),s=document.querySelector(".workload-indicator"));const a=s.querySelector(".workload-type"),i=s.querySelector(".workload-intensity"),n=s.querySelector(".workload-bar");a.textContent=t.charAt(0).toUpperCase()+t.slice(1),i.textContent=Math.round(e*100)+"%",n.style.width=`${e*100}%`,n.className=`bar-fill workload-bar ${t}`}}class g{constructor(t,e){this.container=t,this.data=e,this.onSettingsChange=null,this.render(),this.bindEvents()}render(){this.container.innerHTML=`
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
    `}bindEvents(){this.container.querySelectorAll('input[type="range"]').forEach(s=>{s.addEventListener("input",a=>{this.updateSliderValue(a.target)})}),document.getElementById("apply-settings").addEventListener("click",()=>{this.applySettings()}),document.getElementById("reset-settings").addEventListener("click",()=>{this.resetSettings()}),document.getElementById("save-profile").addEventListener("click",()=>{this.saveProfile()});const e=this.container.querySelectorAll(".btn-profile");e.forEach(s=>{s.addEventListener("click",a=>{this.loadProfile(a.target.dataset.profile),e.forEach(i=>i.classList.remove("active")),a.target.classList.add("active")})}),document.getElementById("auto-fan").addEventListener("change",s=>{const a=document.getElementById("fan-speed");a.disabled=s.target.checked,s.target.checked?a.parentElement.classList.add("disabled"):a.parentElement.classList.remove("disabled")})}updateSliderValue(t){const e=document.getElementById(t.id+"-value");let s=parseInt(t.value),a="",i="";switch(t.id){case"core-clock":case"memory-clock":a=" MHz",i=s>=0?"+":"";break;case"power-limit":case"fan-speed":a="%";break}e.textContent=i+s+a}applySettings(){const t={coreClockOffset:parseInt(document.getElementById("core-clock").value),memoryClockOffset:parseInt(document.getElementById("memory-clock").value),powerLimit:parseInt(document.getElementById("power-limit").value),fanSpeed:parseInt(document.getElementById("fan-speed").value)};this.onSettingsChange&&this.onSettingsChange(t);const e=document.getElementById("apply-settings"),s=e.textContent;e.textContent="Applied!",e.classList.add("success"),setTimeout(()=>{e.textContent=s,e.classList.remove("success")},1500)}resetSettings(){document.getElementById("core-clock").value=0,document.getElementById("memory-clock").value=0,document.getElementById("power-limit").value=100,document.getElementById("fan-speed").value=45,this.container.querySelectorAll('input[type="range"]').forEach(e=>this.updateSliderValue(e)),this.applySettings()}saveProfile(){const t=prompt("Enter profile name:");t&&alert(`Profile "${t}" saved!`)}loadProfile(t){const s={default:{core:0,memory:0,power:100,fan:45},gaming:{core:100,memory:200,power:110,fan:70},silent:{core:-50,memory:-100,power:80,fan:30}}[t];s&&(document.getElementById("core-clock").value=s.core,document.getElementById("memory-clock").value=s.memory,document.getElementById("power-limit").value=s.power,document.getElementById("fan-speed").value=s.fan,this.container.querySelectorAll('input[type="range"]').forEach(i=>this.updateSliderValue(i)),this.applySettings())}update(t){}}class f{constructor(t){this.container=t,this.dataPoints={temperature:[],usage:[],memory:[],timestamps:[]},this.maxDataPoints=60,this.render(),this.initChart()}render(){this.container.innerHTML=`
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
    `,this.bindEvents()}bindEvents(){const t=this.container.querySelectorAll(".chart-btn");t.forEach(e=>{e.addEventListener("click",s=>{t.forEach(a=>a.classList.remove("active")),s.target.classList.add("active"),this.activeMetric=s.target.dataset.metric,this.drawChart()})})}initChart(){this.canvas=document.getElementById("performance-canvas"),this.ctx=this.canvas.getContext("2d"),this.activeMetric="temperature";const t=this.canvas.getBoundingClientRect();this.canvas.width=t.width*window.devicePixelRatio,this.canvas.height=t.height*window.devicePixelRatio,this.ctx.scale(window.devicePixelRatio,window.devicePixelRatio),this.drawChart()}addDataPoint(t){const e=new Date;this.dataPoints.temperature.push(t.temperature),this.dataPoints.usage.push(t.usage),this.dataPoints.memory.push(t.memoryUsage),this.dataPoints.timestamps.push(e),Object.keys(this.dataPoints).forEach(s=>{this.dataPoints[s].length>this.maxDataPoints&&this.dataPoints[s].shift()}),this.drawChart()}drawChart(){if(!this.ctx)return;const t=this.canvas.width/window.devicePixelRatio,e=this.canvas.height/window.devicePixelRatio,s=40;this.ctx.clearRect(0,0,t,e),this.ctx.fillStyle="#1a1a1a",this.ctx.fillRect(0,0,t,e),this.drawGrid(t,e,s),this.dataPoints[this.activeMetric].length>1&&this.drawLine(this.dataPoints[this.activeMetric],t,e,s),this.drawAxes(t,e,s)}drawGrid(t,e,s){this.ctx.strokeStyle="#333",this.ctx.lineWidth=1;for(let a=0;a<=10;a++){const i=s+(t-2*s)*(a/10);this.ctx.beginPath(),this.ctx.moveTo(i,s),this.ctx.lineTo(i,e-s),this.ctx.stroke()}for(let a=0;a<=5;a++){const i=s+(e-2*s)*(a/5);this.ctx.beginPath(),this.ctx.moveTo(s,i),this.ctx.lineTo(t-s,i),this.ctx.stroke()}}drawLine(t,e,s,a){if(t.length<2)return;const i=e-2*a,n=s-2*a;let o=100,r="#ff6b6b";switch(this.activeMetric){case"temperature":o=100,r="#ff6b6b";break;case"usage":o=100,r="#4ecdc4";break;case"memory":o=4,r="#45b7d1";break}this.ctx.strokeStyle=r,this.ctx.lineWidth=2,this.ctx.beginPath(),t.forEach((c,m)=>{const d=a+i*m/(this.maxDataPoints-1),u=s-a-n*c/o;m===0?this.ctx.moveTo(d,u):this.ctx.lineTo(d,u)}),this.ctx.stroke(),this.ctx.globalAlpha=.2,this.ctx.fillStyle=r,this.ctx.lineTo(a+i*(t.length-1)/(this.maxDataPoints-1),s-a),this.ctx.lineTo(a,s-a),this.ctx.fill(),this.ctx.globalAlpha=1}drawAxes(t,e,s){this.ctx.fillStyle="#ccc",this.ctx.font="12px Arial",this.ctx.textAlign="center";let a=100,i="%";switch(this.activeMetric){case"temperature":a=100,i="°C";break;case"usage":a=100,i="%";break;case"memory":a=4,i="GB";break}for(let n=0;n<=5;n++){const o=a*(5-n)/5,r=s+(e-2*s)*(n/5);this.ctx.textAlign="right",this.ctx.fillText(o.toFixed(0)+i,s-10,r+4)}this.ctx.textAlign="center";for(let n=0;n<=5;n++){const o=s+(t-2*s)*(n/5),r=(5-n)*12;this.ctx.fillText(`-${r}s`,o,e-s+20)}}}class v{constructor(t){this.container=t,this.render()}render(){this.container.innerHTML=`
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
    `}update(t){const e=t.detailedStatus||{},s=document.getElementById("thermal-status");switch(e.thermalStatus){case"critical":s.textContent="Critical",s.className="status-value error";break;case"warning":s.textContent="Hot",s.className="status-value warning";break;case"warm":s.textContent="Warm",s.className="status-value caution";break;default:s.textContent="Normal",s.className="status-value good"}const a=document.getElementById("gpu-health");switch(e.healthStatus){case"stressed":a.textContent="Stressed",a.className="status-value warning";break;case"good":a.textContent="Good",a.className="status-value caution";break;default:a.textContent="Excellent",a.className="status-value good"}const i=document.getElementById("power-status");switch(e.powerStatus){case"high":i.textContent="High",i.className="status-value warning";break;case"elevated":i.textContent="Elevated",i.className="status-value caution";break;default:i.textContent="Stable",i.className="status-value good"}let n=document.getElementById("performance-status");switch(n||(document.querySelector(".status-grid").insertAdjacentHTML("beforeend",`
        <div class="status-item">
          <span class="status-label">Performance:</span>
          <span class="status-value" id="performance-status">Low</span>
        </div>
      `),n=document.getElementById("performance-status")),e.performanceStatus){case"maximum":n.textContent="Maximum",n.className="status-value good";break;case"high":n.textContent="High",n.className="status-value good";break;case"moderate":n.textContent="Moderate",n.className="status-value caution";break;default:n.textContent="Low",n.className="status-value"}this.addEnhancedLogEntry(t,e)}addEnhancedLogEntry(t,e){const s=document.getElementById("monitoring-log"),a=new Date().toLocaleTimeString();t.workloadType!==this.lastWorkloadType&&(this.addLog(s,a,`Workload changed to ${t.workloadType}`,"info"),this.lastWorkloadType=t.workloadType),e.thermalStatus==="critical"&&this.lastThermalStatus!=="critical"?this.addLog(s,a,`Critical temperature: ${Math.round(t.temperature)}°C`,"error"):e.thermalStatus==="warning"&&!["warning","critical"].includes(this.lastThermalStatus)?this.addLog(s,a,`High temperature detected: ${Math.round(t.temperature)}°C`,"warning"):e.thermalStatus==="normal"&&["warning","critical"].includes(this.lastThermalStatus)&&this.addLog(s,a,"Temperature normalized","good"),this.lastThermalStatus=e.thermalStatus,e.performanceStatus==="maximum"&&this.lastPerfStatus!=="maximum"&&this.addLog(s,a,"Maximum performance achieved","good"),this.lastPerfStatus=e.performanceStatus,e.powerStatus==="high"&&this.lastPowerStatus!=="high"&&this.addLog(s,a,`High power draw: ${Math.round(t.powerDraw)}W`,"warning"),this.lastPowerStatus=e.powerStatus;const i=s.querySelectorAll(".log-entry");i.length>15&&i[1].remove()}addLog(t,e,s,a="info"){const i=document.createElement("div");i.className=`log-entry ${a}`,i.innerHTML=`
      <span class="log-time">[${e}]</span>
      <span class="log-message">${s}</span>
    `,t.appendChild(i),t.scrollTop=t.scrollHeight}updateThermalStatus(t,e){t.temperature>85?(e.textContent="Hot",e.className="status-value warning"):t.temperature>75?(e.textContent="Warm",e.className="status-value caution"):(e.textContent="Normal",e.className="status-value good");const s=document.getElementById("gpu-health");t.temperature>90||t.usage>95?(s.textContent="Stressed",s.className="status-value warning"):t.temperature>80||t.usage>85?(s.textContent="Good",s.className="status-value caution"):(s.textContent="Excellent",s.className="status-value good");const a=document.getElementById("power-status");t.powerLimit>110?(a.textContent="High",a.className="status-value caution"):(a.textContent="Stable",a.className="status-value good"),this.addLogEntry(t)}addLogEntry(t){const e=document.getElementById("monitoring-log"),s=new Date().toLocaleTimeString();t.temperature>85&&!this.lastTempWarning?(this.addLog(e,s,"High temperature detected","warning"),this.lastTempWarning=!0):t.temperature<80&&this.lastTempWarning&&(this.addLog(e,s,"Temperature normalized","good"),this.lastTempWarning=!1);const a=e.querySelectorAll(".log-entry");a.length>10&&a[1].remove()}addLog(t,e,s,a="info"){const i=document.createElement("div");i.className=`log-entry ${a}`,i.innerHTML=`
      <span class="log-time">[${e}]</span>
      <span class="log-message">${s}</span>
    `,t.appendChild(i),t.scrollTop=t.scrollHeight}}class y{constructor(){this.baseData={temperature:45,usage:15,memoryUsage:1.2,fanSpeed:30,voltage:1.15,coreClock:1476,memoryClock:1750,powerDraw:45},this.currentData={...this.baseData},this.settings={coreClockOffset:0,memoryClockOffset:0,powerLimit:100,fanSpeed:45,autoFan:!0},this.workloadSimulation={intensity:.2,duration:0,type:"idle"},this.thermalHistory=[],this.startTime=Date.now(),this.systemMetrics=null}updateSettings(t){this.settings={...this.settings,...t},this.simulateSettingsImpact()}updateFromSystemMetrics(t){this.systemMetrics=t,t.memoryUsage&&(this.currentData.memoryUsage=this.currentData.memoryUsage*.7+t.memoryUsage*.3),t.temperature&&(this.currentData.temperature=this.currentData.temperature*.8+t.temperature*.2)}simulateSettingsImpact(){const t=Math.abs(this.settings.coreClockOffset)*.015,e=Math.abs(this.settings.memoryClockOffset)*.008,s=(this.settings.powerLimit-100)*.12;this.baseData.temperature=Math.max(35,Math.min(95,45+t+e+s)),this.baseData.powerDraw=Math.max(25,Math.min(120,45+this.settings.coreClockOffset*.08+this.settings.memoryClockOffset*.04+(this.settings.powerLimit-100)*.3))}simulateWorkload(){const t=(Date.now()-this.startTime)/1e3;let e=.2;t%60<15?(e=.7+Math.sin(t*2)*.2,this.workloadSimulation.type="gaming"):t%120<10?(e=.9,this.workloadSimulation.type="compute"):t%180<5?(e=1,this.workloadSimulation.type="stress"):(e=.1+Math.random()*.3,this.workloadSimulation.type="idle"),this.workloadSimulation.intensity+=(e-this.workloadSimulation.intensity)*.05,this.workloadSimulation.intensity=Math.max(0,Math.min(1,this.workloadSimulation.intensity))}simulateTemperature(){const t=this.workloadSimulation.intensity,e=22,s=95,i=this.baseData.temperature+t*25-this.currentData.temperature;this.currentData.temperature+=i*.02,this.currentData.temperature+=(Math.random()-.5)*1.5,this.currentData.temperature=Math.max(e,Math.min(s,this.currentData.temperature)),this.thermalHistory.push(this.currentData.temperature),this.thermalHistory.length>300&&this.thermalHistory.shift()}simulateFanResponse(){if(this.settings.autoFan){const t=this.currentData.temperature;let e;t<50?e=25:t<65?e=30+(t-50)/15*20:t<80?e=50+(t-65)/15*30:e=80+(t-80)/15*20;const s=e-this.currentData.fanSpeed;this.currentData.fanSpeed+=s*.1}else{const e=this.settings.fanSpeed-this.currentData.fanSpeed;this.currentData.fanSpeed+=e*.05}this.currentData.fanSpeed=Math.max(0,Math.min(100,this.currentData.fanSpeed))}simulateUsage(){let e=this.workloadSimulation.intensity*85+Math.random()*10;if(this.settings.powerLimit<100&&(e*=this.settings.powerLimit/100),this.currentData.temperature>85){const a=Math.max(.5,1-(this.currentData.temperature-85)/10);e*=a}const s=e-this.currentData.usage;this.currentData.usage+=s*.08,this.currentData.usage=Math.max(0,Math.min(100,this.currentData.usage))}simulateMemoryUsage(){const t=this.workloadSimulation.intensity,e=4;let s=.8+t*2.5+Math.sin(Date.now()/1e4)*.3;switch(this.workloadSimulation.type){case"gaming":s+=.5;break;case"compute":s+=1;break;case"stress":s=e*.95;break}const a=s-this.currentData.memoryUsage;this.currentData.memoryUsage+=a*.03,this.currentData.memoryUsage=Math.max(.5,Math.min(e,this.currentData.memoryUsage))}simulateVoltage(){const e=this.currentData.usage/100,s=this.settings.coreClockOffset;let a=1.15+e*.1+Math.abs(s)*2e-4;a+=(Math.random()-.5)*.005;const i=a-this.currentData.voltage;this.currentData.voltage+=i*.1,this.currentData.voltage=Math.max(1,Math.min(1.35,this.currentData.voltage))}simulateClocks(){if(this.currentData.coreClock=1476+this.settings.coreClockOffset,this.currentData.memoryClock=1750+this.settings.memoryClockOffset,this.currentData.temperature>85){const a=Math.max(.8,1-(this.currentData.temperature-85)/20);this.currentData.coreClock*=a}if(this.settings.powerLimit<100){const a=Math.max(.7,this.settings.powerLimit/100);this.currentData.coreClock*=a}const s=this.currentData.usage/100;this.currentData.coreClock+=(Math.random()-.5)*s*50,this.currentData.memoryClock+=(Math.random()-.5)*s*25}simulatePowerDraw(){const t=this.currentData.usage/100,e=this.currentData.temperature;let s=this.baseData.powerDraw+t*40+(e-45)*.5;s+=(Math.random()-.5)*5;const a=s-this.currentData.powerDraw;this.currentData.powerDraw+=a*.1,this.currentData.powerDraw=Math.max(20,Math.min(150,this.currentData.powerDraw))}update(){return this.simulateWorkload(),this.simulateTemperature(),this.simulateFanResponse(),this.simulateUsage(),this.simulateMemoryUsage(),this.simulateVoltage(),this.simulateClocks(),this.simulatePowerDraw(),{...this.currentData,totalMemory:4,workloadType:this.workloadSimulation.type,workloadIntensity:this.workloadSimulation.intensity,powerLimit:this.settings.powerLimit,thermalHistory:[...this.thermalHistory]}}getDetailedStatus(){const t=this.currentData.temperature,e=this.currentData.usage,s=this.currentData.powerDraw;return{thermalStatus:t>85?"critical":t>75?"warning":t>65?"warm":"normal",performanceStatus:e>90?"maximum":e>70?"high":e>40?"moderate":"low",powerStatus:s>100?"high":s>80?"elevated":"normal",healthStatus:t>90||e>95?"stressed":t>80||e>85?"good":"excellent"}}}class w{constructor(){this.isSupported=this.checkSupport(),this.systemInfo={},this.performanceObserver=null,this.memoryInfo=null,this.isSupported&&this.initializeMonitoring()}checkSupport(){return!!(navigator.hardwareConcurrency&&performance.memory&&navigator.deviceMemory)}async initializeMonitoring(){if(this.systemInfo={cpuCores:navigator.hardwareConcurrency,deviceMemory:navigator.deviceMemory,platform:navigator.platform,userAgent:navigator.userAgent,language:navigator.language,onLine:navigator.onLine},"PerformanceObserver"in window)try{this.performanceObserver=new PerformanceObserver(t=>{this.handlePerformanceEntries(t.getEntries())}),this.performanceObserver.observe({entryTypes:["measure","navigation","resource"]})}catch(t){console.warn("Performance Observer not fully supported:",t)}await this.getGPUInfo()}async getGPUInfo(){var t,e,s,a;try{if("gpu"in navigator){const o=await navigator.gpu.requestAdapter();o&&(this.systemInfo.gpu={vendor:((t=o.info)==null?void 0:t.vendor)||"Unknown",architecture:((e=o.info)==null?void 0:e.architecture)||"Unknown",device:((s=o.info)==null?void 0:s.device)||"Unknown",description:((a=o.info)==null?void 0:a.description)||"WebGPU Adapter"})}const i=document.createElement("canvas"),n=i.getContext("webgl")||i.getContext("experimental-webgl");if(n){const o=n.getExtension("WEBGL_debug_renderer_info");o&&(this.systemInfo.webgl={vendor:n.getParameter(o.UNMASKED_VENDOR_WEBGL),renderer:n.getParameter(o.UNMASKED_RENDERER_WEBGL),version:n.getParameter(n.VERSION),shadingLanguageVersion:n.getParameter(n.SHADING_LANGUAGE_VERSION)})}}catch(i){console.warn("GPU info not available:",i)}}handlePerformanceEntries(t){t.forEach(e=>{e.entryType==="navigation"&&(this.systemInfo.pageLoad={domContentLoaded:e.domContentLoadedEventEnd-e.domContentLoadedEventStart,loadComplete:e.loadEventEnd-e.loadEventStart,totalTime:e.loadEventEnd-e.fetchStart})})}getMemoryInfo(){return performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize,jsHeapSizeLimit:performance.memory.jsHeapSizeLimit,usedPercent:performance.memory.usedJSHeapSize/performance.memory.jsHeapSizeLimit*100}:null}getBatteryInfo(){return new Promise(t=>{"getBattery"in navigator?navigator.getBattery().then(e=>{t({charging:e.charging,level:e.level*100,chargingTime:e.chargingTime,dischargingTime:e.dischargingTime})}).catch(()=>t(null)):t(null)})}getNetworkInfo(){if("connection"in navigator){const t=navigator.connection;return{effectiveType:t.effectiveType,downlink:t.downlink,rtt:t.rtt,saveData:t.saveData}}return null}async getCurrentMetrics(){const t={timestamp:Date.now(),memory:this.getMemoryInfo(),network:this.getNetworkInfo(),battery:await this.getBatteryInfo(),system:this.systemInfo,performance:{timing:performance.timing,now:performance.now()}};return t.memory&&(t.simulatedGPU={memoryUsage:t.memory.usedPercent/100*4,temperature:45+t.memory.usedPercent*.3+Math.random()*10,usage:Math.min(100,t.memory.usedPercent+Math.random()*20),fanSpeed:Math.max(30,Math.min(80,30+t.memory.usedPercent*.5))}),t}startMonitoring(t,e=1e3){const s=async()=>{const a=await this.getCurrentMetrics();t(a)};return s(),setInterval(s,e)}stopMonitoring(t){t&&clearInterval(t),this.performanceObserver&&this.performanceObserver.disconnect()}}class b{constructor(t){this.container=t,this.render()}render(){this.container.innerHTML=`
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
    `}update(t){if(t){if(t.system&&(document.getElementById("cpu-cores").textContent=t.system.cpuCores||"-",document.getElementById("device-memory").textContent=t.system.deviceMemory?`${t.system.deviceMemory} GB`:"-",document.getElementById("platform").textContent=t.system.platform||"-",t.system.webgl&&(document.getElementById("webgl-vendor").textContent=t.system.webgl.vendor||"-",document.getElementById("webgl-renderer").textContent=t.system.webgl.renderer||"-")),t.memory){const e=(t.memory.usedJSHeapSize/1024/1024).toFixed(1),s=(t.memory.jsHeapSizeLimit/1024/1024).toFixed(1);document.getElementById("heap-used").textContent=`${e} MB`,document.getElementById("heap-limit").textContent=`${s} MB`;const a=document.getElementById("heap-used-bar");a.style.width=`${t.memory.usedPercent}%`,t.memory.usedPercent>80?a.className="bar-fill memory-used-bar critical":t.memory.usedPercent>60?a.className="bar-fill memory-used-bar warning":a.className="bar-fill memory-used-bar"}t.battery&&(document.getElementById("battery-section").style.display="block",document.getElementById("battery-level").textContent=`${t.battery.level.toFixed(0)}%`,document.getElementById("battery-charging").textContent=t.battery.charging?"Yes":"No"),t.network&&(document.getElementById("network-section").style.display="block",document.getElementById("network-type").textContent=t.network.effectiveType||"-",document.getElementById("network-downlink").textContent=t.network.downlink?`${t.network.downlink} Mbps`:"-")}}}class S{constructor(){this.ws=null,this.isConnected=!1,this.reconnectAttempts=0,this.maxReconnectAttempts=5,this.reconnectDelay=1e3,this.listeners=new Map,this.systemInfo=null,this.lastMetrics=null}connect(){const e=`${window.location.protocol==="https:"?"wss:":"ws:"}//${window.location.host}`;try{this.ws=new WebSocket(e),this.ws.onopen=()=>{console.log("Connected to real-time monitoring server"),this.isConnected=!0,this.reconnectAttempts=0,this.emit("connected")},this.ws.onmessage=s=>{try{const a=JSON.parse(s.data);this.handleMessage(a)}catch(a){console.error("Error parsing WebSocket message:",a)}},this.ws.onclose=()=>{console.log("Disconnected from monitoring server"),this.isConnected=!1,this.emit("disconnected"),this.attemptReconnect()},this.ws.onerror=s=>{console.error("WebSocket error:",s),this.emit("error",s)}}catch(s){console.error("Failed to create WebSocket connection:",s),this.attemptReconnect()}}handleMessage(t){switch(t.type){case"system-info":this.systemInfo=t.data,this.emit("system-info",t.data);break;case"real-time-update":this.lastMetrics=t.data,this.emit("metrics-update",t.data);break;default:console.warn("Unknown message type:",t.type)}}attemptReconnect(){if(this.reconnectAttempts>=this.maxReconnectAttempts){console.error("Max reconnection attempts reached"),this.emit("max-reconnect-attempts");return}this.reconnectAttempts++,console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`),setTimeout(()=>{this.connect()},this.reconnectDelay*this.reconnectAttempts)}disconnect(){this.ws&&(this.ws.close(),this.ws=null),this.isConnected=!1}on(t,e){this.listeners.has(t)||this.listeners.set(t,[]),this.listeners.get(t).push(e)}off(t,e){if(this.listeners.has(t)){const s=this.listeners.get(t),a=s.indexOf(e);a>-1&&s.splice(a,1)}}emit(t,e){this.listeners.has(t)&&this.listeners.get(t).forEach(s=>{try{s(e)}catch(a){console.error(`Error in event listener for ${t}:`,a)}})}async fetchSystemInfo(){try{const t=await fetch("/api/system-info");if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to fetch system info:",t),t}}async fetchGPUMetrics(){try{const t=await fetch("/api/gpu-metrics");if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to fetch GPU metrics:",t),t}}async fetchCPUMetrics(){try{const t=await fetch("/api/cpu-metrics");if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to fetch CPU metrics:",t),t}}async fetchMemoryMetrics(){try{const t=await fetch("/api/memory-metrics");if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to fetch memory metrics:",t),t}}async fetchThermalMetrics(){try{const t=await fetch("/api/thermal-metrics");if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to fetch thermal metrics:",t),t}}async startMonitoring(){try{const t=await fetch("/api/monitoring/start",{method:"POST"});if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to start monitoring:",t),t}}async stopMonitoring(){try{const t=await fetch("/api/monitoring/stop",{method:"POST"});if(!t.ok)throw new Error(`HTTP ${t.status}`);return await t.json()}catch(t){throw console.error("Failed to stop monitoring:",t),t}}getConnectionStatus(){return{connected:this.isConnected,reconnectAttempts:this.reconnectAttempts,hasSystemInfo:!!this.systemInfo,hasMetrics:!!this.lastMetrics}}getSystemInfo(){return this.systemInfo}getLastMetrics(){return this.lastMetrics}}class M{constructor(){this.gpuSimulator=new y,this.systemMonitor=new w,this.realTimeMonitor=new S,this.updateInterval=null,this.systemInterval=null,this.isMonitoring=!1,this.useRealData=!1,this.init(),this.initializeRealTimeMonitoring()}init(){const t=document.querySelector("#app");t.innerHTML=`
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
    `,this.gpuMonitor=new p(document.getElementById("gpu-monitor")),this.controlPanel=new g(document.getElementById("control-panel"),this.gpuData),this.performanceChart=new f(document.getElementById("performance-chart")),this.statusBar=new v(document.getElementById("status-bar")),this.systemInfo=new b(document.getElementById("system-info")),this.bindEvents()}initializeRealTimeMonitoring(){this.realTimeMonitor.on("connected",()=>{console.log("Real-time monitoring connected"),this.updateConnectionStatus(!0)}),this.realTimeMonitor.on("disconnected",()=>{console.log("Real-time monitoring disconnected"),this.updateConnectionStatus(!1),this.useRealData&&this.startSimulationMonitoring()}),this.realTimeMonitor.on("system-info",t=>{console.log("Received system info:",t),this.updateSystemInfo(t)}),this.realTimeMonitor.on("metrics-update",t=>{this.useRealData&&this.updateComponentsWithRealData(t)}),this.realTimeMonitor.on("error",t=>{console.error("Real-time monitoring error:",t),this.addSystemLog("Real-time monitoring error: "+t.message)}),this.realTimeMonitor.connect(),this.startSimulationMonitoring()}bindEvents(){this.controlPanel.onSettingsChange=e=>{this.gpuSimulator.updateSettings(e),this.addSystemLog("Settings applied successfully")},document.getElementById("close").addEventListener("click",()=>{confirm("Are you sure you want to exit GPU Afterburner?")&&window.close()}),document.getElementById("minimize").addEventListener("click",()=>{document.querySelector(".afterburner-container").classList.toggle("minimized")});const t=document.createElement("button");t.className="btn-icon",t.id="monitoring-toggle",t.innerHTML="⏸",t.title="Pause/Resume Monitoring",document.querySelector(".header-controls").insertBefore(t,document.getElementById("settings")),t.addEventListener("click",()=>{this.toggleMonitoring()}),document.getElementById("real-data-toggle").addEventListener("click",()=>{this.toggleRealData()})}toggleRealData(){const t=document.getElementById("real-data-toggle");this.useRealData?(this.useRealData=!1,t.style.background="var(--bg-tertiary)",t.title="Switch to Real Data",this.addSystemLog("Switched to simulated data"),this.startSimulationMonitoring()):this.realTimeMonitor.isConnected?(this.useRealData=!0,t.style.background="var(--success-color)",t.title="Switch to Simulated Data",this.addSystemLog("Switched to real system data"),this.stopSimulationMonitoring()):this.addSystemLog("Real-time monitoring not available")}updateConnectionStatus(t){const e=document.getElementById("real-data-toggle");t?(e.style.opacity="1",this.useRealData&&(e.style.background="var(--success-color)")):(e.style.opacity="0.5",e.style.background="var(--bg-tertiary)")}updateSystemInfo(t){if(t.graphics&&t.graphics.length>0){const e=t.graphics[0],s=document.querySelector(".gpu-info h1");s&&(s.textContent=e.model||e.name||"AMD GPU");const a=document.querySelector(".driver-version");a&&(a.textContent=`Driver: ${e.driverVersion||"Unknown"}`)}}updateComponentsWithRealData(t){var a,i,n,o,r,c;if(!t)return;const e=this.convertRealGPUData(t.gpu),s={...e,detailedStatus:this.calculateDetailedStatus(e)};this.gpuMonitor.update(s),this.controlPanel.update(s),this.performanceChart.addDataPoint(s),this.statusBar.update(s),(t.cpu||t.memory)&&this.systemInfo.update({system:{cpuCores:((i=(a=t.cpu)==null?void 0:a.cores)==null?void 0:i.length)||navigator.hardwareConcurrency,deviceMemory:Math.round(((n=t.memory)==null?void 0:n.total)/(1024*1024*1024))||navigator.deviceMemory,platform:navigator.platform},memory:{usedJSHeapSize:((o=performance.memory)==null?void 0:o.usedJSHeapSize)||0,jsHeapSizeLimit:((r=performance.memory)==null?void 0:r.jsHeapSizeLimit)||0,usedPercent:((c=t.memory)==null?void 0:c.usagePercent)||0}})}convertRealGPUData(t){return t?{temperature:t.temperature||45,usage:t.usage||0,memoryUsage:t.memoryUsage/1024||1.2,totalMemory:t.memoryTotal/1024||4,fanSpeed:t.fanSpeed||45,voltage:t.coreVoltage||1.15,coreClock:t.coreClock||1476,memoryClock:t.memoryClock||1750,powerDraw:t.powerDraw||45,workloadType:this.determineWorkloadType(t.usage),workloadIntensity:(t.usage||0)/100,powerLimit:100}:this.gpuSimulator.update()}determineWorkloadType(t){return t>80?"stress":t>60?"gaming":t>30?"compute":"idle"}calculateDetailedStatus(t){const e=t.temperature,s=t.usage,a=t.powerDraw;return{thermalStatus:e>85?"critical":e>75?"warning":e>65?"warm":"normal",performanceStatus:s>90?"maximum":s>70?"high":s>40?"moderate":"low",powerStatus:a>100?"high":a>80?"elevated":"normal",healthStatus:e>90||s>95?"stressed":e>80||s>85?"good":"excellent"}}toggleMonitoring(){const t=document.getElementById("monitoring-toggle");this.isMonitoring?(this.stopMonitoring(),t.innerHTML="▶",t.title="Resume Monitoring",this.addSystemLog("Monitoring paused")):(this.startMonitoring(),t.innerHTML="⏸",t.title="Pause Monitoring",this.addSystemLog("Monitoring resumed"))}addSystemLog(t){const e=document.getElementById("monitoring-log");if(e){const s=new Date().toLocaleTimeString(),a=document.createElement("div");a.className="log-entry info",a.innerHTML=`
        <span class="log-time">[${s}]</span>
        <span class="log-message">${t}</span>
      `,e.appendChild(a),e.scrollTop=e.scrollHeight}}startSimulationMonitoring(){this.updateInterval&&clearInterval(this.updateInterval),this.isMonitoring=!0,this.updateInterval=setInterval(()=>{this.useRealData||this.updateComponents()},500),this.systemMonitor.isSupported&&(this.systemInterval=this.systemMonitor.startMonitoring(t=>{this.systemInfo.update(t),t.simulatedGPU&&this.gpuSimulator.updateFromSystemMetrics(t.simulatedGPU)},2e3))}stopSimulationMonitoring(){this.isMonitoring=!1,this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=null),this.systemInterval&&(this.systemMonitor.stopMonitoring(this.systemInterval),this.systemInterval=null)}toggleMonitoring(){const t=document.getElementById("monitoring-toggle");this.isMonitoring?(this.stopSimulationMonitoring(),t.innerHTML="▶",t.title="Resume Monitoring",this.addSystemLog("Monitoring paused")):(this.startSimulationMonitoring(),t.innerHTML="⏸",t.title="Pause Monitoring",this.addSystemLog("Monitoring resumed"))}updateComponents(){const t=this.gpuSimulator.update(),e=this.gpuSimulator.getDetailedStatus(),s={...t,detailedStatus:e};this.gpuMonitor.update(s),this.controlPanel.update(s),this.performanceChart.addDataPoint(s),this.statusBar.update(s)}}new M;
