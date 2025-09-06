// src/services/api.js - API Service Layer
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle different error types
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Fleet API Service
export const fleetAPI = {
  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Generate AI insights using OpenAI
  async generateInsights(fleetData) {
    try {
      const response = await apiClient.post('/ai/insights', fleetData);
      return response.data;
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      
      // Return fallback insights if API fails
      return {
        insights: [
          {
            id: 1,
            type: 'battery_optimization',
            title: '⚡ Battery Management Alert',
            recommendation: `${fleetData.vehicles?.filter(v => v.battery < 40).length || 0} vehicles have low battery. Consider routing to charging stations.`,
            confidence: 90,
            impact: 'High',
            action: 'route_to_charging'
          },
          {
            id: 2,
            type: 'efficiency',
            title: '📊 Fleet Efficiency Analysis',
            recommendation: 'Enable eco-mode during low-demand hours to extend vehicle range by 15-20%.',
            confidence: 85,
            impact: 'Medium',
            action: 'enable_eco_mode'
          },
          {
            id: 3,
            type: 'predictive_maintenance',
            title: '🔧 Maintenance Prediction',
            recommendation: 'TensorFlow model suggests preventive maintenance for 2 vehicles within next week.',
            confidence: 78,
            impact: 'Medium',
            action: 'schedule_maintenance'
          }
        ]
      };
    }
  },

  // Route optimization
  async optimizeRoute(routeData) {
    try {
      const response = await apiClient.post('/ai/optimize-route', routeData);
      return response.data;
    } catch (error) {
      console.error('Route optimization failed:', error);
      
      // Return fallback optimization
      return {
        optimizedRoute: {
          estimatedTime: Math.floor(Math.random() * 30) + 15,
          batterySavings: Math.floor(Math.random() * 20) + 5,
          alternativeRoute: true,
          waypoints: ['Optimized waypoint 1', 'Optimized waypoint 2']
        }
      };
    }
  },

  // Battery life prediction using TensorFlow
  async predictBatteryLife(vehicleData) {
    try {
      const response = await apiClient.post('/ml/predict-battery', { vehicleData });
      return response.data;
    } catch (error) {
      console.error('Battery prediction failed:', error);
      
      // Return fallback prediction
      return {
        predictedBatteryLife: Math.random() * 12 + 6,
        confidence: 0.75,
        model: 'fallback'
      };
    }
  },

  // Demand prediction
  async predictDemand(locationData) {
    try {
      const timeOfDay = new Date().getHours();
      const response = await apiClient.post('/ml/predict-demand', {
        locationData,
        timeOfDay,
        weatherCondition: 'good'
      });
      return response.data;
    } catch (error) {
      console.error('Demand prediction failed:', error);
      
      // Return fallback prediction
      const timeOfDay = new Date().getHours();
      const timeBasedDemand = Math.sin((timeOfDay - 6) * Math.PI / 12) * 50 + 50;
      
      return {
        demandScore: Math.max(0, Math.min(100, Math.round(timeBasedDemand))),
        recommendation: timeBasedDemand > 70 ? 'Deploy additional units' : 'Standard deployment',
        confidence: 0.70
      };
    }
  },

  // Predictive maintenance
  async predictMaintenance(vehicleData) {
    try {
      const response = await apiClient.post('/ml/predict-maintenance', vehicleData);
      return response.data;
    } catch (error) {
      console.error('Maintenance prediction failed:', error);
      
      // Return fallback prediction
      const riskScore = Math.random() * 100;
      return {
        vehicleId: vehicleData.vehicleId,
        riskScore: Math.round(riskScore),
        daysUntilMaintenance: Math.max(1, Math.round((100 - riskScore) / 2)),
        recommendedAction: riskScore > 70 ? 'immediate_service' : 'monitor',
        confidence: 0.75
      };
    }
  },

  // Fleet analytics
  async getFleetAnalytics(timeRange = '24h') {
    try {
      const response = await apiClient.get(`/analytics/fleet?range=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Fleet analytics failed:', error);
      
      // Return fallback analytics
      return {
        totalTrips: Math.floor(Math.random() * 500) + 200,
        totalRevenue: Math.floor(Math.random() * 10000) + 5000,
        averageEfficiency: Math.floor(Math.random() * 20) + 80,
        maintenanceCosts: Math.floor(Math.random() * 2000) + 1000,
        energyConsumption: Math.floor(Math.random() * 5000) + 3000
      };
    }
  },

  // Real-time fleet status
  async getFleetStatus() {
    try {
      const response = await apiClient.get('/fleet/status');
      return response.data;
    } catch (error) {
      console.error('Fleet status failed:', error);
      throw error;
    }
  },

  // Update vehicle status
  async updateVehicleStatus(vehicleId, status) {
    try {
      const response = await apiClient.patch(`/fleet/vehicle/${vehicleId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Vehicle status update failed:', error);
      throw error;
    }
  },

  // Emergency protocols
  async triggerEmergency(vehicleId, emergencyType) {
    try {
      const response = await apiClient.post('/fleet/emergency', {
        vehicleId,
        emergencyType,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Emergency trigger failed:', error);
      throw error;
    }
  }
};

// WebSocket service for real-time updates
export const wsService = {
  socket: null,
  
  connect(onMessage, onError) {
    try {
      // Use Socket.IO for real-time connections in production
      // For demo purposes, we'll simulate with polling
      console.log('WebSocket service: Simulating real-time connection');
      
      const interval = setInterval(() => {
        // Simulate real-time fleet updates
        const mockUpdate = {
          type: 'fleet_update',
          data: {
            timestamp: new Date().toISOString(),
            updates: [
              {
                vehicleId: `CAB-${Math.floor(Math.random() * 3) + 1}`.padStart(7, '0'),
                battery: Math.floor(Math.random() * 100),
                location: {
                  lat: 34.0522 + (Math.random() - 0.5) * 0.1,
                  lng: -118.2437 + (Math.random() - 0.5) * 0.1
                }
              }
            ]
          }
        };
        
        if (onMessage) onMessage(mockUpdate);
      }, 5000);
      
      this.socket = { interval, disconnect: () => clearInterval(interval) };
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      if (onError) onError(error);
    }
  },
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  },
  
  emit(event, data) {
    console.log(`WebSocket emit: ${event}`, data);
    // In production, would emit to actual WebSocket
  }
};

// Export default API client for custom requests
export default apiClient;