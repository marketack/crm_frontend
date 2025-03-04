// src/services/roleService.ts
import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/admin/roles`;

export const getAllRoles = async () => {
  return await axios.get(API_URL);
};

export const createRole = async (data: { name: string; permissions: string[] }) => {
  return await axios.post(API_URL, data);
};

export const updateRole = async (roleId: string, data: object) => {
  return await axios.put(`${API_URL}/${roleId}`, data);
};

export const deleteRole = async (roleId: string) => {
  return await axios.delete(`${API_URL}/${roleId}`);
};
