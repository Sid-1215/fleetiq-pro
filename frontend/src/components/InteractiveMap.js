// src/components/InteractiveMap.js - Professional OpenStreetMap Integration
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Truck, Zap, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMzYjgyZjYiLz4KPHBhdGggZD0iTTEyLjUgNEMxNi45MTgzIDQgMjAuNSA3LjU4MTcyIDIwLjUgMTJDMjAuNSAxNi40MTgzIDE2LjkxODMgMjAgMTIuNSAyMEM4LjA4MTcyIDIwIDQuNSAxNi40MTgzIDQuNSAxMkM0LjUgNy41ODE3MiA4LjA4MTcyIDQgMTIuNSA0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiMzYjgyZjYiLz4KPHBhdGggZD0iTTEyLjUgNEMxNi45MTgzIDQgMjAuNSA3LjU4MTcyIDIwLjUgMTJDMjAuNSAxNi40MTgzIDE2LjkxODMgMjAgMTIuNSAyMEM4LjA4MTcyIDIwIDQuNSAxNi40MTgzIDQuNSAxMkM0LjUgNy41ODE3MiA4LjA4MTcyIDQgMTIuNSA0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIzNy41IiByeD0iMjAuNSIgcnk9IjMuNSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPg==',
});

const InteractiveMap = ({ vehicles, drones, selectedVehicle }) => {
  const [mapStyle, setMapStyle] = useState('street');
  const [showRoutes, setShowRoutes] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Map center (Los Angeles)
  const center = [34.0522, -118.2437];

  // Tile layer URLs
  const tileLayers = {
    street: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '© OpenStreetMap contributors, © CartoDB'
    }
  };

  // Charging stations
  const chargingStations = [
    { id: 1, position: [34.0522, -118.2437], name: 'Downtown SuperCharger' },
    { id: 2, position: [34.0689, -118.4452], name: 'Santa Monica Fast Charge' },
    { id: 3, position: [34.1478, -118.1445], name: 'Pasadena Charging Hub' }
  ];

  // Custom icons
  const createCustomIcon = (color, emoji, size = [32, 32]) => {
    return L.divIcon({
      html: `
        <div style="
          width: ${size[0]}px; 
          height: ${size[1]}px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 8px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${emoji}</div>
      `,
      className: 'custom-div-icon',
      iconSize: size,
      iconAnchor: [size[0]/2, size[1]],
    });
  };

  const createChargingIcon = () => {
    return L.divIcon({
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background-color: #10b981; 
          border: 2px solid white; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">⚡</div>
      `,
      className: 'charging-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Get vehicle icon based on status
  const getVehicleIcon = (vehicle) => {
    const colors = {
      active: '#10b981',
      charging: '#3b82f6',
      maintenance: '#ef4444'
    };
    return createCustomIcon(colors[vehicle.status] || '#6b7280', '🚗');
  };

  // Get drone icon based on status
  const getDroneIcon = (drone) => {
    const colors = {
      active: '#8b5cf6',
      maintenance: '#ef4444'
    };
    return createCustomIcon(colors[drone.status] || '#6b7280', '🚁', [28, 28]);
  };

  // Generate route for selected vehicle
  const generateRoute = (vehicle) => {
    if (!vehicle || !vehicle.destination) return [];
    
    const start = [vehicle.location.lat, vehicle.location.lng];
    const end = [vehicle.location.lat + 0.01, vehicle.location.lng + 0.02];
    const waypoint = [vehicle.location.lat + 0.005, vehicle.location.lng + 0.01];
    
    return [start, waypoint, end];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black">Live Fleet Tracking</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-time GPS</span>
        </div>
      </div>

      <div className="relative h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url={tileLayers[mapStyle].url}
            attribution={tileLayers[mapStyle].attribution}
          />

          {/* Vehicle Markers */}
          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.location.lat, vehicle.location.lng]}
              icon={getVehicleIcon(vehicle)}
              eventHandlers={{
                click: () => setSelectedUnit({ ...vehicle, type: 'vehicle' })
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-lg">{vehicle.id}</h4>
                  <p className="text-sm text-gray-600 mb-2">{vehicle.type}</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize font-medium">{vehicle.status}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className={`font-medium ${
                        vehicle.battery > 60 ? 'text-green-600' : 
                        vehicle.battery > 30 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(vehicle.battery)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Efficiency:</span>
                      <span className="font-medium">{Math.round(vehicle.efficiency)}%</span>
                    </div>
                    
                    {vehicle.passenger && (
                      <div className="flex justify-between">
                        <span>Passenger:</span>
                        <span className="font-medium">{vehicle.passenger}</span>
                      </div>
                    )}
                    
                    {vehicle.destination && (
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span className="font-medium">{vehicle.destination}</span>
                      </div>
                    )}
                    
                    {vehicle.status === 'active' && (
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium text-green-600">${vehicle.revenue.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Drone Markers */}
          {drones.map((drone) => (
            <Marker
              key={drone.id}
              position={[drone.location.lat, drone.location.lng]}
              icon={getDroneIcon(drone)}
              eventHandlers={{
                click: () => setSelectedUnit({ ...drone, type: 'drone' })
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-lg">{drone.id}</h4>
                  <p className="text-sm text-gray-600 mb-2">{drone.type}</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize font-medium">{drone.status}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className={`font-medium ${
                        drone.battery > 60 ? 'text-green-600' : 
                        drone.battery > 30 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(drone.battery)}%
                      </span>
                    </div>
                    
                    {drone.package && (
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium">{drone.package}</span>
                      </div>
                    )}
                    
                    {drone.weight && (
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{drone.weight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Charging Stations */}
          {chargingStations.map((station) => (
            <Marker
              key={station.id}
              position={station.position}
              icon={createChargingIcon()}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold">{station.name}</h4>
                  <p className="text-sm text-gray-600">Charging Station</p>
                  <p className="text-sm">Available 24/7</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Routes for selected vehicle */}
          {showRoutes && selectedUnit && selectedUnit.type === 'vehicle' && selectedUnit.destination && (
            <Polyline
              positions={generateRoute(selectedUnit)}
              color="#ef4444"
              weight={4}
              opacity={0.8}
              dashArray="10, 5"
            />
          )}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-1 z-[1000]">
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
            onClick={() => setMapStyle('dark')}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors w-full ${
              mapStyle === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>🌙</span>
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Fleet Stats */}
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
            <span className="font-medium">OpenStreetMap</span>
          </div>
          <p className="text-gray-600">Powered by</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;