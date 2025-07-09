const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const SystemMonitor = require('./SystemMonitor');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Initialize system monitor
const systemMonitor = new SystemMonitor();

// Store connected clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  // Send initial system info
  systemMonitor.getSystemInfo().then(info => {
    ws.send(JSON.stringify({ type: 'system-info', data: info }));
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// REST API Endpoints
app.get('/api/system-info', async (req, res) => {
  try {
    const info = await systemMonitor.getSystemInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/gpu-metrics', async (req, res) => {
  try {
    const metrics = await systemMonitor.getGPUMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cpu-metrics', async (req, res) => {
  try {
    const metrics = await systemMonitor.getCPUMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/memory-metrics', async (req, res) => {
  try {
    const metrics = await systemMonitor.getMemoryMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/thermal-metrics', async (req, res) => {
  try {
    const metrics = await systemMonitor.getThermalMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start real-time monitoring
let monitoringInterval;

function startRealTimeMonitoring() {
  monitoringInterval = setInterval(async () => {
    try {
      const [gpu, cpu, memory, thermal] = await Promise.all([
        systemMonitor.getGPUMetrics(),
        systemMonitor.getCPUMetrics(),
        systemMonitor.getMemoryMetrics(),
        systemMonitor.getThermalMetrics()
      ]);
      
      broadcast({
        type: 'real-time-update',
        timestamp: Date.now(),
        data: { gpu, cpu, memory, thermal }
      });
    } catch (error) {
      console.error('Monitoring error:', error);
    }
  }, 1000); // Update every second
}

function stopRealTimeMonitoring() {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
}

// Control endpoints
app.post('/api/monitoring/start', (req, res) => {
  startRealTimeMonitoring();
  res.json({ status: 'started' });
});

app.post('/api/monitoring/stop', (req, res) => {
  stopRealTimeMonitoring();
  res.json({ status: 'stopped' });
});

// Serve the web app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`AMD System Monitor API running on http://localhost:${PORT}`);
  console.log('WebSocket server ready for real-time monitoring');
  
  // Start monitoring automatically
  startRealTimeMonitoring();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  stopRealTimeMonitoring();
  server.close(() => {
    process.exit(0);
  });
});