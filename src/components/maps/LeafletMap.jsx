import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { StatusBadge } from '../common/StatusBadge';
import { ShieldAlert, MapPin, AlertTriangle, Car, CheckCircle2 } from 'lucide-react';

// Dynamic Custom HTML Marker Creator
const createCustomMarker = (type, severity) => {
  let color = '#3b82f6'; // blue default
  let iconHtml = '📍';

  if (type === 'Pothole') {
    color = '#f97316'; // Safety Orange
    iconHtml = '🕳️';
  } else if (type === 'Crack') {
    color = '#f59e0b'; // Amber
    iconHtml = '⚡';
  } else if (type === 'Accident') {
    color = '#ef4444'; // Red
    iconHtml = '💥';
  } else if (type === 'Repair') {
    color = '#10b981'; // Emerald Green
    iconHtml = '🛠️';
  }

  const svgMarker = `
    <div style="
      background-color: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-size: 16px;
      cursor: pointer;
    ">
      ${iconHtml}
    </div>
  `;

  return L.divIcon({
    html: svgMarker,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

export const LeafletMap = ({ reports = [], center = [37.7749, -122.4194], zoom = 13, polyline = null }) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative z-10">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render polyline route if provided for safe route feature */}
        {polyline && (
          <Polyline
            positions={polyline}
            color="#3b82f6"
            weight={6}
            opacity={0.8}
            dashArray="1, 8"
          />
        )}

        {/* Markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createCustomMarker(report.type, report.severity)}
          >
            <Popup className="custom-popup">
              <div className="p-1 max-w-xs space-y-2 text-slate-800">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={report.image}
                    alt={report.type}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={report.status} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{report.type} Issue</h4>
                    <span className="text-[10px] font-bold text-slate-500">{report.id}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-600" /> {report.locationName}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">{report.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Reported: {report.date}</span>
                  <span className="font-semibold text-brand-600">AI Conf: {report.aiConfidence || '95%'}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
