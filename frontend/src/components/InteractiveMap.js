// src/components/InteractiveMap.js - Enhanced Realistic Map with Satellite Appearance
import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Navigation, Truck, Zap, Layers, RotateCcw } from 'lucide-react';

const InteractiveMap = ({ vehicles, drones, selectedVehicle }) => {
  const mapContainer = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapStyle, setMapStyle] = useState('satellite');

  // Vehicle positions for animation
  const [vehiclePositions, setVehiclePositions] = useState({});
  const [dronePositions, setDronePositions] = useState({});

  // Initialize positions based on vehicle data
  useEffect(() => {
    const newVehiclePositions = {};
    const newDronePositions = {};

    vehicles.forEach((vehicle, index) => {
      // Convert lat/lng to screen coordinates (simple projection for demo)
      const screenX = ((vehicle.location.lng + 118.4) * 800) % 600 + 50;
      const screenY = ((34.2 - vehicle.location.lat) * 1000) % 400 + 50;
      
      newVehiclePositions[vehicle.id] = {
        x: screenX,
        y: screenY,
        targetX: screenX,
        targetY: screenY,
        angle: Math.random() * 360
      };
    });

    drones.forEach((drone, index) => {
      const screenX = ((drone.location.lng + 118.4) * 800) % 600 + 50;
      const screenY = ((34.2 - drone.location.lat) * 1000) % 400 + 50;
      
      newDronePositions[drone.id] = {
        x: screenX,
        y: screenY,
        targetX: screenX,
        targetY: screenY,
        angle: 0
      };
    });

    setVehiclePositions(newVehiclePositions);
    setDronePositions(newDronePositions);
  }, [vehicles, drones]);

  // Enhanced realistic map drawing function
  const drawMap = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    if (mapStyle === 'satellite') {
      drawSatelliteMap(ctx, width, height);
    } else {
      drawStreetMap(ctx, width, height);
    }
  };

  // Realistic satellite map appearance
  const drawSatelliteMap = (ctx, width, height) => {
    // Satellite background with realistic colors
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, '#2c5234');  // Dark green center (vegetation)
    gradient.addColorStop(0.3, '#3d5a3d'); // Medium green
    gradient.addColorStop(0.6, '#4a4a3a'); // Brown/gray (urban)
    gradient.addColorStop(1, '#2d3748');   // Dark edges
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add terrain texture
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100 + 50}, ${Math.random() * 80 + 40}, ${Math.random() * 60 + 20}, 0.1)`;
      ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 20 + 5, Math.random() * 20 + 5);
    }

    // Urban areas (lighter patches)
    const urbanAreas = [
      { x: 100, y: 150, w: 120, h: 100 },
      { x: 300, y: 200, w: 150, h: 120 },
      { x: 450, y: 100, w: 100, h: 80 }
    ];

    urbanAreas.forEach(area => {
      const urbanGradient = ctx.createRadialGradient(
        area.x + area.w/2, area.y + area.h/2, 0,
        area.x + area.w/2, area.y + area.h/2, Math.max(area.w, area.h)/2
      );
      urbanGradient.addColorStop(0, 'rgba(180, 180, 160, 0.4)');
      urbanGradient.addColorStop(1, 'rgba(120, 120, 100, 0.2)');
      ctx.fillStyle = urbanGradient;
      ctx.fillRect(area.x, area.y, area.w, area.h);
    });

    // Major highways (realistic satellite view)
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Highway 1 (vertical)
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(220, height/3);
    ctx.lineTo(200, 2*height/3);
    ctx.lineTo(210, height);
    ctx.stroke();

    // Highway 2 (horizontal)
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(width/3, 190);
    ctx.lineTo(2*width/3, 210);
    ctx.lineTo(width, 200);
    ctx.stroke();

    // Highway 3 (diagonal)
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(420, height/2);
    ctx.lineTo(400, height);
    ctx.stroke();

    // Smaller roads
    ctx.strokeStyle = 'rgba(140, 140, 120, 0.6)';
    ctx.lineWidth = 4;
    
    // Grid of smaller roads
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (width/8), 0);
      ctx.lineTo(i * (width/8) + Math.random() * 40 - 20, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * (height/8));
      ctx.lineTo(width, i * (height/8) + Math.random() * 30 - 15);
      ctx.stroke();
    }

    // Water features (realistic blue)
    ctx.fillStyle = 'rgba(70, 130, 180, 0.7)';
    ctx.beginPath();
    ctx.ellipse(150, 300, 40, 20, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(450, 250, 30, 60, Math.PI/4, 0, 2 * Math.PI);
    ctx.fill();

    // Parks/green spaces
    ctx.fillStyle = 'rgba(50, 150, 50, 0.6)';
    ctx.beginPath();
    ctx.ellipse(350, 150, 50, 30, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(100, 100, 35, 35, 0, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Clean street map view
  const drawStreetMap = (ctx, width, height) => {
    // Clean background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Major roads
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(0, 200); ctx.lineTo(width, 200);
    ctx.moveTo(200, 0); ctx.lineTo(200, height);
    ctx.moveTo(400, 0); ctx.lineTo(400, height);
    ctx.moveTo(0, 320); ctx.lineTo(width, 320);
    ctx.stroke();

    // Buildings
    ctx.fillStyle = '#e2e8f0';
    const buildings = [
      { x: 50, y: 50, w: 100, h: 80 },
      { x: 220, y: 80, w: 120, h: 100 },
      { x: 380, y: 60, w: 90, h: 90 },
      { x: 100, y: 250, w: 80, h: 60 },
      { x: 320, y: 280, w: 100, h: 70 }
    ];
    
    buildings.forEach(building => {
      ctx.fillRect(building.x, building.y, building.w, building.h);
      ctx.strokeStyle = '#cbd5e0';
      ctx.lineWidth = 1;
      ctx.strokeRect(building.x, building.y, building.w, building.h);
    });
  };

  // Draw charging stations with realistic appearance
  const drawChargingStations = (ctx) => {
    const stations = [
      { x: 180, y: 180, name: 'SuperCharger Station A' },
      { x: 420, y: 300, name: 'FastCharge Hub B' },
      { x: 350, y: 150, name: 'City Charging Point' }
    ];

    stations.forEach(station => {
      // Station base
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(station.x, station.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // White outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Charging icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', station.x, station.y + 4);
      
      // Station label
      ctx.fillStyle = '#065f46';
      ctx.font = '8px Arial';
      ctx.fillText(station.name, station.x, station.y - 15);
    });
  };

  // Enhanced vehicle drawing with realistic appearance
  const drawVehicles = (ctx) => {
    Object.entries(vehiclePositions).forEach(([vehicleId, position]) => {
      const vehicle = vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return;

      const { x, y } = position;
      const isSelected = selectedVehicle?.id === vehicleId;

      // Vehicle shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x - 10, y - 8, 20, 16);

      // Vehicle body with realistic colors
      const vehicleColor = vehicle.status === 'active' ? '#1f2937' : 
                          vehicle.status === 'charging' ? '#3b82f6' : '#ef4444';
      
      ctx.fillStyle = vehicleColor;
      ctx.fillRect(x - 9, y - 7, 18, 14);
      
      // Vehicle details (windows, etc.)
      ctx.fillStyle = 'rgba(173, 216, 230, 0.8)';
      ctx.fillRect(x - 7, y - 5, 14, 10);
      
      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 11, y - 9, 22, 18);
        
        // Pulsing effect
        const pulseRadius = 15 + Math.sin(Date.now() / 300) * 3;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Vehicle ID label with background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(x - 15, y - 20, 30, 12);
      ctx.fillStyle = '#000000';
      ctx.font = '9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(vehicle.id, x, y - 12);
      
      // Battery indicator
      const batteryWidth = 16;
      const batteryHeight = 4;
      const batteryLevel = vehicle.battery / 100;
      
      // Battery background
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(x - batteryWidth/2, y + 12, batteryWidth, batteryHeight);
      
      // Battery level
      ctx.fillStyle = vehicle.battery > 60 ? '#10b981' : 
                     vehicle.battery > 30 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x - batteryWidth/2, y + 12, batteryWidth * batteryLevel, batteryHeight);
      
      // Battery percentage
      ctx.fillStyle = '#374151';
      ctx.font = '7px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(vehicle.battery)}%`, x, y + 24);

      // Show route if selected
      if (isSelected && showRoutes && vehicle.destination) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 120, y - 60);
        ctx.lineTo(x + 220, y + 40);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Route waypoints
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x + 120, y - 60, 4, 0, 2 * Math.PI);
        ctx.arc(x + 220, y + 40, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Destination label
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillRect(x + 210, y + 30, 80, 15);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Destination', x + 215, y + 42);
      }

      // Status indicators
      if (vehicle.passenger && vehicle.status === 'active') {
        ctx.fillStyle = '#10b981';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚕', x + 12, y - 5);
      }
    });
  };

  // Enhanced drone drawing
  const drawDrones = (ctx) => {
    Object.entries(dronePositions).forEach(([droneId, position]) => {
      const drone = drones.find(d => d.id === droneId);
      if (!drone) return;

      const { x, y } = position;
      const isSelected = selectedVehicle?.id === droneId;

      // Drone shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Drone body
      const droneColor = drone.status === 'active' ? '#8b5cf6' : '#ef4444';
      ctx.fillStyle = droneColor;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fill();
      
      // Drone rotors (animated when active)
      if (drone.status === 'active') {
        const time = Date.now() / 100;
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI / 2) + (time * 0.2);
          const rotorX = x + Math.cos(angle) * 10;
          const rotorY = y + Math.sin(angle) * 10;
          
          ctx.beginPath();
          ctx.arc(rotorX, rotorY, 3, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
      
      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // Drone ID
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(x - 12, y - 18, 24, 10);
      ctx.fillStyle = '#000000';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(drone.id, x, y - 11);
      
      // Battery indicator
      const batteryLevel = drone.battery / 100;
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(x - 8, y + 10, 16, 3);
      ctx.fillStyle = drone.battery > 60 ? '#10b981' : 
                     drone.battery > 30 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(x - 8, y + 10, 16 * batteryLevel, 3);

      // Package indicator
      if (drone.package && drone.status === 'active') {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📦', x, y + 20);
      }
    });
  };

  // Animation loop with smooth movement
  const animate = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Update vehicle positions with smooth movement
    setVehiclePositions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(vehicleId => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle?.status === 'active') {
          // Smooth movement along roads
          updated[vehicleId].x += Math.sin(Date.now() / 2000 + parseInt(vehicleId.slice(-1))) * 0.8;
          updated[vehicleId].y += Math.cos(Date.now() / 2000 + parseInt(vehicleId.slice(-1))) * 0.5;
          
          // Keep vehicles on screen
          updated[vehicleId].x = Math.max(20, Math.min(width - 20, updated[vehicleId].x));
          updated[vehicleId].y = Math.max(20, Math.min(height - 20, updated[vehicleId].y));
        }
      });
      return updated;
    });

    // Update drone positions with flight patterns
    setDronePositions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(droneId => {
        const drone = drones.find(d => d.id === droneId);
        if (drone?.status === 'active') {
          // Figure-8 flight pattern
          const t = Date.now() / 3000 + parseInt(droneId.slice(-1));
          updated[droneId].x += Math.sin(t) * 1.2;
          updated[droneId].y += Math.sin(t * 2) * 0.8;
          
          // Keep drones on screen
          updated[droneId].x = Math.max(20, Math.min(width - 20, updated[droneId].x));
          updated[droneId].y = Math.max(20, Math.min(height - 20, updated[droneId].y));
        }
      });
      return updated;
    });

    // Draw everything
    drawMap(ctx, width, height);
    drawChargingStations(ctx);
    drawVehicles(ctx);
    drawDrones(ctx);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Initialize canvas with proper sizing
  useEffect(() => {
    if (!mapContainer.current) return;

    const canvas = document.createElement('canvas');
    const containerWidth = mapContainer.current.offsetWidth || 600;
    const containerHeight = 480; // Increased height to fill space better
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    canvas.style.width = '100%';
    canvas.style.height = `${containerHeight}px`;
    canvas.style.borderRadius = '8px';
    canvas.style.cursor = 'pointer';
    canvas.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

    // Enhanced click handler
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Check vehicles
      Object.entries(vehiclePositions).forEach(([vehicleId, position]) => {
        const distance = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2);
        if (distance < 20) {
          const vehicle = vehicles.find(v => v.id === vehicleId);
          if (vehicle) {
            console.log('Selected vehicle:', vehicle);
          }
        }
      });
      
      // Check drones
      Object.entries(dronePositions).forEach(([droneId, position]) => {
        const distance = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2);
        if (distance < 15) {
          const drone = drones.find(d => d.id === droneId);
          if (drone) {
            console.log('Selected drone:', drone);
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

  // Enhanced map controls
  const MapControls = () => (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-1">
      <button
        onClick={() => setMapStyle(mapStyle === 'street' ? 'satellite' : 'street')}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors w-full"
      >
        <Layers className="w-4 h-4" />
        <span>{mapStyle === 'street' ? 'Satellite' : 'Street'}</span>
      </button>
      
      <button
        onClick={() => setShowRoutes(!showRoutes)}
        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors w-full ${
          showRoutes ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <Navigation className="w-4 h-4" />
        <span>Routes</span>
      </button>
      
      <button
        onClick={() => window.location.reload()}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors w-full"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset</span>
      </button>
    </div>
  );

  // Enhanced legend
  const MapLegend = () => (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
      <h4 className="text-sm font-semibold text-black mb-2">Fleet Legend</h4>
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-gray-800 rounded"></div>
          <span>Active Vehicle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-blue-500 rounded"></div>
          <span>Charging</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Active Drone</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>⚡ Charging Station</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Selected Unit</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Live Fleet Tracking</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-time GPS</span>
        </div>
      </div>
      
      <div 
        ref={mapContainer} 
        className="h-120 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg relative overflow-hidden"
        style={{ height: '480px' }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading satellite map...</p>
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
            <Truck className="w-4 h-4 text-gray-800" />
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
            <span className="font-medium">{mapStyle === 'satellite' ? 'Satellite' : 'Street'}</span>
          </div>
          <p className="text-gray-600">Map View</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;