"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getBranches, getDepartmentsByBranchIds, getEmployees } from '@/lib/api';
import { EmployeeExtras } from '@/components/Employees/Extras';
import Columns from "../columns";
import DataTable from "@/components/ui/DataTable";
import Pagination from "@/lib/Pagination";
import MultiDropDown from "@/components/ui/MultiDropDown";
import DropDown from "@/components/Theme/DropDown";
import { notify, parseApiError } from "@/lib/utils";

export default function PayrollEmployeesPage() {
  const router = useRouter();
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => { setBranches(await getBranches()); };
    fetchBranches();
  }, []);

  const fetchRecords = useCallback(async (page, perPage) => {
    setIsLoading(true);
    try {
      const result = await getEmployees({ page, per_page: perPage, branch_ids: selectedBranchIds });
      if (result?.data) {
        setEmployees(result.data);
        setCurrentPage(result.current_page || 1);
        setTotal(result.total || 0);
      }
    } catch (error) {
      notify("Error", parseApiError(error), "error");
    } finally {
      setIsLoading(false);
    }
  }, [perPage, selectedBranchIds]);

  useEffect(() => { fetchRecords(currentPage, perPage); }, [currentPage, perPage, fetchRecords]);

  return (
    <div className="p-4 pb-24 overflow-y-auto max-h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl font-bold text-gray-600 dark:text-gray-300">Payroll Employees</h1>
        <MultiDropDown placeholder="Select Branch" items={branches} value={selectedBranchIds} onChange={setSelectedBranchIds} badgesCount={1} width="w-[220px]" />
      </div>
      <DataTable columns={Columns()} data={employees} isLoading={isLoading}
        pagination={<Pagination page={currentPage} perPage={perPage} total={total} onPageChange={setCurrentPage} onPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }} pageSizeOptions={[10, 25, 50]} />} />
    </div>
  );
}
