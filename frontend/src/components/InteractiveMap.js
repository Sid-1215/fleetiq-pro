// src/components/InteractiveMap.js - Interactive Map with Real-time Tracking
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Navigation, Truck, Zap } from 'lucide-react';

const InteractiveMap = ({ vehicles, drones, selectedVehicle }) => {
  const mapContainer = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapStyle, setMapStyle] = useState('street');

  // Vehicle positions for animation
  const [vehiclePositions, setVehiclePositions] = useState({});
  const [dronePositions, setDronePositions] = useState({});

  // Initialize positions
  useEffect(() => {
    const newVehiclePositions = {};
    const newDronePositions = {};

    vehicles.forEach((vehicle, index) => {
      newVehiclePositions[vehicle.id] = {
        x: 100 + (index * 150),
        y: 200,
        targetX: 100 + (index * 150),
        targetY: 200,
        angle: 0
      };
    });

    drones.forEach((drone, index) => {
      newDronePositions[drone.id] = {
        x: 300 + (index * 120),
        y: 100,
        targetX: 300 + (index * 120),
        targetY: 100,
        angle: 0
      };
    });

    setVehiclePositions(newVehiclePositions);
    setDronePositions(newDronePositions);
  }, [vehicles, drones]);

  // Canvas drawing function
  const drawMap = (ctx, width, height) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background based on style
    if (mapStyle === 'satellite') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#2d5a87');
      gradient.addColorStop(1, '#1e3a5f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);
    }

    // Draw city blocks
    ctx.fillStyle = mapStyle === 'satellite' ? '#4a5568' : '#e2e8f0';
    ctx.fillRect(50, 50, 100, 80);
    ctx.fillRect(200, 80, 120, 100);
    ctx.fillRect(380, 60, 90, 90);
    ctx.fillRect(100, 250, 110, 70);
    ctx.fillRect(300, 280, 130, 85);

    // Draw roads
    ctx.strokeStyle = mapStyle === 'satellite' ? '#2d3748' : '#cbd5e0';
    ctx.lineWidth = mapStyle === 'satellite' ? 4 : 3;
    
    // Main roads
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(width, 200);
    ctx.moveTo(200, 0);
    ctx.lineTo(200, height);
    ctx.moveTo(400, 0);
    ctx.lineTo(400, height);
    ctx.moveTo(0, 320);
    ctx.lineTo(width, 320);
    ctx.stroke();

    // Draw lane markings
    ctx.strokeStyle = mapStyle === 'satellite' ? '#4a5568' : '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(width, 200);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw charging stations
    const chargingStations = [
      { x: 180, y: 180 },
      { x: 420, y: 300 },
      { x: 350, y: 150 }
    ];

    chargingStations.forEach(station => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(station.x, station.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Charging station icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', station.x, station.y + 3);
    });

    // Draw traffic lights
    const trafficLights = [
      { x: 200, y: 200 },
      { x: 400, y: 200 },
      { x: 200, y: 320 }
    ];

    trafficLights.forEach(light => {
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(light.x, light.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // Draw vehicles
  const drawVehicles = (ctx) => {
    Object.entries(vehiclePositions).forEach(([vehicleId, position]) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return;

      const { x, y } = position;
      const isSelected = selectedVehicle?.id === vehicleId;

      // Vehicle body
      const vehicleColor = vehicle.status === 'active' ? '#10b981' : 
                          vehicle.status === 'charging' ? '#3b82f6' : '#ef4444';
      
      ctx.fillStyle = vehicleColor;
      ctx.fillRect(x - 8, y - 6, 16, 12);
      
      // Vehicle outline
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#000000';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(x - 8, y - 6, 16, 12);
      
      // Vehicle direction indicator
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 6, y - 2, 3, 4);
      
      // Vehicle ID label
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(vehicle.id, x, y - 12);
      
      // Battery indicator
      const batteryWidth = 12;
      const batteryHeight = 3;
      const batteryLevel = vehicle.battery / 100;
      
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(x - batteryWidth/2, y + 10, batteryWidth, batteryHeight);
      
      ctx.fillStyle = vehicle.battery > 60 ? '#10b981' : 
                     vehicle.battery > 30 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x - batteryWidth/2, y + 10, batteryWidth * batteryLevel, batteryHeight);
      
      // Show route if selected
      if (isSelected && showRoutes) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 100, y - 50);
        ctx.lineTo(x + 200, y + 30);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Route waypoints
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x + 100, y - 50, 3, 0, 2 * Math.PI);
        ctx.arc(x + 200, y + 30, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Revenue indicator for active vehicles
      if (vehicle.status === 'active' && vehicle.revenue) {
        ctx.fillStyle = '#10b981';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${vehicle.revenue.toFixed(0)}`, x, y + 20);
      }
    });
  };

  // Draw drones
  const drawDrones = (ctx) => {
    Object.entries(dronePositions).forEach(([droneId, position]) => {
      const drone = drones.find(d => d.id === droneId);
      if (!drone) return;

      const { x, y } = position;
      const isSelected = selectedVehicle?.id === droneId;

      // Drone body
      const droneColor = drone.status === 'active' ? '#8b5cf6' : '#ef4444';
      
      ctx.fillStyle = droneColor;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Drone rotors (animated)
      const time = Date.now() / 100;
      ctx.strokeStyle = drone.status === 'active' ? '#a78bfa' : '#f87171';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) + (time * 0.1);
        const rotorX = x + Math.cos(angle) * 8;
        const rotorY = y + Math.sin(angle) * 8;
        
        ctx.beginPath();
        ctx.arc(rotorX, rotorY, 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // Drone outline
      ctx.strokeStyle = isSelected ? '#fbbf24' : '#000000';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Drone ID label
      ctx.fillStyle = '#000000';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(drone.id, x, y - 12);
      
      // Battery indicator
      const batteryWidth = 10;
      const batteryHeight = 2;
      const batteryLevel = drone.battery / 100;
      
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(x - batteryWidth/2, y + 10, batteryWidth, batteryHeight);
      
      ctx.fillStyle = drone.battery > 60 ? '#10b981' : 
                     drone.battery > 30 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x - batteryWidth/2, y + 10, batteryWidth * batteryLevel, batteryHeight);

      // Flight path for active drones
      if (drone.status === 'active' && showRoutes) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 80, y + 60);
        ctx.lineTo(x + 150, y - 20);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Package indicator
      if (drone.package && drone.status === 'active') {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '6px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📦', x, y + 18);
      }
    });
  };

  // Animation loop
  const animate = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Update vehicle positions (simulate movement)
    setVehiclePositions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(vehicleId => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle?.status === 'active') {
          updated[vehicleId].x += Math.sin(Date.now() / 1000 + parseInt(vehicleId.slice(-1))) * 0.5;
          updated[vehicleId].y += Math.cos(Date.now() / 1000 + parseInt(vehicleId.slice(-1))) * 0.3;
        }
      });
      return updated;
    });

    // Update drone positions (simulate flight)
    setDronePositions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(droneId => {
        const drone = drones.find(d => d.id === droneId);
        if (drone?.status === 'active') {
          updated[droneId].x += Math.sin(Date.now() / 800 + parseInt(droneId.slice(-1))) * 1;
          updated[droneId].y += Math.cos(Date.now() / 800 + parseInt(droneId.slice(-1))) * 0.8;
        }
      });
      return updated;
    });

    // Draw everything
    drawMap(ctx, width, height);
    drawVehicles(ctx);
    drawDrones(ctx);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Initialize canvas
  useEffect(() => {
    if (!mapContainer.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = mapContainer.current.offsetWidth || 600;
    canvas.height = 400;
    canvas.style.width = '100%';
    canvas.style.height = '400px';
    canvas.style.borderRadius = '8px';
    canvas.style.cursor = 'pointer';

    // Add click handler
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Check if clicked on a vehicle or drone
      Object.entries(vehiclePositions).forEach(([vehicleId, position]) => {
        const distance = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2);
        if (distance < 15) {
          const vehicle = vehicles.find(v => v.id === vehicleId);
          if (vehicle) {
            console.log('Selected vehicle:', vehicle);
            // Could call a prop function here to handle selection
          }
        }
      });
    });

    canvasRef.current = canvas;
    mapContainer.current.appendChild(canvas);
    setMapLoaded(true);

    // Start animation
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mapContainer.current && canvas) {
        mapContainer.current.removeChild(canvas);
      }
    };
  }, [vehicles, drones]);

  // Map controls
  const MapControls = () => (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
      <button
        onClick={() => setMapStyle(mapStyle === 'street' ? 'satellite' : 'street')}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span>{mapStyle === 'street' ? 'Satellite' : 'Street'}</span>
      </button>
      
      <button
        onClick={() => setShowRoutes(!showRoutes)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors ${
          showRoutes ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <Navigation className="w-4 h-4" />
        <span>Routes</span>
      </button>
    </div>
  );

  // Legend
  const MapLegend = () => (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
      <h4 className="text-sm font-semibold text-black mb-2">Legend</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Active Vehicle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Charging</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Active Drone</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Charging Station</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Live Fleet Map</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-time tracking</span>
        </div>
      </div>
      
      <div 
        ref={mapContainer} 
        className="h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg relative overflow-hidden"
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading interactive map...</p>
            </div>
          </div>
        )}
        
        {mapLoaded && (
          <>
            <MapControls />
            <MapLegend />
          </>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Truck className="w-4 h-4 text-green-500" />
            <span className="font-medium">{vehicles.filter(v => v.status === 'active').length}</span>
          </div>
          <p className="text-gray-600">Active Vehicles</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{drones.filter(d => d.status === 'active').length}</span>
          </div>
          <p className="text-gray-600">Active Drones</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Real-time</span>
          </div>
          <p className="text-gray-600">GPS Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;