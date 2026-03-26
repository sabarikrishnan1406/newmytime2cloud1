"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, RefreshCw, Download, DownloadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBranches, getDepartmentsByBranchIds, getEmployees, removeEmployee } from '@/lib/api';
import { EmployeeExtras } from '@/components/Employees/Extras';

import Columns from "./columns";
import DataTable from '@/components/ui/DataTable';
import Pagination from '@/lib/Pagination';
import { parseApiError, lastTenYears, months, getMonths } from '@/lib/utils';
import Input from '@/components/Theme/Input';
import IconButton from '@/components/Theme/IconButton';
import MultiDropDown from '@/components/ui/MultiDropDown';
import ViewPayslip from '@/components/Payslip/View';
import DropDown from '@/components/ui/DropDown';
import { renderPayslip } from '@/lib/endpoint/payroll';



export default function EmployeesPage() {

    const router = useRouter();

    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedBranchIds, setSelectedBranchIds] = useState([]);
    const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);
    const [months, setMonths] = useState([
        { id: 1, name: "January" },
        { id: 2, name: "February" },
        { id: 3, name: "March" },
        { id: 4, name: "April" },
        { id: 5, name: "May" },
        { id: 6, name: "June" },
        { id: 7, name: "July" },
        { id: 8, name: "August" },
        { id: 9, name: "September" },
        { id: 10, name: "October" },
        { id: 11, name: "November" },
        { id: 12, name: "December" },]);

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotalEmployees] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        const fetchBranches = async () => {
            try {
                setBranches(await getBranches());
            } catch (error) {
                setError(parseApiError(error));
            }
        };

        fetchBranches();
    }, []);


    useEffect(() => {
        const fetchDepartments = async (selectedBranchIds) => {
            try {
                setDepartments(await getDepartmentsByBranchIds(selectedBranchIds));
            } catch (error) {
                setError(parseApiError(error));
            }
        };
        fetchDepartments(selectedBranchIds);
    }, [selectedBranchIds]);

    const fetchEmployees = useCallback(async (page, perPage) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                page: page,
                per_page: perPage,
                sortDesc: 'false',
                department_ids: selectedDepartmentIds.length > 0 ? selectedDepartmentIds : [],
                search: searchTerm || null, // Only include search if it's not empty
            };
            const result = await getEmployees(params);

            // Check if result has expected structure before setting state
            if (result && Array.isArray(result.data)) {
                setEmployees(result.data);
                setCurrentPage(result.current_page || 1);
                setTotalEmployees(result.total || 0);
                setIsLoading(false);
                return; // Success, exit
            } else {
                // If the API returned a 2xx status but the data structure is wrong
                throw new Error('Invalid data structure received from API.');
            }

        } catch (error) {
            setError(parseApiError(error));
            setIsLoading(false);
        }
    }, [perPage, selectedDepartmentIds, searchTerm]);


    useEffect(() => {
        fetchEmployees(currentPage, perPage);
    }, [currentPage, perPage, fetchEmployees]); // Re-fetch when page or perPage changes

    const handleRefresh = () => {
        fetchEmployees(currentPage, perPage);
    }

    const viewEmployee = async (item) => {

        const params = {
            company_id: item.company_id,
            employee_id: item.id,
            month: selectedMonth,
            year: selectedYear
        };

        renderPayslip(params)
    };

    useEffect(() => {

        let dt = new Date();

        let mns = getMonths();

        let month = mns.slice(0, selectedYear == dt.getFullYear() ? dt.getMonth() : 12);

        setMonths(month);

    }, [selectedYear])

    return (
        <div className='p-4 pb-24 overflow-y-auto max-h-[calc(100vh-100px)]'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6  sm:space-y-0">
                <h1 className="text-2xl font-extrabold text-gray-600 dark:text-gray-300 flex items-center">
                    {/* <User className="w-7 h-7 mr-3 text-indigo-600" /> */}
                    Employees
                </h1>
                <div className="flex flex-wrap items-center space-x-3 space-y-2 sm:space-y-0">
                    <div className="relative">
                        <MultiDropDown
                            placeholder={'Select Branch'}
                            items={branches}
                            value={selectedBranchIds}
                            onChange={setSelectedBranchIds}
                            badgesCount={1}
                            width='w-[220px]'
                        />
                    </div>
                    <div className="relative">
                        <MultiDropDown
                            placeholder={'Select Department'}
                            items={departments}
                            value={selectedDepartmentIds}
                            onChange={setSelectedDepartmentIds}
                            badgesCount={1}
                        />
                    </div>
                    <div className="relative">
                        <DropDown
                            placeholder={'Select Year'}
                            items={lastTenYears()}
                            value={selectedYear}
                            onChange={setSelectedYear}
                        />
                    </div>

                    <div className="relative">
                        <DropDown
                            placeholder={'Select Month'}
                            items={months}
                            value={selectedMonth}
                            onChange={setSelectedMonth}
                        />
                    </div>

                    <div className="relative">
                        <Input
                            placeholder="Search by name or ID"
                            icon="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <IconButton
                        icon={RefreshCw}
                        onClick={handleRefresh}
                        isLoading={isLoading}
                        title="Refresh Data"
                    />
                    {/* 
                    <button className="bg-primary text-white px-4 py-1 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-all flex items-center space-x-2 whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        <span>New</span>
                    </button> */}
                </div>
            </div>

            <DataTable
                columns={Columns(viewEmployee)}
                data={employees}
                isLoading={isLoading}
                error={error}
                onRowClick={(item) => () => { }}
                pagination={
                    <Pagination
                        page={currentPage}
                        perPage={perPage}
                        total={total}
                        onPageChange={setCurrentPage}
                        onPerPageChange={(n) => {
                            setPerPage(n);
                            setCurrentPage(1);
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                }
            />
        </div >
    );
}
