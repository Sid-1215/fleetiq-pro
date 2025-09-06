// src/components/FleetCard.js - Fleet Vehicle/Drone Card Component
import React, { useState, useEffect } from 'react';
import { 
  Battery, MapPin, Users, Zap, Clock, DollarSign, X, Route, AlertTriangle 
} from 'lucide-react';
import { fleetAPI } from '../services/api';

const FleetCard = ({ item, type, onRemove, onSelect, mlPrediction }) => {
  const [optimizing, setOptimizing] = useState(false);
  const [localPrediction, setLocalPrediction] = useState(null);

  // Generate local ML prediction
  useEffect(() => {
    const generatePrediction = async () => {
      if (!mlPrediction) {
        try {
          const prediction = await fleetAPI.predictMaintenance({
            vehicleId: item.id,
            mileage: item.mileage || item.flightHours * 50,
            batteryHealth: item.efficiency,
            lastService: item.lastService
          });
          setLocalPrediction(prediction);
        } catch (error) {
          console.error('Prediction failed:', error);
        }
      }
    };

    generatePrediction();
  }, [item, mlPrediction]);

  const prediction = mlPrediction || localPrediction;

  // Route optimization handler
  const optimizeRoute = async () => {
    if (!item.destination) return;
    
    setOptimizing(true);
    try {
      const result = await fleetAPI.optimizeRoute({
        vehicleId: item.id,
        currentLocation: item.location,
        destination: item.destination,
        trafficData: Math.random() > 0.5
      });
      
      console.log('Route optimized:', result);
      // In a real app, you'd update the route in state
    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setOptimizing(false);
    }
  };

  // Helper functions
  const getBatteryColor = (battery) => {
    if (battery > 60) return '#10b981';
    if (battery > 30) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'charging': return '#3b82f6';
      case 'maintenance': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskLevel = (score) => {
    if (score > 70) return { level: 'High', color: 'text-red-600' };
    if (score > 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 relative group fleet-card">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id, type)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
        title="Remove from fleet"
        aria-label={`Remove ${item.id} from fleet`}
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-black">{item.id}</h3>
          <p className="text-sm text-gray-600">{item.type}</p>
        </div>
        <div className="text-right">
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium mb-2" 
            style={{ 
              backgroundColor: `${getStatusColor(item.status)}20`, 
              color: getStatusColor(item.status) 
            }}
          >
            {item.status.toUpperCase()}
          </div>
          {onSelect && (
            <button
              onClick={() => onSelect(item)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              View on Map
            </button>
          )}
        </div>
      </div>
      
      {/* Battery Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4" style={{ color: getBatteryColor(item.battery) }} />
            <span className="text-sm text-gray-700">Battery</span>
          </div>
          <span className="font-medium" style={{ color: getBatteryColor(item.battery) }}>
            {Math.round(item.battery)}%
          </span>
        </div>
        
        {/* Battery Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${item.battery}%`, 
              backgroundColor: getBatteryColor(item.battery) 
            }}
          />
        </div>
        
        {/* Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Location</span>
          </div>
          <span className="text-sm font-medium text-black truncate ml-2">
            {item.location.address}
          </span>
        </div>
        
        {/* Vehicle-specific info */}
        {type === 'vehicle' && (
          <>
            {item.passenger && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Passenger</span>
                </div>
                <span className="text-sm font-medium text-black">{item.passenger}</span>
              </div>
            )}
            
            {item.revenue && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Revenue</span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  ${item.revenue.toFixed(2)}
                </span>
              </div>
            )}
          </>
        )}
        
        {/* Drone-specific info */}
        {type === 'drone' && (
          <>
            {item.package && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-700">Package</span>
                </div>
                <span className="text-sm font-medium text-black truncate ml-2">
                  {item.package}
                </span>
              </div>
            )}
            
            {item.weight && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs">⚖️</span>
                  <span className="text-sm text-gray-700">Weight</span>
                </div>
                <span className="text-sm font-medium text-black">{item.weight}</span>
              </div>
            )}
          </>
        )}
        
        {/* ETA */}
        {item.eta && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">ETA</span>
            </div>
            <span className="text-sm font-medium text-black">{item.eta} min</span>
          </div>
        )}
        
        {/* Efficiency & ML Predictions */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Efficiency</span>
            <span className="text-sm font-medium text-green-600">
              {Math.round(item.efficiency)}%
            </span>
          </div>
          
          {/* ML Prediction Display */}
          {prediction && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Maintenance Risk</span>
                <span className={`text-xs font-medium ${getRiskLevel(prediction.riskScore).color}`}>
                  {prediction.riskScore}% ({getRiskLevel(prediction.riskScore).level})
                </span>
              </div>
              
              {prediction.daysUntilMaintenance && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Next Service</span>
                  <span className="text-xs font-medium text-gray-700">
                    {prediction.daysUntilMaintenance} days
                  </span>
                </div>
              )}
              
              {prediction.confidence && (
                <div className="text-xs text-gray-400">
                  ML Confidence: {Math.round(prediction.confidence * 100)}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* Route Optimization Button */}
          {item.status === 'active' && item.destination && (
            <button
              onClick={optimizeRoute}
              disabled={optimizing}
              className="w-full px-3 py-2 bg-black text-white text-xs rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {optimizing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Optimizing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Route className="w-3 h-3 mr-2" />
                  AI Route Optimize
                </span>
              )}
            </button>
          )}
          
          {/* High Risk Alert */}
          {prediction && prediction.riskScore > 70 && (
            <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              <span className="text-red-800">High maintenance risk detected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FleetCard;