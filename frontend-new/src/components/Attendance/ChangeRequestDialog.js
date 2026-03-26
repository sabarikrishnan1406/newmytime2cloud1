"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  X,
  PieChart,
  ClipboardList
} from 'lucide-react';
import { approveLeave, getLeavesGroups, rejectLeave } from '@/lib/endpoint/leaves';
import { getUser } from '@/config';
import { notify } from '@/lib/utils';
import DropDown from '../ui/DropDown';
import { updateRequest } from '@/lib/endpoint/attendance';

export default function ChangeRequestDialog({ isOpen, setIsOpen, editedItem, onSuccess }) {
  const [activeTab, setActiveTab] = useState('info');
  const [leaveStats, setLeaveStats] = useState([]);
  const [approveRejectNotes, setApproveRejectNotes] = useState(editedItem?.approve_reject_notes || "");
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsOpen(!open);

  // Computed: Day Difference logic from Vue
  const dayDifference = useMemo(() => {
    if (!editedItem?.start_date || !editedItem?.end_date) return 0;
    const from = new Date(editedItem.start_date);
    const to = new Date(editedItem.end_date);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }, [editedItem]);

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const verifyAvailableCount = async (leaveGroupId) => {

    if (leaveGroupId) {
      try {
        let data1 = await getLeavesGroups(leaveGroupId, {
          per_page: 1000,
          employee_id: editedItem.employee.id,
        });

        let leaveStats = data1[0].leave_count.map((e) => ({
          leave_group: e.leave_type.short_name,
          used: e.employee_used,
          total: e.leave_type_count,
          available: e.leave_type_count - e.employee_used,
        }));

        setLeaveStats(leaveStats)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (isOpen && editedItem?.id) {
      console.log(editedItem);
      verifyAvailableCount(editedItem.employee.leave_group_id)
    }
  }, [isOpen, editedItem]);

  const [selectedStatus, setSelectedStatus] = useState(null)

  const onSubmit = async () => {

    const { company_id } = await getUser();

    let payload = {
      ...editedItem,
      status: selectedStatus,
      company_id: company_id,
    }

    setLoading(true);

    try {
      let result = await updateRequest(editedItem.id, payload);
      if (result.status) {
        notify("Success", "Change request has been updated", "success");
      } else {
        notify("Error", "Change request cannot update", "error");
      }


      onSuccess?.(true);
      setIsOpen(false);

    } catch (e) {
      console.error(e);
      notify("Error", "Change request cannot update", "error");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <Eye size={15} /> View
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={toggleModal}
          />

          {/* Modal Card */}
          <div className="min-w-[400px] max-w-[600px] relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-4xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-start bg-white dark:bg-slate-800">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-200">
                  Change Request
                </h3>
                <p className="text-xs text-slate-400">
                  Reviewing change request for {editedItem?.employee?.full_name}
                </p>
              </div>

              <button
                onClick={toggleModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full p-2"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-7 overflow-y-auto bg-white dark:bg-slate-800 space-y-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 space-y-6">

                  <div className="relative">
                    <DropDown
                      items={[
                        { id: "P", name: "Pending" },
                        { id: "A", name: "Approved" },
                        { id: "R", name: "Rejected" },
                      ]}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      placeholder="Select a Status"
                      width="w-[320px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 gap-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900/30 flex justify-end">
              <button
                onClick={toggleModal}
                className="px-5 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium"
              >
                Close
              </button>

              <button
                onClick={onSubmit}
                className="px-5 py-2 bg-primary rounded-lg  dark:border-white/10 text-slate-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}