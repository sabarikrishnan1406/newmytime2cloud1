import { getUser } from "@/config/index";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Download PDF report from backend DOMPDF endpoint
 */
export const downloadPDF = async (endpoint, params = {}, fileName = "Report.pdf", onProgress = null) => {
    try {
        const user = await getUser();
        const queryParams = new URLSearchParams({
            ...params,
            company_id: user?.company_id || 0,
            action: 'download',
        });

        const url = `${API_BASE}/${endpoint}?${queryParams.toString()}`;

        if (onProgress) onProgress(5);

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/pdf' },
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        if (onProgress) onProgress(30);

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        if (total && response.body) {
            const reader = response.body.getReader();
            const chunks = [];
            let received = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                received += value.length;
                if (onProgress) onProgress(30 + Math.round((received / total) * 60));
            }

            const blob = new Blob(chunks, { type: 'application/pdf' });
            if (onProgress) onProgress(95);

            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        } else {
            // Fallback: simulate progress
            if (onProgress) onProgress(50);
            const blob = await response.blob();
            if (onProgress) onProgress(90);

            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        }

        if (onProgress) onProgress(100);
    } catch (err) {
        console.error("PDF Download Error:", err);
        throw err;
    }
};

/**
 * Download Daily Attendance PDF
 */
export const downloadDailyPDF = async ({ date, branch_ids, department_ids, employee_ids, onProgress } = {}) => {
    const params = { date: date || new Date().toISOString().split('T')[0] };
    if (branch_ids?.length) params.branch_ids = branch_ids.join(',');
    if (department_ids?.length) params.department_ids = department_ids.join(',');
    if (employee_ids?.length) params.employee_ids = employee_ids.join(',');

    await downloadPDF('report/daily_pdf', params, `Daily_Attendance_${params.date}.pdf`, onProgress);
};

/**
 * Download Monthly Detail PDF (per employee)
 */
export const downloadMonthlyDetailPDF = async ({ from_date, to_date, branch_ids, department_ids, employee_ids, onProgress } = {}) => {
    const params = { from_date, to_date };
    if (branch_ids?.length) params.branch_ids = branch_ids.join(',');
    if (department_ids?.length) params.department_ids = department_ids.join(',');
    if (employee_ids?.length) params.employee_ids = employee_ids.join(',');

    await downloadPDF('report/monthly_detail_pdf', params, `Monthly_Attendance_Detail_${from_date}_to_${to_date}.pdf`, onProgress);
};

/**
 * Download Monthly Grid PDF (matrix view)
 */
export const downloadMonthlyGridPDF = async ({ from_date, to_date, branch_ids, department_ids, employee_ids, onProgress } = {}) => {
    const params = { from_date, to_date };
    if (branch_ids?.length) params.branch_ids = branch_ids.join(',');
    if (department_ids?.length) params.department_ids = department_ids.join(',');
    if (employee_ids?.length) params.employee_ids = employee_ids.join(',');

    await downloadPDF('report/monthly_grid_pdf', params, `Monthly_Attendance_Grid_${from_date}_to_${to_date}.pdf`, onProgress);
};

export const downloadReport = async (reportUrl, fileName = "Daily-Summary-Report.pdf", onProgress = null) => {
    let objectUrl = null;

    try {
        if (onProgress) onProgress(5);

        const response = await fetch("http://localhost:3002/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: reportUrl })
        });

        if (onProgress) onProgress(30);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText || 'Failed to generate PDF'}`);
        }

        if (onProgress) onProgress(60);

        const blob = await response.blob();

        if (onProgress) onProgress(90);

        objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (onProgress) onProgress(100);
    } catch (err) {
        console.error("Report Download Error:", err);
        throw err;
    } finally {
        if (objectUrl) {
            setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
        }
    }
};