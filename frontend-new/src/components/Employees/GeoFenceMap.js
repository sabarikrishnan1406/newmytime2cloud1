"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GeoFenceMap = ({ latitude, longitude, radius, onMapClick }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const circleRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Fix leaflet default icon issue
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
        }).addTo(map);

        // Add marker
        markerRef.current = L.marker([latitude, longitude], { draggable: true }).addTo(map);

        // Add radius circle
        circleRef.current = L.circle([latitude, longitude], {
            radius: radius,
            color: "#6366f1",
            fillColor: "#6366f1",
            fillOpacity: 0.15,
            weight: 2,
        }).addTo(map);

        // Map click → set location
        map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            markerRef.current.setLatLng([lat, lng]);
            circleRef.current.setLatLng([lat, lng]);
            onMapClick(lat, lng);
        });

        // Marker drag → set location
        markerRef.current.on("dragend", () => {
            const pos = markerRef.current.getLatLng();
            circleRef.current.setLatLng([pos.lat, pos.lng]);
            onMapClick(pos.lat, pos.lng);
        });

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Update marker and circle when lat/lng/radius changes
    useEffect(() => {
        if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const r = parseInt(radius) || 200;

        if (!isNaN(lat) && !isNaN(lng)) {
            markerRef.current.setLatLng([lat, lng]);
            circleRef.current.setLatLng([lat, lng]);
            circleRef.current.setRadius(r);
            mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
        }
    }, [latitude, longitude, radius]);

    return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default GeoFenceMap;
