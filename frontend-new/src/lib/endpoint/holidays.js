import { api } from "../api";
import { API_BASE, buildQueryParams } from "../api-client";

export const getGoogleHolidays = async (selectedYear) => {
    const { data } = await api.get(`https://googlecalendar.mytime2cloud.com/holidays/${selectedYear}`);
    return data;
};

export const getHolidays = async (params = {}) => {
    let baseURL = API_BASE;
    // baseURL = `https://backend.mytime2cloud.com/api`;
    const { data } = await api.get(`${baseURL}/holidays`, { params: await buildQueryParams(params) });
    return data;
};

export const storeHolidays = async (payload = {}) => {
    let baseURL = API_BASE;
    // baseURL = `https://backend.mytime2cloud.com/api`;
    await api.post(`${baseURL}/holidays`, payload);
    return true;
};

export const updateHolidays = async (id, payload = {}) => {
    let baseURL = API_BASE;
    // baseURL = `https://backend.mytime2cloud.com/api`;
    await api.put(`${baseURL}/holidays/${id}`, payload);
    return true;
};

export const deleteHolidays = async (id) => {
    let baseURL = API_BASE;
    // baseURL = `https://backend.mytime2cloud.com/api`;
    await api.delete(`${baseURL}/holidays/${id}`);
    return true;
};