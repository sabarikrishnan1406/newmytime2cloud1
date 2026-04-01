import { api, buildQueryParams } from "@/lib/api-client";

export const getCameras = async (params = {}) => {
    const { data } = await api.get(`/cameras`, { params: await buildQueryParams(params) });
    return data;
};

export const getCameraStatus = async (deviceId) => {
    const { data } = await api.get(`/camera/${deviceId}/status`);
    return data;
};

export const getCameraCredentials = async (deviceId) => {
    const { data } = await api.get(`/camera/${deviceId}/credentials`);
    return data;
};

const CAMERA_SERVICE_URL = process.env.NEXT_PUBLIC_CAMERA_SERVICE_HTTP_URL || "http://localhost:8500";

export const registerFace = async (employeeId, frame, companyId) => {
    const response = await fetch(`${CAMERA_SERVICE_URL}/register/${employeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame, company_id: companyId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Registration failed");
    return data;
};

export const deleteFaceEmbeddings = async (employeeId) => {
    const response = await fetch(`${CAMERA_SERVICE_URL}/register/${employeeId}`, {
        method: "DELETE",
    });
    return await response.json();
};

export const syncEmbeddings = async (companyId = 1) => {
    const response = await fetch(`${CAMERA_SERVICE_URL}/employees/sync?company_id=${companyId}`);
    return await response.json();
};
