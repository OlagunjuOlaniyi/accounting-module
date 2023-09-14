import { Fee } from '../types/types';
import axiosInstance from './utils';

//get classes
export const getClasses = async () => {
  const response = await axiosInstance.get(`/payments/payments/class/`);
  return response.data;
};

//create bill
export const createBill = async (data: Fee) => {
  const response = await axiosInstance.post(`/payments/payments/bills/`, data);
  return response.data;
};

//get bills
export const getBills = async () => {
  const response = await axiosInstance.get(`/payments/payments/bills/`);
  return response.data;
};

//get single bill
export const getSingleBill = async (id?: string) => {
  const response = await axiosInstance.get(`/payments/payments/bills/${id}/`);
  return response.data;
};

export const duplicateBill = async (id: string) => {
  const response = await axiosInstance.post(
    `/payments/payments/bills/${id}/duplicate/`
  );
  return response.data;
};

export const deleteBill = async (id: string) => {
  const response = await axiosInstance.delete(
    `/payments/payments/bills/${id}/`
  );
  return response.data;
};

export const updateBill = async (id: string, data: Fee) => {
  const response = await axiosInstance.put(
    `/payments/payments/bills/${id}/`,
    data
  );
  return response.data;
};
