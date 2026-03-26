"use client";

import React, { useState, useEffect, useMemo } from "react";

import { notify, parseApiError } from "@/lib/utils";
import { getUser } from "@/config/index";
import Input from "../Theme/Input";
import { Select } from "../ui/select";
import TextArea from "../Theme/TextArea";
import { createLeave, getLeaveTypesByGroupId, uploadLeaveDocuments } from "@/lib/endpoint/leaves";
import { getEmployeesByDepartmentId, getEmployeesByDepartmentIds } from "@/lib/api/employee";
import DatePicker from "../ui/DatePicker";
import DropDown from "../ui/DropDown";

const initialPayload = {
    leave_type_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    reason: "",
    alternate_employee_id: 0,
    employee_id: 0,
};

export default function LeaveRequestCreate({
    setOpen = () => { },
    onSuccess = () => { },
    editData = null,
}) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(initialPayload);
    const [alternateEmployee, setAlternateEmployee] = useState(null);
    const [departmentEmployees, setDepartmentEmployees] = useState([]);
    const [leaveAvailableCount, setLeaveAvailableCount] = useState(0);
    const [canApply, setCanApply] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [showDocUpload, setShowDocUpload] = useState(false);
    const [errors, setErrors] = useState({});

    const isEdit = !!editData;

    // Initialize form with edit data
    useEffect(() => {
        if (editData) {
            setForm({
                leave_type_id: editData.leave_type_id || "",
                start_date: editData.start_date || "",
                end_date: editData.end_date || "",
                reason: editData.reason || "",
                alternate_employee_id: editData.alternate_employee_id || 0,
                employee_id: editData.employee_id || 0,
            });
            if (editData.alternate_employee) {
                setAlternateEmployee({
                    ...editData.alternate_employee,
                    department: editData.alternate_employee?.department?.name,
                    designation: editData.alternate_employee?.designation?.name,
                });
            }
            if (editData.leave_type_id) {
                verifyAvailableCount(editData.leave_type_id);
            }
        }
    }, [editData]);

    // Fetch department employees on mount
    useEffect(() => {
        fetchDepartmentEmployees();
    }, []);

    const [leaveTypes, setLeaveTypes] = useState([]);

    useEffect(() => {
        const fetchLeaveTypes = async () => {

            const selected = departmentEmployees.find((e) => e.id === Number(form.employee_id));

            if (!selected || !selected?.leave_group_id) {
                setLeaveTypes([]);
                return;
            };

            try {
                const data = await getLeaveTypesByGroupId(selected.leave_group_id, { per_page: 1000, employee_id: selected.id });

                setLeaveTypes(data.map(e => ({
                    id: e.id,
                    name: e.leave_type.name,
                    leave_type_count: e.leave_type_count,
                    employee_used: e.employee_used,
                })));

            } catch (error) {
                console.log(error);
                notify("Error", parseApiError(error), "error");
            }
        }

        fetchLeaveTypes();

    }, [form.employee_id]);


    const fetchDepartmentEmployees = async () => {
        try {
            let data = await getEmployeesByDepartmentId();

            let mappedData = data.map((e) => ({
                id: e.id,
                profile_picture: e.profile_picture,
                employee_id: e.employee_id,
                name: e.full_name,
                department: e?.department?.name,
                designation: e?.designation?.name,
                leave_group_id: e.leave_group_id,
                reporting_manager_id: e.reporting_manager_id,

            }));

            console.log(mappedData);

            setDepartmentEmployees(mappedData);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const verifyAvailableCount = (leaveTypeId) => {
        const filterObject = leaveTypes.find(
            (item) => item.id === Number(leaveTypeId)
        );
        if (!filterObject) return;

        console.log(filterObject);

        const available = filterObject.leave_type_count - filterObject.employee_used;
        setCanApply(available > 0);
        setLeaveAvailableCount(
            `${filterObject.employee_used} / ${filterObject.leave_type_count}`
        );
    };

    useEffect(() => {
        verifyAvailableCount(form.leave_type_id);
    }, [form.leave_type_id])
 

    const handleAlternateEmployeeChange = (value) => {
        const selected = departmentEmployees.find((e) => e.id === Number(value));
        setAlternateEmployee(selected || null);
        handleChange("alternate_employee_id", selected?.id || 0);
    };

    // Day difference calculation
    const dayDifference = useMemo(() => {
        if (!form.start_date || !form.end_date) return 0;
        const from = new Date(form.start_date);
        const to = new Date(form.end_date);
        return Math.max(1, (to - from) / (1000 * 60 * 60 * 24) + 1);
    }, [form.start_date, form.end_date]);

    // Document handling
    const addDocument = () => {
        setDocuments((prev) => [...prev, { title: "", file: null, previewUrl: "" }]);
    };

    const removeDocument = (index) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    const updateDocument = (index, field, value) => {
        setDocuments((prev) =>
            prev.map((doc, i) => {
                if (i !== index) return doc;
                if (field === "file" && value) {
                    // if (value.size > 100 * 1024) {
                    //     notify("Error", "File size must be less than 100KB", "error");
                    //     return doc;
                    // }
                    return { ...doc, file: value, previewUrl: URL.createObjectURL(value) };
                }
                return { ...doc, [field]: value };
            })
        );
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const user = await getUser();
            const selectedEmployee = departmentEmployees.find(
                (e) => e.id === Number(form.employee_id)
            );

            const payload = {
                company_id: user?.company_id || 0,
                employee_id: form.employee_id,
                reporting_manager_id: selectedEmployee?.reporting_manager_id || 0,
                leave_type_id: form.leave_type_id,
                start_date: form.start_date,
                end_date: form.end_date,
                reason: form.reason,
                alternate_employee_id: alternateEmployee?.id || 0,
            };

            let response;
            if (isEdit) {
                response = await createLeave(editData.id, payload);
            } else {
                response = await createLeave(null, payload);
            }

            if (response?.status === false) {
                if (response.errors) {
                    setErrors(response.errors);
                    const firstKey = Object.keys(response.errors)[0];
                    notify("Error", response.errors[firstKey][0], "error");
                    return;
                } else {
                    notify("Error", response.message, "error");
                    onSuccess();
                    return;
                }
            }

            // Upload documents after leave is created
            const leaveId = response?.record?.id;
            const validDocs = documents.filter((doc) => doc.file && doc.title);

            if (leaveId && validDocs.length > 0) {
                try {
                    await uploadLeaveDocuments(leaveId, form.employee_id, validDocs);
                } catch (docError) {
                    notify("Warning", "Leave created but document upload failed", "error");
                    console.error("Document upload error:", docError);
                }
            }

            await notify(
                "Success",
                isEdit ? "Leave Updated Successfully" : "Leave Applied Successfully",
                "success"
            );

            setForm(initialPayload);
            setAlternateEmployee(null);
            setDocuments([]);
            onSuccess();
        } catch (error) {
            notify("Error", parseApiError(error), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {open && (
                <div
                    aria-modal="true"
                    role="dialog"
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                >
                    {/* Backdrop/Overlay */}
                    <div className="absolute inset-0 bg-black/70 frosted-glass transition-opacity animate-in fade-in duration-300"></div>

                    {/* Modal Card */}
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-3xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">
                                    {isEdit ? "Edit Leave" : "Apply Leave"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {isEdit
                                        ? "Update your leave application"
                                        : "Submit a new leave request"}
                                </p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full p-1"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 space-y-5 bg-white/50 dark:bg-gray-900 overflow-y-auto flex-1">
                                {/* Date Pickers & Day Count */}
                                <div className="grid grid-cols-5 gap-4">
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            From Date <span className="text-red-400">*</span>
                                        </label>
                                        <DatePicker
                                            value={form.start_date}
                                            onChange={(e) => handleChange("start_date", e)}
                                        />


                                    </div>

                                    <div className="col-span-2 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            To Date <span className="text-red-400">*</span>
                                        </label>
                                        <DatePicker
                                            value={form.end_date}
                                            min={form.start_date}
                                            onChange={(e) => handleChange("end_date", e)}
                                        />
                                    </div>

                                    <div className="col-span-1 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            Days
                                        </label>
                                        <div className="flex items-center justify-center h-[42px] rounded-xl border border-border bg-gray-50 dark:bg-gray-900">
                                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                                {dayDifference}
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                <div className="grid grid-cols-6 gap-4">
                                    <div className="col-span-3 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            Employee <span className="text-red-400">*</span>
                                        </label>
                                        <DropDown
                                            width="w-full"
                                            items={departmentEmployees}
                                            value={form.employee_id || 0}
                                            onChange={(v) => handleChange("employee_id", v)}
                                        />
                                    </div>

                                    <div className="col-span-3 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            Alternate Employee <span className="text-red-400">*</span>
                                        </label>
                                        <DropDown
                                            width="w-full"
                                            items={departmentEmployees}
                                            value={form.alternate_employee_id || ""}
                                            onChange={(title) => handleAlternateEmployeeChange(title)}
                                        />
                                    </div>
                                </div>

                                {/* Alternate Employee Info Card */}
                                {alternateEmployee && (
                                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                                        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-white/10">
                                            <span className="text-xs font-medium text-slate-400">
                                                Alternate Employee Info
                                            </span>
                                        </div>
                                        <div className="p-4 flex items-center gap-4">
                                            <img
                                                src={alternateEmployee.profile_picture}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-white/10 shrink-0"
                                            />
                                            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 whitespace-nowrap">Full Name:</span>
                                                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                                                        {alternateEmployee.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 whitespace-nowrap">Employee ID:</span>
                                                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                                                        {alternateEmployee.employee_id}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 whitespace-nowrap">Department:</span>
                                                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                                                        {alternateEmployee.department}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 whitespace-nowrap">Designation:</span>
                                                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                                                        {alternateEmployee.designation}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                <div className="grid grid-cols-6 gap-4">
                                    <div className="col-span-3 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            Leave Type <span className="text-red-400">*</span>
                                        </label>
                                        <DropDown
                                            width="w-full"
                                            items={leaveTypes}
                                            value={form.leave_type_id || ""}
                                            onChange={(v) => handleChange("leave_type_id", v)}
                                        />
                                    </div>

                                    <div className="col-span-3 space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-400">
                                            Available Leaves
                                        </label>
                                        <Input
                                            value={leaveAvailableCount}
                                            readOnly
                                        />
                                    </div>
                                </div>



                                {/* Reason / Note */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-400">
                                        Reason / Note <span className="text-red-400">*</span>
                                    </label>
                                    <TextArea
                                        placeholder="Enter reason for leave..."
                                        rows={3}
                                        value={form.reason}
                                        onChange={(e) => handleChange("reason", e.target.value)}
                                    />
                                </div>

                                {/* Upload Document Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowDocUpload(true)}
                                    className="w-full px-4 py-2 rounded-lg border border-dashed border-primary text-primary hover:bg-primary/5 transition-all text-sm font-medium"
                                >
                                    Upload Document
                                </button>

                                {/* Document Upload Section */}
                                {showDocUpload && (
                                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                                        <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-400">
                                                Documents
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowDocUpload(false)}
                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    close
                                                </span>
                                            </button>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {documents.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Input
                                                        placeholder="Title"
                                                        value={doc.title}
                                                        onChange={(e) =>
                                                            updateDocument(index, "title", e.target.value)
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <Input
                                                        type="file"
                                                        onChange={(e) =>
                                                            updateDocument(
                                                                index,
                                                                "file",
                                                                e.target.files[0]
                                                            )
                                                        }
                                                        className="flex-1 text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                    />
                                                    {doc.previewUrl && (
                                                        <a
                                                            href={doc.previewUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-primary text-xs underline whitespace-nowrap"
                                                        >
                                                            View
                                                        </a>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDocument(index)}
                                                        className="text-red-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">
                                                            close
                                                        </span>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addDocument}
                                                className="flex items-center gap-1 text-sm text-primary hover:text-blue-600 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    add_circle
                                                </span>
                                                Add Document
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Uploaded Documents Table */}
                                {documents.length > 0 && !showDocUpload && (
                                    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-800">
                                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-400">
                                                        Title
                                                    </th>
                                                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-400">
                                                        File
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documents.map((d, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-t border-gray-100 dark:border-white/5"
                                                    >
                                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                                            {d.title}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            {d.previewUrl && (
                                                                <a
                                                                    href={d.previewUrl}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-primary text-xs underline"
                                                                >
                                                                    View file
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Error Display */}
                                {errors && errors.reporting_manager_id && (
                                    <p className="text-sm text-red-400">
                                        Reporting Manager ID is not assigned. Contact Admin.
                                    </p>
                                )}

                                {!canApply && (
                                    <p className="text-sm text-red-400">
                                        No available leaves for the selected leave type.
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm font-bold"
                                >
                                    Cancel
                                </button>
                                {canApply && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-600 transition-all text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        {loading
                                            ? "Submitting..."
                                            : isEdit
                                                ? "Update"
                                                : "Submit"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}