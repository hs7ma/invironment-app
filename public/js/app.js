// API Configuration
const API_URL = '/api/sensor-data';
const POLLING_INTERVAL = 3000; // Poll every 3 seconds

// DOM Elements
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const lightEl = document.getElementById('light');
const gasEl = document.getElementById('gas');
const gasStatusEl = document.getElementById('gasStatus');
const lastUpdateEl = document.getElementById('lastUpdate');
const connectionStatusEl = document.getElementById('connectionStatus');

// Fetch sensor data from API
async function fetchSensorData() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success && result.data) {
            updateDisplay(result.data);
            updateConnectionStatus(true);
        } else {
            console.error('Failed to fetch sensor data');
            updateConnectionStatus(false);
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        updateConnectionStatus(false);
    }
}

// Start polling
function startPolling() {
    // Fetch immediately
    fetchSensorData();

    // Then poll at regular intervals
    setInterval(fetchSensorData, POLLING_INTERVAL);
}

// Update display with sensor data
function updateDisplay(data) {
    // Update temperature
    temperatureEl.textContent = data.temperature.toFixed(1);
    animateValue(temperatureEl);

    // Update humidity
    humidityEl.textContent = data.humidity.toFixed(1);
    animateValue(humidityEl);

    // Update light
    lightEl.textContent = Math.round(data.light);
    animateValue(lightEl);

    // Update gas
    gasEl.textContent = data.gas;
    animateValue(gasEl);

    // Update gas status
    updateGasStatus(data.gas);

    // Update timestamp
    const now = new Date();
    lastUpdateEl.textContent = now.toLocaleTimeString('ar-EG');
}

// Update gas status based on value
function updateGasStatus(gasValue) {
    gasStatusEl.classList.remove('warning', 'danger');

    if (gasValue < 300) {
        gasStatusEl.textContent = 'طبيعي';
        gasStatusEl.classList.remove('warning', 'danger');
    } else if (gasValue < 600) {
        gasStatusEl.textContent = 'تحذير';
        gasStatusEl.classList.add('warning');
    } else {
        gasStatusEl.textContent = 'خطر';
        gasStatusEl.classList.add('danger');
    }
}

// Update connection status
function updateConnectionStatus(connected) {
    connectionStatusEl.classList.remove('connected', 'disconnected');

    if (connected) {
        connectionStatusEl.classList.add('connected');
        connectionStatusEl.querySelector('.status-text').textContent = 'متصل';
    } else {
        connectionStatusEl.classList.add('disconnected');
        connectionStatusEl.querySelector('.status-text').textContent = 'غير متصل';
    }
}

// Animate value change
function animateValue(element) {
    element.style.transform = 'scale(1.1)';
    element.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

// Add animation to cards on load
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Start polling for data
    startPolling();
});
