import { getUser } from "@/config/index";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Download PDF report from backend DOMPDF endpoint
 */
export const downloadPDF = async (endpoint, params = {}, fileName = "Report.pdf") => {
    try {
        const user = await getUser();
        const queryParams = new URLSearchParams({
            ...params,
            company_id: user?.company_id || 0,
            action: 'download',
        });

        const url = `${API_BASE}/${endpoint}?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/pdf' },
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    } catch (err) {
        console.error("PDF Download Error:", err);
        alert(`Download failed: ${err.message}`);
    }
};

/**
 * Download Daily Attendance PDF
 */
export const downloadDailyPDF = async ({ date, branch_ids, department_ids, employee_ids } = {}) => {
    const params = { date: date || new Date().toISOString().split('T')[0] };
    if (branch_ids?.length) params.branch_ids = branch_ids.join(',');
    if (department_ids?.length) params.department_ids = department_ids.join(',');
    if (employee_ids?.length) params.employee_ids = employee_ids.join(',');

    await downloadPDF('report/daily_pdf', params, `Daily_Attendance_${params.date}.pdf`);
};

/**
 * Download Monthly Detail PDF (per employee)
 */
export const downloadMonthlyDetailPDF = async ({ from_date, to_date, branch_ids, department_ids, employee_ids } = {}) => {
    const params = { from_date, to_date };
    if (branch_ids?.length) params.branch_ids = branch_ids.join(',');
    if (department_ids?.length) params.department_ids = department_ids.join(',');
    if (employee_ids?.length) params.employee_ids = employee_ids.join(',');

    await downloadPDF('report/monthly_detail_pdf', params, `Monthly_Attendance_Detail_${from_date}_to_${to_date}.pdf`);
};

/**
 * Download Monthly Grid PDF (matrix view)
 */
export const downloadMonthlyGridPDF = async ({ from_date, to_date, branch_ids, department_ids, employee_ids } = {}) => {
    const params = { from_date, to_date };
    if (branch_ids?.length) params.branch_ids = branch_ids.join(',');
    if (department_ids?.length) params.department_ids = department_ids.join(',');
    if (employee_ids?.length) params.employee_ids = employee_ids.join(',');

    await downloadPDF('report/monthly_grid_pdf', params, `Monthly_Attendance_Grid_${from_date}_to_${to_date}.pdf`);
};

export const downloadReport = async (reportUrl, fileName = "Daily-Summary-Report.pdf") => {
    let objectUrl = null;

    try {
        const response = await fetch("http://localhost:3002/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: reportUrl })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText || 'Failed to generate PDF'}`);
        }

        const blob = await response.blob();

        // 1. Create the URL and the link element
        objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = objectUrl;
        link.download = fileName;

        // 2. Append to body (required for some browsers like Firefox)
        document.body.appendChild(link);
        link.click();

        // 3. Clean up the DOM
        document.body.removeChild(link);

    } catch (err) {
        console.error("Report Download Error:", err);
        // Better to use a UI notification system than a blocking alert()
        alert(`Download failed: ${err.message}`);
    } finally {
        // 4. Critical: Free up memory once the download is triggered
        if (objectUrl) {
            // Short delay ensures the browser has started the download before revoking
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        }
    }
};