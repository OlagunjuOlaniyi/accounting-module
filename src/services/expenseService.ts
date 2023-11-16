import axios from 'axios';
import axiosInstance from './utils';
import { IexpenseProps } from '../types/expenseTypes';

import { baseURL } from './utils';

//add expense
export const addExpense = async (data: IexpenseProps) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method);
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('transaction_group', data.transaction_group);
  formData.append('transaction_type', data.transaction_type);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('account', data.account);

  const response = await axios.post(`${baseURL}/expenses/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};

//get expenses
export const getExpenses = async () => {
  const response = await axiosInstance.get(`/expenses`);
  return response.data;
};

//get single expense
export const getSingleExpense = async (id?: string) => {
  const response = await axiosInstance.get(`/expenses/${id}/`);
  return response.data;
};

//update expense
export const updateExpense = async (data: IexpenseProps) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method);
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('transaction_group', data.transaction_group);
  formData.append('transaction_type', data.transaction_type);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('account', data.account);

  const response = await axios.put(
    `${baseURL}/expenses/${data.id}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.token}`,
      },
    }
  );
  return response.data;
};

//delete expense
export const deleteExpense = async (id?: string) => {
  const response = await axiosInstance.delete(`/expenses/${id}/`);
  return response.data;
};

//get expense types
export const getExpenseTypes = async (id: string) => {
  const response = await axiosInstance.get(`/expenses/expensetype/group/${id}`);
  return response.data;
};

//get expense groups
export const getExpenseGroups = async () => {
  const response = await axiosInstance.get(`/expenses/expense/group`);
  return response.data;
};
