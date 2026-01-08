import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color, type = 'circle') => {
  const svgIcon = type === 'emergency' 
    ? `<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="3"/><text x="15" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">!</text></svg>`
    : `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/></svg>`;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: type === 'emergency' ? [30, 30] : [24, 24],
    iconAnchor: type === 'emergency' ? [15, 15] : [12, 12]
  });
};

const trafficLightIcon = L.divIcon({
  html: '<div style="background: #1E40AF; border: 2px solid white; border-radius: 4px; width: 20px; height: 20px;"></div>',
  className: 'traffic-light-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

function VehicleMarkers({ vehicles, isRunning }) {
  return vehicles.map(vehicle => (
    <Marker
      key={vehicle.id}
      position={vehicle.position}
      icon={createCustomIcon(
        vehicle.type === 'emergency' ? '#EF4444' : '#3B82F6',
        vehicle.type
      )}
    >
      <Popup>
        <div className="text-sm">
          <strong>{vehicle.type === 'emergency' ? 'Emergency Vehicle' : 'Vehicle'}</strong>
          <br />
          Direction: {vehicle.direction}
          <br />
          Speed: {vehicle.speed} mph
        </div>
      </Popup>
    </Marker>
  ));
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function TrafficMap({ 
  intersections = [],
  vehicles = [],
  emergencyVehicles = [],
  incidents = [],
  isRunning = false,
  center = [37.7749, -122.4194]
}) {
  const [localVehicles, setLocalVehicles] = useState(vehicles);

  useEffect(() => {
    if (!isRunning) {
      setLocalVehicles(vehicles);
      return;
    }

    const interval = setInterval(() => {
      setLocalVehicles(prev => 
        prev.map(v => ({
          ...v,
          position: [
            v.position[0] + (Math.random() - 0.5) * 0.0001,
            v.position[1] + (Math.random() - 0.5) * 0.0001
          ]
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, vehicles]);

  const defaultIntersections = intersections.length > 0 ? intersections : [
    { id: 1, name: 'Main & 1st', position: [37.7749, -122.4194], status: 'green' },
    { id: 2, name: 'Main & 2nd', position: [37.7759, -122.4204], status: 'red' },
    { id: 3, name: '1st & Oak', position: [37.7739, -122.4184], status: 'green' }
  ];

  const defaultVehicles = localVehicles.length > 0 ? localVehicles : [
    { id: 1, position: [37.7754, -122.4189], direction: 'North', speed: 25, type: 'car' },
    { id: 2, position: [37.7744, -122.4199], direction: 'South', speed: 30, type: 'car' },
    { id: 3, position: [37.7749, -122.4209], direction: 'East', speed: 28, type: 'car' }
  ];

  return (
    <Card className="border-2 border-slate-200 overflow-hidden h-full">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />

        {/* Traffic Light Intersections */}
        {defaultIntersections.map(intersection => (
          <React.Fragment key={intersection.id}>
            <Marker position={intersection.position} icon={trafficLightIcon}>
              <Popup>
                <div className="text-sm">
                  <strong>{intersection.name}</strong>
                  <br />
                  Status: <span className={intersection.status === 'green' ? 'text-green-600' : 'text-red-600'}>
                    {intersection.status.toUpperCase()}
                  </span>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={intersection.position}
              radius={50}
              pathOptions={{
                color: intersection.status === 'green' ? '#10B981' : '#EF4444',
                fillColor: intersection.status === 'green' ? '#10B981' : '#EF4444',
                fillOpacity: 0.1
              }}
            />
          </React.Fragment>
        ))}

        {/* Regular Vehicles */}
        <VehicleMarkers vehicles={defaultVehicles} isRunning={isRunning} />

        {/* Emergency Vehicles */}
        {emergencyVehicles.map(vehicle => (
          <React.Fragment key={vehicle.id}>
            <Marker
              position={vehicle.position}
              icon={createCustomIcon('#EF4444', 'emergency')}
            >
              <Popup>
                <div className="text-sm">
                  <strong>🚨 Emergency Vehicle</strong>
                  <br />
                  Type: {vehicle.type}
                  <br />
                  Direction: {vehicle.direction}
                  <br />
                  ETA: {vehicle.eta}s
                </div>
              </Popup>
            </Marker>
            <Circle
              center={vehicle.position}
              radius={100}
              pathOptions={{
                color: '#EF4444',
                fillColor: '#EF4444',
                fillOpacity: 0.2,
                dashArray: '10, 10'
              }}
            />
          </React.Fragment>
        ))}

        {/* Traffic Incidents */}
        {incidents.map(incident => (
          <Marker
            key={incident.id}
            position={incident.position}
            icon={createCustomIcon('#F59E0B', 'emergency')}
          >
            <Popup>
              <div className="text-sm">
                <strong>⚠️ {incident.type}</strong>
                <br />
                Severity: {incident.severity}
                <br />
                {incident.description}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}