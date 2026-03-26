// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBranches, createDevice } from "@/lib/api";
import { notify, parseApiError } from "@/lib/utils";
import Input from "../Theme/Input";
import TextArea from "../Theme/TextArea";
import DropDown from "../ui/DropDown";
import timezones from "@/lib/timezones";
import { DEVICE_TYPES, FUNCTIONS, MODEL_NUMBERS, STATUSSES } from "@/lib/dropdowns";

let defaultPayload = {
  branch_id: "",
  name: "test",
  short_name: "test",
  location: "test",
  model_number: "MYTIME1",
  device_id: "",
  utc_time_zone: "Asia/Dubai",
  function: "auto",
  device_type: "all",
  status_id: 1,
  ip: "0.0.0.0"
};

const DeviceCreate = ({ onSuccess = () => { } }) => {

  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [branches, setBranches] = useState([]);

  const toggleModal = () => setOpen(!open);

  const fetchBranches = async () => {
    try {
      setBranches(await getBranches());
    } catch (error) {
      notify("Error", parseApiError(error), "error");
    }
  };

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(defaultPayload);

  useEffect(() => {
    if (open) {
      fetchBranches();
      setForm(defaultPayload);
    }
  }, [open]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let { data } = await createDevice(form);

      // FIX: Check if status is explicitly false
      if (data?.status === false) {
        // Check if data.errors actually exists and has keys
        if (data.errors && Object.keys(data.errors).length > 0) {
          const firstKey = Object.keys(data.errors)[0];
          console.log(data.errors);
          notify("Error", data.errors[firstKey][0], "error");
        } else {
          // Fallback if status is false but no specific error object exists
          notify("Error", data?.message, "error");
        }
        return;
      }

      // Success Path
      onSuccess();
      setSuccessOpen(true);
      setOpen(false);
      notify("Success", "Device Saved", "success")
    } catch (error) {
      console.log(error);

      notify("Error", parseApiError(error), "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="bg-primary hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-lg flex items-center gap-1 transition-all shadow-lg shadow-primary/20"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Add Device
      </button>

      {/* Modal Portal Logic */}
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
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">Add Device</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Create a new device in the system
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
            <form onSubmit={onSubmit}>
              <div className="p-6 space-y-5 bg-white/50 dark:bg-gray-900">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-400">
                    Branch <span className="text-red-400">*</span>
                  </label>
                  <DropDown
                    placeholder="Select Branch"
                    width="w-full"
                    value={form.branch_id}
                    onChange={(value) => handleChange("branch_id", value)}
                    items={branches} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Device Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Main Door"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Prefix <span className="text-red-400">*</span>
                    </label>
                    <Input
                      placeholder="e.g. MD"
                      value={form.short_name}
                      onChange={(e) => handleChange("short_name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-400">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Dubai"
                    value={form.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Model Number <span className="text-red-400">*</span>
                    </label>
                    <DropDown
                      placeholder="Select Model Number"
                      width="w-full"
                      value={form.model_number}
                      onChange={(value) => handleChange("model_number", value)}
                      items={MODEL_NUMBERS} />
                  </div>

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
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Timezone <span className="text-red-400">*</span>
                    </label>
                    <DropDown
                      placeholder="Select Timezone"
                      width="w-full"
                      value={form.utc_time_zone}
                      onChange={(value) => handleChange("utc_time_zone", value)}
                      items={timezones} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Function <span className="text-red-400">*</span>
                    </label>
                    <DropDown
                      placeholder="Select Function"
                      width="w-full"
                      value={form.function}
                      onChange={(value) => handleChange("function", value)}
                      items={FUNCTIONS} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Device Type <span className="text-red-400">*</span>
                    </label>
                    <DropDown
                      placeholder="Select Device Type"
                      width="w-full"
                      value={form.device_type}
                      onChange={(value) => handleChange("device_type", value)}
                      items={DEVICE_TYPES} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-400">
                      Status <span className="text-red-400">*</span>
                    </label>
                    <DropDown
                      placeholder="Select Status"
                      width="w-full"
                      value={form.status_id}
                      onChange={(value) => handleChange("status_id", value)}
                      items={STATUSSES} />
                  </div>
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
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-all text-sm font-bold shadow-lg shadow-primary/20"
                >
                  {loading ? "Saving..." : "Save Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceCreate;
