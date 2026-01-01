const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store latest sensor data
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  light: 0,
  gas: 0,
  timestamp: Date.now()
};

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST endpoint - Receive data from ESP32
app.post('/api/sensor-data', (req, res) => {
  try {
    const data = req.body;

    // Update latest sensor data
    latestSensorData = {
      temperature: data.temperature || 0,
      humidity: data.humidity || 0,
      light: data.light || 0,
      gas: data.gas || 0,
      timestamp: Date.now()
    };

    console.log('Received sensor data:', latestSensorData);

    res.status(200).json({
      success: true,
      message: 'Data received successfully',
      data: latestSensorData
    });
  } catch (error) {
    console.error('Error processing POST request:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing data',
      error: error.message
    });
  }
});

// GET endpoint - Send data to web client
app.get('/api/sensor-data', (req, res) => {
  res.status(200).json({
    success: true,
    data: latestSensorData
  });
});

// Start server (for local development)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
