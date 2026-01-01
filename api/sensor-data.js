// In-memory storage for sensor data (in production, use a database)
let latestSensorData = {
  temperature: 0,
  humidity: 0,
  light: 0,
  gas: 0,
  timestamp: Date.now()
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST - Receive data from ESP32
  if (req.method === 'POST') {
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
  }

  // GET - Send data to web client
  else if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: latestSensorData
    });
  }

  // Method not allowed
  else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}
