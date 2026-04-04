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
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-400">
                                Click on the map to set location, or enter coordinates manually. The circle shows the allowed punch-in area.
                            </p>
                        </div>

                        {/* Map */}
                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: "350px" }}>
                            <MapComponent
                                latitude={parseFloat(form.latitude) || 25.276987}
                                longitude={parseFloat(form.longitude) || 55.296249}
                                radius={parseInt(form.radius) || 200}
                                onMapClick={handleMapClick}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Latitude</label>
                                <Input type="number" step="0.000001" value={form.latitude} placeholder="e.g. 25.276987"
                                    onChange={(e) => setForm(prev => ({ ...prev, latitude: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Longitude</label>
                                <Input type="number" step="0.000001" value={form.longitude} placeholder="e.g. 55.296249"
                                    onChange={(e) => setForm(prev => ({ ...prev, longitude: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Radius (meters)</label>
                                <Input type="number" value={form.radius} placeholder="200"
                                    onChange={(e) => setForm(prev => ({ ...prev, radius: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={getCurrentLocation}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <span className="material-icons text-sm">my_location</span>
                                Use Current Location
                            </button>
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
