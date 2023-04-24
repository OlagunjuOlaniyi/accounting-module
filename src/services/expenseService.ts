import axios from 'axios';
import axiosInstance from './utils';
import { IexpenseProps } from '../types/expenseTypes';
import { urlToken } from './utils';

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

  const response = await axios.post(`/expenses`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${urlToken}`,
    },
  });
  return response.data;
};

//get expenses
export const getExpenses = async () => {
  const response = await axiosInstance.get(`/expenses`);
  return response.data;
};
