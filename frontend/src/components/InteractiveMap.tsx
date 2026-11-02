import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { GeoJSONData, GeoJSONFeature, ZoneProperties } from '../types';
import { MapPin, Info } from 'lucide-react';

interface MapProps {
  geojsonData: GeoJSONData | null;
  selectedZone: ZoneProperties | null;
  onSelectZone: (zone: ZoneProperties) => void;
  rainfallAnomaly: boolean;
}

// Helper untuk reset/center peta
const SetMapCenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const InteractiveMap: React.FC<MapProps> = ({
  geojsonData,
  selectedZone,
  onSelectZone,
  rainfallAnomaly
}) => {
  const defaultCenter: [number, number] = [-7.2000, 113.5200];

  // Fungsi pewarnaan dinamis berdasarkan tingkat risiko
  const getStyle = (feature?: GeoJSONFeature) => {
    const risk = feature?.properties?.risk_status || (rainfallAnomaly ? 'DANGER' : 'SAFE');
    
    let fillColor = '#10b981'; // Hijau (Aman)
    if (risk === 'ALERT') {
      fillColor = '#f59e0b'; // Kuning (Waspada)
    } else if (risk === 'DANGER') {
      fillColor = '#ef4444'; // Merah (Bahaya)
    }

    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: '#ffffff',
      dashArray: '3',
      fillOpacity: 0.65
    };
  };

  const onEachFeature = (feature: GeoJSONFeature, layer: any) => {
    layer.on({
      mouseover: (e: any) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
          color: '#38bdf8',
          dashArray: '',
          fillOpacity: 0.85
        });
        l.bringToFront();
      },
      mouseout: (e: any) => {
        const l = e.target;
        l.setStyle(getStyle(feature));
      },
      click: () => {
        onSelectZone(feature.properties);
      }
    });

    // Tooltip popup sederhana
    layer.bindTooltip(
      `<strong>${feature.properties.zone_name}</strong><br/>Luas Meja: ${feature.properties.crystallization_area_ha} Ha`,
      { permanent: false, direction: 'top' }
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            Kanvas GIS Digital Twin (Pesisir Pamekasan)
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-300">Aman (&lt;2mm)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-300">Waspada (2-10mm)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span className="text-slate-300">Kritis (&gt;10mm)</span>
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px] relative rounded-lg overflow-hidden border border-slate-800">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <SetMapCenter center={defaultCenter} zoom={12} />
          {/* Dark Basemap dari CartoDB */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {geojsonData && (
            <GeoJSON
              key={rainfallAnomaly ? 'anomaly' : 'normal'}
              data={geojsonData as any}
              style={getStyle as any}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>

        {/* Selected Zone Float Badge */}
        {selectedZone && (
          <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/95 border border-sky-500/40 backdrop-blur rounded-lg p-3 text-xs shadow-xl max-w-xs">
            <div className="flex items-center space-x-1.5 font-semibold text-sky-400">
              <Info className="w-3.5 h-3.5" />
              <span>{selectedZone.zone_name}</span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300 text-[11px]">
              <div>Kecamatan: <span className="text-slate-100 font-medium">{selectedZone.sub_district}</span></div>
              <div>Petani: <span className="text-slate-100 font-medium">{selectedZone.active_farmers_count} org</span></div>
              <div>Meja Kristal: <span className="text-slate-100 font-medium">{selectedZone.crystallization_area_ha} Ha</span></div>
              <div>Kapasitas Brine: <span className="text-slate-100 font-medium">{selectedZone.brine_storage_capacity_m3.toLocaleString()} m³</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
