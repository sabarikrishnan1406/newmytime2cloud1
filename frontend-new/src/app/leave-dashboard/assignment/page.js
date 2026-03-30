"use client";

import React, { useState, useMemo } from "react";
import { Search, Users, CheckCircle2 } from "lucide-react";
import { employees, leaveGroups, getLeaveGroup } from "@/lib/leave-store";

const departments = [...new Set(employees.map((e) => e.department))];

export default function EmployeeAssignment() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [assignGroupId, setAssignGroupId] = useState("");
  const [employeeList, setEmployeeList] = useState(employees);

  const filtered = useMemo(() => {
    return employeeList.filter((emp) => {
      const matchesSearch =
        !search ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = !departmentFilter || emp.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [employeeList, search, departmentFilter]);

  const allSelected = filtered.length > 0 && filtered.every((e) => selectedIds.includes(e.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.find((e) => e.id === id)));
    } else {
      const filteredIds = filtered.map((e) => e.id);
      setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = () => {
    if (!assignGroupId || selectedIds.length === 0) return;
    setEmployeeList((prev) =>
      prev.map((emp) =>
        selectedIds.includes(emp.id) ? { ...emp, leaveGroupId: assignGroupId } : emp
      )
    );
    setSelectedIds([]);
    setAssignGroupId("");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-600 dark:text-white">
          Employee Assignment
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Assign leave groups to employees across your organization
        </p>
      </div>

      {/* Filters + Bulk Action */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl border outline-none
                bg-white border-gray-200 text-slate-600 placeholder:text-slate-400
                dark:bg-slate-900 dark:border-white/10 dark:text-slate-300 dark:placeholder:text-slate-600
                focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium rounded-xl border outline-none cursor-pointer
              bg-white border-gray-200 text-slate-600
              dark:bg-slate-900 dark:border-white/10 dark:text-slate-300
              focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Bulk Assign - appears when employees selected */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-semibold text-slate-400">
                {selectedIds.length} selected
              </span>
              <select
                value={assignGroupId}
                onChange={(e) => setAssignGroupId(e.target.value)}
                className="px-4 py-2.5 text-sm font-medium rounded-xl border outline-none cursor-pointer
                  bg-white border-gray-200 text-slate-600
                  dark:bg-slate-900 dark:border-white/10 dark:text-slate-300
                  focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              >
                <option value="">Select Leave Group</option>
                {leaveGroups.map((lg) => (
                  <option key={lg.id} value={lg.id}>
                    {lg.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBulkAssign}
                disabled={!assignGroupId}
                className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                  bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users className="w-4 h-4" />
          <span>
            <span className="font-semibold text-white">{filtered.length}</span> employees
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            <span className="font-semibold text-white">
              {employeeList.filter((e) => e.leaveGroupId).length}
            </span>{" "}
            assigned
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-white/20 bg-transparent text-primary
                      focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                  />
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Leave Group
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const group = emp.leaveGroupId ? getLeaveGroup(emp.leaveGroupId) : null;
                  const isSelected = selectedIds.includes(emp.id);

                  return (
                    <tr
                      key={emp.id}
                      className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer
                        ${isSelected ? "bg-primary/5" : ""}`}
                      onClick={() => toggleSelect(emp.id)}
                    >
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(emp.id)}
                          className="w-4 h-4 rounded border-white/20 bg-transparent text-primary
                            focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {emp.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-700 dark:text-white">{emp.name}</p>
                            <p className="text-xs text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-slate-300">
                        {emp.department}
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-slate-300">
                        {emp.category}
                      </td>
                      <td className="px-5 py-3 text-gray-600 dark:text-slate-300">
                        {group ? group.name : <span className="text-slate-500">--</span>}
                      </td>
                      <td className="px-5 py-3">
                        {group ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-500/20 text-slate-400 border-slate-500/30">
                            Unassigned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
