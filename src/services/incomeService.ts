import axiosInstance from './utils';
import { IexpenseProps } from '../types/expenseTypes';

import { baseURL } from './utils';
import axios from 'axios';

//add income
export const addIncome = async (data: IexpenseProps) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method?.toUpperCase());
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('transaction_group', data.transaction_group);
  formData.append('transaction_type', data.transaction_type);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('account', data.account);

  const response = await axios.post(`${baseURL}/incomes/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};

//update income
export const updateIncome = async (data: IexpenseProps) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method?.toUpperCase());
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('transaction_group', data.transaction_group);
  formData.append('transaction_type', data.transaction_type);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('account', data.account);

  const response = await axios.put(`${baseURL}/incomes/${data.id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};

//get incomes
export const getIncomes = async () => {
  const response = await axiosInstance.get(`/incomes/`);
  return response.data;
};

//get single income
export const getSingleIncome = async (id?: string) => {
  const response = await axiosInstance.get(`/incomes/${id}/`);
  return response.data;
};

//delete income
export const deleteIncome = async (id?: string) => {
  const response = await axiosInstance.delete(`/incomes/${id}/`);
  return response.data;
};

//get income types
export const getIncomeTypes = async (id: string) => {
  const response = await axiosInstance.get(`/incomes/incometype/group/${id}`);
  return response.data;
};

//get income groups
export const getIncomeGroups = async () => {
  const response = await axiosInstance.get(`/incomes/incomegroup`);
  return response.data;
};
