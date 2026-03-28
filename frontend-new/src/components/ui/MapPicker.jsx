"use client";

import { useEffect, useRef, useState } from "react";

const MapPicker = ({ lat, lon, onChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [ready, setReady] = useState(false);

  const defaultLat = parseFloat(lat) || 25.2048;
  const defaultLng = parseFloat(lon) || 55.2708;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([L]) => {
      // Fix default marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
      });

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setReady(true);

      // Fix map size after render
      setTimeout(() => map.invalidateSize(), 100);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker when lat/lon change externally
  useEffect(() => {
    if (!ready || !markerRef.current || !mapInstanceRef.current) return;
    const newLat = parseFloat(lat);
    const newLng = parseFloat(lon);
    if (isNaN(newLat) || isNaN(newLng)) return;

    markerRef.current.setLatLng([newLat, newLng]);
    mapInstanceRef.current.panTo([newLat, newLng]);
  }, [lat, lon, ready]);

  return (
    <div className="space-y-2">
      <div
        ref={mapRef}
        className="w-full h-48 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-0"
      />
      <p className="text-[10px] text-slate-400">Click on the map or drag the marker to set location</p>
    </div>
  );
};

export default MapPicker;
