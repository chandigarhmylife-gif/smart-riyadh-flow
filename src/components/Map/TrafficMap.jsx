import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
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
          Speed: {vehicle.speed} km/h
        </div>
      </Popup>
    </Marker>
  ));
}

function roadColor(level, blocked) {
  if (blocked || level >= 0.85) return '#DC2626';
  if (level >= 0.5) return '#F59E0B';
  return '#16A34A';
}

/**
 * Road segments coloured by how full they are. Each direction is drawn
 * slightly offset to its own side so both are visible.
 */
function RoadSegments({ roads }) {
  return roads.map((r) => {
    const dLat = r.to[0] - r.from[0];
    const dLon = r.to[1] - r.from[1];
    const len = Math.hypot(dLat, dLon) || 1;
    const k = 0.00007 / len; // perpendicular offset (right-hand side of travel)
    const off = [-dLon * k, dLat * k];
    const positions = [
      [r.from[0] + off[0], r.from[1] + off[1]],
      [r.to[0] + off[0], r.to[1] + off[1]],
    ];
    return (
      <Polyline
        key={r.id}
        positions={positions}
        pathOptions={{ color: roadColor(r.level, r.blocked), weight: 5, opacity: 0.8 }}
      >
        <Tooltip sticky>{r.label}</Tooltip>
      </Polyline>
    );
  });
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
  center = [24.7112, 46.6741],
  jitter = true, // small random drift for decorative vehicles; off when positions come from a model
  roads = [], // [{ id, from, to, level (0-1 of storage), blocked, label }]
}) {
  const [localVehicles, setLocalVehicles] = useState(vehicles);

  useEffect(() => {
    if (!isRunning || !jitter) {
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
  }, [isRunning, vehicles, jitter]);

  const defaultIntersections = intersections.length > 0 ? intersections : [
    { id: 1, name: 'King Fahd / Al Urubah', position: [24.7112, 46.6741], status: 'green' },
    { id: 2, name: 'Olaya / Al Urubah', position: [24.7128, 46.6788], status: 'red' },
    { id: 3, name: 'King Fahd / Tahlia', position: [24.6993, 46.6806], status: 'green' }
  ];

  const defaultVehicles = localVehicles.length > 0 || !jitter ? localVehicles : [
    { id: 1, position: [24.7118, 46.6755], direction: 'North', speed: 25, type: 'car' },
    { id: 2, position: [24.7050, 46.6773], direction: 'South', speed: 30, type: 'car' },
    { id: 3, position: [24.7000, 46.6830], direction: 'East', speed: 28, type: 'car' }
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

        {/* Road segments by occupancy */}
        <RoadSegments roads={roads} />

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