"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { api, buildQueryParams } from "@/lib/api-client";
import { notify } from "@/lib/utils";
import Input from "@/components/Theme/Input";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import("./GeoFenceMap"), { ssr: false });

const GeoFencing = ({ employee_id }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        geo_fencing_enabled: false,
        latitude: "",
        longitude: "",
        radius: 200,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = await buildQueryParams({});
                const { data } = await api.get(`/employee-geofence/${employee_id}`, { params });
                if (data) {
                    setForm({
                        geo_fencing_enabled: !!data.geo_fencing_enabled,
                        latitude: data.latitude || "",
                        longitude: data.longitude || "",
                        radius: data.radius || 200,
                    });
                }
            } catch (e) {}
            finally { setLoading(false); }
        };
        if (employee_id) fetchData();
    }, [employee_id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const params = await buildQueryParams({});
            await api.post(`/employee-geofence/${employee_id}`, { ...params, ...form });
            notify("Success", "Geo-fencing settings saved", "success");
        } catch (e) {
            notify("Error", "Save failed", "error");
        } finally { setSaving(false); }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setForm(prev => ({
                        ...prev,
                        latitude: pos.coords.latitude.toFixed(6),
                        longitude: pos.coords.longitude.toFixed(6),
                    }));
                    notify("Success", "Location captured", "success");
                },
                () => notify("Error", "Location access denied", "error")
            );
        }
    };

    const handleMapClick = useCallback((lat, lng) => {
        setForm(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
        }));
    }, []);

    if (loading) return <div className="p-6 text-center text-gray-400 text-sm">Loading...</div>;

    return (
        <section className="glass-card bg-card-light dark:bg-card-dark border border-white/50 dark:border-slate-700/50 rounded-2xl p-6 md:p-8" id="geofencing">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                <span className="material-icons text-primary bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                    location_on
                </span>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Geo-Fencing
                </h3>
            </div>

            <div className="space-y-6">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Enable Geo-Fencing</span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">Set custom location for this employee's mobile punch-in</span>
                    </div>
                    <button onClick={() => setForm(prev => ({ ...prev, geo_fencing_enabled: !prev.geo_fencing_enabled }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${form.geo_fencing_enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.geo_fencing_enabled ? "translate-x-6" : ""}`} />
                    </button>
                </div>

                {form.geo_fencing_enabled && (
                    <>
                        {/* Map + Controls */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative" style={{ height: "200px" }}>
                                <MapComponent
                                    latitude={parseFloat(form.latitude) || 25.276987}
                                    longitude={parseFloat(form.longitude) || 55.296249}
                                    radius={parseInt(form.radius) || 200}
                                    onMapClick={handleMapClick}
                                />
                                <button onClick={getCurrentLocation}
                                    className="absolute bottom-3 left-3 z-[1000] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-[10px] font-medium text-gray-700 dark:text-gray-300 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                    <span className="material-icons text-xs">my_location</span>
                                    Current Location
                                </button>
                            </div>
                            <div className="col-span-4 flex flex-col justify-between pl-3 max-w-[220px]" style={{ height: "200px" }}>
                                <div className="flex flex-col gap-2">
                                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Click map or enter coordinates</p>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Latitude</label>
                                        <input type="number" step="0.000001" value={form.latitude} placeholder="25.276987"
                                            onChange={(e) => setForm(prev => ({ ...prev, latitude: e.target.value }))}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Longitude</label>
                                        <input type="number" step="0.000001" value={form.longitude} placeholder="55.296249"
                                            onChange={(e) => setForm(prev => ({ ...prev, longitude: e.target.value }))}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Radius (m)</label>
                                    <input type="number" value={form.radius} placeholder="200"
                                        onChange={(e) => setForm(prev => ({ ...prev, radius: e.target.value }))}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/80 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex justify-start pt-2">
                    <button disabled={saving} onClick={handleSave}
                        className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50">
                        {saving ? "Saving..." : "Save Geo-Fence"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default GeoFencing;
