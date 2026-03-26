// @ts-nocheck
"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBranches, createDevice, updateDevice, getDeviceSettginsFromSDK, updateDeviceSettings } from "@/lib/api";
import { notify, parseApiError } from "@/lib/utils";
import Input from "../Theme/Input";
import TextArea from "../Theme/TextArea";
import DropDown from "../ui/DropDown";
import timezones from "@/lib/timezones";
import { DEVICE_ENABLE_DISABLE, DEVICE_TYPES, DEVICE_VOLUME, FUNCTIONS, LANGUAGE_FOR_DEVICE, MODEL_NUMBERS, STATUSSES } from "@/lib/dropdowns";
import { Pencil } from "lucide-react";

let defaultPayload = {
    device_id: "",
    language: "",
    volume: "",
    menuPassword: "",
    msgPush: "",
    time: "",
    maker_manufacturer: "",
    maker_webAddr: "",
    maker_deliveryDate: ""
};

const DeviceSettings = ({ device, device_id, open, setOpen, onSuccess = () => { } }) => {
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [sdkResponse, setSdkResponse] = useState(null);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(defaultPayload);

    const [deviceType, setDeviceType] = useState("Oxsai");

    useEffect(() => {
        setDeviceInfo(device);
        console.log(device);

        const model = device?.model_number;

        if (model === "CAMERA1" && model !== "MYTIME1") {
            console.log(`1`);
            ;
        }

        if ((model === "OX-900" || model === "MYTIME1")) {
            console.log(`2`);
        }
     
    }, [device]);

    const toggleModal = () => setOpen(!open);

    const fetchBranches = async () => {
        try {
            setBranches(await getBranches());
        } catch (error) {
            console.error("Failed to fetch branches", error);
        }
    };

    // Wrapped in useCallback to prevent unnecessary re-renders
    const callDeviceSettings = useCallback(async (targetId) => {
        const idToQuery = targetId || device_id;
        if (!idToQuery) return;

        try {
            setLoading(true);
            const result = await getDeviceSettginsFromSDK({ device_id: idToQuery });
            setSdkResponse(result?.SDKresponseData);

            const data = result?.SDKresponseData?.data;
            if (data) {
                // Merge default payload with new data to ensure all fields exist
                setForm((prev) => ({ ...prev, ...data, device_id: idToQuery }));
            }
        } catch (error) {
            notify("Error", parseApiError(error), "error");
        } finally {
            setLoading(false);
        }
    }, [device_id]);

    // Handle initial open and ID changes
    useEffect(() => {
        if (open && device_id) {
            fetchBranches();
            // Reset form with the new device_id immediately
            setForm({ ...defaultPayload, device_id: device_id });
            setSdkResponse(null);
            callDeviceSettings(device_id);
        }
    }, [open, device_id, callDeviceSettings]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const onSubmit = async (e) => {
        callDeviceSettings();
    };



    // ... inside your DeviceSettings component

    const updateSettings = async (e) => {

        // 1. Basic Validation (similar to your Vue password check)
        if (!form.menuPassword) {
            notify("Validation Error", "Device Menu password is required", "error");
            return;
        }

        // 2. Native Confirmation (as used in your Vue code)
        if (!confirm("Are you want to Update Device settings?")) {
            return;
        }

        try {
            setLoading(true);

            // 3. Prepare payload 
            // Note: I'm assuming 'updateDevice' in your lib/api handles the POST 
            // to `/update-device-sdk-settings`
            const payload = {
                deviceSettings: form,
                // company_id is usually handled by the backend auth or passed from a global context
            };

            const response = await updateDeviceSettings(payload);

            // 4. Handle Response Logic
            if (response.status) {
                notify("Success", response.message || "Device settings updated successfully", "success");

                // Optional: Close modal or trigger refresh
                setTimeout(() => {
                    onSuccess();
                    setOpen(false);
                    // toggleModal(); // Uncomment if you want to close on success
                }, 2000);
            } else {
                const errorMsg = response.message === "undefined"
                    ? "Try again. No connection available"
                    : "Try again. " + response.message;

                notify("Error", errorMsg, "error");
            }

        } catch (error) {
            console.error(error);
            notify("Error", "An unexpected error occurred", "error");
        } finally {
            setLoading(false);
        }
    };

    if (deviceInfo) return null;

    if (!open) return null;

    return (
        <>
            {open && (
                <div
                    aria-modal="true"
                    role="dialog"
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                    {/* Backdrop/Overlay */}
                    <div
                        className="absolute inset-0 bg-black/70 frosted-glass transition-opacity animate-in fade-in duration-300"
                        onClick={toggleModal}
                    ></div>

                    {/* Modal Card */}
                    <div className="min-w-[700px] relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">Device Settings</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    device settings for the system
                                </p>
                            </div>
                            <button
                                onClick={toggleModal}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full p-1"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-5 bg-white/50 dark:bg-gray-900">

                            <div className={`mb-6 p-3 rounded-lg flex items-center justify-between border ${sdkResponse?.message === "Successful"
                                ? "bg-green-500/10 border-green-500/20"
                                : "bg-red-500/10 border-red-500/20"
                                }`}>
                                <div className={`flex items-center text-sm font-medium ${sdkResponse?.message === "Successful"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                    }`}>
                                    <span className="material-symbols-outlined mr-2">
                                        {sdkResponse?.message === "Successful" ? "check_circle" : "error"}
                                    </span>

                                    {loading ? "Reloading..." : <>{sdkResponse?.message || "Unknown Status"}</>}

                                </div>

                                <button onClick={onSubmit} className="text-xs font-bold text-primary flex items-center hover:opacity-80 transition-opacity">
                                    <span className="material-symbols-outlined !text-sm mr-1">sync</span>
                                    {loading ? "Reloading..." : "Reload"}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Serial Number <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        placeholder=""
                                        value={form.device_id}
                                        onChange={(e) => handleChange("device_id", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Language <span className="text-red-400">*</span>
                                    </label>
                                    <DropDown
                                        placeholder="Select Model Number"
                                        width="w-full"
                                        value={form.language}
                                        onChange={(value) => handleChange("language", value)}
                                        items={LANGUAGE_FOR_DEVICE} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Volume <span className="text-red-400">*</span>
                                    </label>
                                    <DropDown
                                        placeholder="Select Model Number"
                                        width="w-full"
                                        value={form.volume}
                                        onChange={(value) => handleChange("volume", value)}
                                        items={DEVICE_VOLUME} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Device Menu password <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        placeholder=""
                                        value={form.menuPassword}
                                        onChange={(e) => handleChange("menuPassword", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Alarm Events Push(msgPush) <span className="text-red-400">*</span>
                                    </label>
                                    <DropDown
                                        placeholder="Select Model Number"
                                        width="w-full"
                                        value={form.msgPush}
                                        onChange={(value) => handleChange("msgPush", value)}
                                        items={DEVICE_ENABLE_DISABLE} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Time <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        placeholder=""
                                        value={form.time}
                                        onChange={(e) => handleChange("device_id", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Maker - Manufacturer <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        placeholder=""
                                        value={form.maker_manufacturer}
                                        onChange={(e) => handleChange("maker_manufacturer", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Maker - Delivery/Release Date <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        placeholder=""
                                        value={form.maker_deliveryDate}
                                        onChange={(e) => handleChange("maker_deliveryDate", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-400">
                                    Maker - Website Link <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    placeholder=""
                                    value={form.maker_webAddr}
                                    onChange={(e) => handleChange("maker_webAddr", e.target.value)}
                                />
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10  flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={toggleModal}
                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-white hover:bg-background-dark transition-all text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateSettings}
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-all text-sm font-bold shadow-lg shadow-primary/20"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeviceSettings;
