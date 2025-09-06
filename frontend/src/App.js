// src/App.js - Main React Application
import React, { useState, useEffect } from 'react';
import { 
  Battery, MapPin, Truck, Zap, AlertTriangle, TrendingUp, 
  Navigation, Activity, Brain, Route, Cpu, 
  BarChart3, Users, DollarSign, Clock, X, Plus
} from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

// Components
import InteractiveMap from './components/InteractiveMap';
import AIInsightsDashboard from './components/AIInsightsDashboard';
import FleetCard from './components/FleetCard';
import AddUnitModal from './components/AddUnitModal';
import StatsCard from './components/StatsCard';
import AlertCard from './components/AlertCard';

// Services
import { fleetAPI } from './services/api';

function App() {
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [vehicles, setVehicles] = useState([]);
  const [drones, setDrones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('vehicle');
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [mlPredictions, setMlPredictions] = useState({});
  const [tfModel, setTfModel] = useState(null);

  // Initialize TensorFlow.js
  useEffect(() => {
    const initializeTF = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js initialized');
        
        // Load or create a simple model for demo
        const model = tf.sequential({
          layers: [
            tf.layers.dense({ inputShape: [4], units: 10, activation: 'relu' }),
            tf.layers.dense({ units: 5, activation: 'relu' }),
            tf.layers.dense({ units: 1, activation: 'linear' })
          ]
        });
        
        setTfModel(model);
      } catch (error) {
        console.error('TensorFlow.js initialization failed:', error);
      }
    };

    initializeTF();
  }, []);

  // Initialize fleet data
  useEffect(() => {
    const initializeFleetData = async () => {
      try {
        setLoading(true);
        
        // Initialize with sample data
        const initialVehicles = [
          {
            id: 'CAB-001',
            type: 'Tesla Model 3',
            status: 'active',
            battery: 87,
            location: { lat: 34.0522, lng: -118.2437, address: 'Downtown LA' },
            passenger: 'John D.',
            destination: 'LAX Airport',
            revenue: 45.20,
            eta: 12,
            efficiency: 94,
            mileage: 45000,
            lastService: '2024-01-15'
          },
          {
            id: 'CAB-002',
            type: 'Tesla Model Y',
            status: 'charging',
            battery: 34,
            location: { lat: 34.0689, lng: -118.4452, address: 'Santa Monica' },
            passenger: null,
            destination: null,
            revenue: 128.50,
            eta: null,
            efficiency: 89,
            mileage: 32000,
            lastService: '2024-02-01'
          },
          {
            id: 'CAB-003',
            type: 'Tesla Model S',
            status: 'active',
            battery: 72,
            location: { lat: 34.1478, lng: -118.1445, address: 'Pasadena' },
            passenger: 'Maria S.',
            destination: 'Hollywood',
            revenue: 89.75,
            eta: 18,
            efficiency: 96,
            mileage: 28000,
            lastService: '2024-01-30'
          }
        ];

        const initialDrones = [
          {
            id: 'DRN-001',
            type: 'Delivery Quad',
            status: 'active',
            battery: 61,
            location: { lat: 34.0194, lng: -118.4108, address: 'Culver City' },
            package: 'Medical Supplies',
            destination: 'Cedar-Sinai Hospital',
            weight: '2.3kg',
            eta: 8,
            efficiency: 91,
            flightHours: 150,
            lastService: '2024-02-10'
          },
          {
            id: 'DRN-002',
            type: 'Heavy Lifter',
            status: 'maintenance',
            battery: 0,
            location: { lat: 34.0522, lng: -118.2437, address: 'Service Hub' },
            package: null,
            destination: null,
            weight: '0kg',
            eta: null,
            efficiency: 0,
            flightHours: 300,
            lastService: '2024-01-20'
          }
        ];

        const initialAlerts = [
          {
            id: 1,
            type: 'battery',
            severity: 'warning',
            vehicle: 'CAB-002',
            message: 'Battery below 35% - routing to nearest charging station',
            timestamp: new Date(Date.now() - 300000)
          },
          {
            id: 2,
            type: 'maintenance',
            severity: 'critical',
            vehicle: 'DRN-002',
            message: 'Rotor calibration required - grounded for safety',
            timestamp: new Date(Date.now() - 1200000)
          }
        ];

        setVehicles(initialVehicles);
        setDrones(initialDrones);
        setAlerts(initialAlerts);
        
        // Generate initial ML predictions
        await generateMLPredictions(initialVehicles, initialDrones);
        
      } catch (error) {
        console.error('Failed to initialize fleet data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeFleetData();
  }, []);

  // Generate ML Predictions
  const generateMLPredictions = async (vehicleList, droneList) => {
    const predictions = {};
    
    try {
      // Generate predictions for each vehicle
      for (const vehicle of vehicleList) {
        // Battery life prediction using TensorFlow.js
        if (tfModel) {
          const inputData = tf.tensor2d([[
            vehicle.battery / 100,
            vehicle.efficiency / 100,
            (vehicle.mileage || 50000) / 100000,
            0.8 // normalized usage factor
          ]]);
          
          const prediction = tfModel.predict(inputData);
          const batteryLifeHours = await prediction.data();
          
          inputData.dispose();
          prediction.dispose();
          
          predictions[vehicle.id] = {
            batteryLife: Math.max(1, Math.min(24, batteryLifeHours[0] * 24)),
            confidence: 0.85
          };
        }
        
        // Maintenance prediction via API
        try {
          const maintenanceData = await fleetAPI.predictMaintenance({
            vehicleId: vehicle.id,
            mileage: vehicle.mileage,
            batteryHealth: vehicle.efficiency,
            lastService: vehicle.lastService
          });
          
          predictions[vehicle.id] = {
            ...predictions[vehicle.id],
            maintenance: maintenanceData
          };
        } catch (error) {
          console.error(`Maintenance prediction failed for ${vehicle.id}:`, error);
        }
      }
      
      // Add drone predictions
      for (const drone of droneList) {
        try {
          const maintenanceData = await fleetAPI.predictMaintenance({
            vehicleId: drone.id,
            mileage: drone.flightHours * 50, // Convert flight hours to equivalent mileage
            batteryHealth: drone.efficiency,
            lastService: drone.lastService
          });
          
          predictions[drone.id] = {
            maintenance: maintenanceData,
            flightTime: Math.max(1, 12 - (drone.flightHours / 50))
          };
        } catch (error) {
          console.error(`Maintenance prediction failed for ${drone.id}:`, error);
        }
      }
      
      setMlPredictions(predictions);
    } catch (error) {
      console.error('ML prediction generation failed:', error);
    }
  };

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        battery: vehicle.status === 'charging' 
          ? Math.min(100, vehicle.battery + Math.random() * 2)
          : Math.max(10, vehicle.battery - Math.random() * 0.5),
        efficiency: 85 + Math.random() * 15,
        revenue: vehicle.status === 'active' 
          ? vehicle.revenue + Math.random() * 2
          : vehicle.revenue
      })));

      setDrones(prev => prev.map(drone => ({
        ...drone,
        battery: drone.status === 'active' 
          ? Math.max(10, drone.battery - Math.random() * 1)
          : drone.battery,
        efficiency: drone.status === 'active' ? 80 + Math.random() * 20 : 0
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Generate AI Insights
  const generateAIInsights = async () => {
    try {
      const insights = await fleetAPI.generateInsights({
        vehicles,
        drones,
        alerts
      });
      setAiInsights(insights.insights || []);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    }
  };

  // Add new unit
  const addNewUnit = async (unitData) => {
    try {
      const id = addType === 'vehicle' 
        ? `CAB-${String(vehicles.length + 1).padStart(3, '0')}` 
        : `DRN-${String(drones.length + 1).padStart(3, '0')}`;
      
      const newItem = {
        id,
        ...unitData,
        status: 'active',
        location: { 
          lat: 34.0522 + (Math.random() - 0.5) * 0.1, 
          lng: -118.2437 + (Math.random() - 0.5) * 0.1, 
          address: unitData.location 
        },
        efficiency: 85 + Math.random() * 15,
        ...(addType === 'vehicle' ? {
          passenger: null,
          destination: null,
          revenue: 0,
          eta: null,
          mileage: Math.floor(Math.random() * 50000),
          lastService: new Date().toISOString().split('T')[0]
        } : {
          package: null,
          destination: null,
          weight: '0kg',
          eta: null,
          flightHours: Math.floor(Math.random() * 200),
          lastService: new Date().toISOString().split('T')[0]
        })
      };

      if (addType === 'vehicle') {
        setVehicles(prev => [...prev, newItem]);
      } else {
        setDrones(prev => [...prev, newItem]);
      }

      // Add success alert
      const successAlert = {
        id: Date.now(),
        type: 'success',
        severity: 'info',
        vehicle: id,
        message: `New ${addType} successfully added to fleet`,
        timestamp: new Date()
      };
      setAlerts(prev => [successAlert, ...prev]);

      // Update ML predictions
      await generateMLPredictions(
        addType === 'vehicle' ? [...vehicles, newItem] : vehicles,
        addType === 'drone' ? [...drones, newItem] : drones
      );

    } catch (error) {
      console.error('Failed to add new unit:', error);
    }
  };

  // Remove unit
  const removeUnit = (id, type) => {
    if (type === 'vehicle') {
      setVehicles(prev => prev.filter(v => v.id !== id));
    } else {
      setDrones(prev => prev.filter(d => d.id !== id));
    }
    
    const removeAlert = {
      id: Date.now(),
      type: 'info',
      severity: 'info',
      vehicle: id,
      message: `${type} removed from fleet`,
      timestamp: new Date()
    };
    setAlerts(prev => [removeAlert, ...prev]);
  };

  // Calculate fleet statistics
  const fleetStats = {
    activeVehicles: vehicles.filter(v => v.status === 'active').length,
    totalRevenue: vehicles.reduce((sum, v) => sum + v.revenue, 0),
    averageEfficiency: vehicles.length > 0 
      ? vehicles.reduce((sum, v) => sum + v.efficiency, 0) / vehicles.length 
      : 0,
    activeAlerts: alerts.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing FleetIQ Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-black">FleetIQ Pro</h1>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                AI Powered
              </span>
            </div>
            
            <nav className="flex items-center space-x-8">
              {['overview', 'vehicles', 'drones', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {tab}
                </button>
              ))}
              
              <button
                onClick={() => {
                  setAddType('vehicle');
                  setShowAddModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
              
              <button
                onClick={() => {
                  setAddType('drone');
                  setShowAddModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-black text-black text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Drone</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddUnitModal 
          show={showAddModal}
          type={addType}
          onClose={() => setShowAddModal(false)}
          onAdd={addNewUnit}
        />
        
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard 
                title="Active Vehicles" 
                value={fleetStats.activeVehicles} 
                change={12} 
                icon={Truck} 
                color="#10b981" 
              />
              <StatsCard 
                title="Total Revenue" 
                value={`$${fleetStats.totalRevenue.toFixed(0)}`} 
                change={8} 
                icon={DollarSign} 
                color="#3b82f6" 
              />
              <StatsCard 
                title="Fleet Efficiency" 
                value={`${Math.round(fleetStats.averageEfficiency)}%`} 
                change={-2} 
                icon={Zap} 
                color="#f59e0b" 
              />
              <StatsCard 
                title="Active Alerts" 
                value={fleetStats.activeAlerts} 
                change={null} 
                icon={AlertTriangle} 
                color="#ef4444" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InteractiveMap 
                vehicles={vehicles}
                drones={drones}
                selectedVehicle={selectedVehicle}
              />
              <AIInsightsDashboard 
                vehicles={vehicles}
                drones={drones}
                insights={aiInsights}
                onGenerateInsights={generateAIInsights}
                mlPredictions={mlPredictions}
              />
            </div>

            {/* Recent Alerts */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Recent Alerts</h3>
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No alerts</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Cyber Cabs</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{vehicles.length} Total Vehicles</span>
                <button
                  onClick={() => {
                    setAddType('vehicle');
                    setShowAddModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <FleetCard 
                  key={vehicle.id} 
                  item={vehicle} 
                  type="vehicle"
                  onRemove={removeUnit}
                  onSelect={setSelectedVehicle}
                  mlPrediction={mlPredictions[vehicle.id]}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drones' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Delivery Drones</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{drones.length} Total Drones</span>
                <button
                  onClick={() => {
                    setAddType('drone');
                    setShowAddModal(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Drone</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drones.map(drone => (
                <FleetCard 
                  key={drone.id} 
                  item={drone} 
                  type="drone"
                  onRemove={removeUnit}
                  onSelect={setSelectedVehicle}
                  mlPrediction={mlPredictions[drone.id]}
                />
              ))}
            </div>
          </div>
        )}

{activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-black">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Average Battery Life</span>
                    <span className="font-medium text-black">
                      {Object.values(mlPredictions).length > 0 
                        ? `${(
                            Object.values(mlPredictions)
                              .filter(p => p.batteryLife)
                              .reduce((sum, p) => sum + p.batteryLife, 0) / 
                            (Object.values(mlPredictions).filter(p => p.batteryLife).length || 1)
                          )}`.substring(0, 4) + ' hours'
                        : '8.3 hours'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Daily Revenue per Unit</span>
                    <span className="font-medium text-black">
                      ${(fleetStats.totalRevenue / (vehicles.length || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">Maintenance Cost</span>
                    <span className="font-medium text-black">$45.20/day</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Fleet Utilization</span>
                    <span className="font-medium text-black">
                      {Math.round((fleetStats.activeVehicles / (vehicles.length || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-black mb-4">ML Predictions Summary</h3>
                <div className="space-y-4">
                  {Object.entries(mlPredictions).slice(0, 4).map(([vehicleId, prediction]) => (
                    <div key={vehicleId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-black">{vehicleId}</span>
                        {prediction.maintenance && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            prediction.maintenance.riskScore > 70 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {prediction.maintenance.riskScore > 70 ? 'High Risk' : 'Good'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {prediction.batteryLife && (
                          <div>Battery Life: {prediction.batteryLife.toFixed(1)} hours</div>
                        )}
                        {prediction.maintenance && (
                          <div>Maintenance Risk: {prediction.maintenance.riskScore}%</div>
                        )}
                        {prediction.flightTime && (
                          <div>Flight Time Remaining: {prediction.flightTime.toFixed(1)} hours</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;