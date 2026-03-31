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
