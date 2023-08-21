import axios from 'axios';
import { IexpenseProps } from '../types/expenseTypes';
import axiosInstance, { baseURL } from './utils';

//get profit and loss
export const getProfitAndLoss = async () => {
  const response = await axiosInstance.get(`/incomes/profitloss`);
  return response.data;
};

//get trial balance
export const getTrialBalance = async () => {
  const response = await axiosInstance.get(`/incomes/trialbalance`);
  return response.data;
};

//get asset
export const getAssets = async () => {
  const response = await axiosInstance.get(`/assets`);
  return response.data;
};

//get asset groups
export const getAssetGroups = async () => {
  const response = await axiosInstance.get(`/assets/asset/group`);
  return response.data;
};

//get asset types
export const getAssetTypes = async () => {
  const response = await axiosInstance.get(`/assets/asset/type`);
  return response.data;
};

//get liabilities
export const getLiabilities = async () => {
  const response = await axiosInstance.get(`/liability`);
  return response.data;
};

//get equity
export const getEquity = async () => {
  const response = await axiosInstance.get(`/equity`);
  return response.data;
};

//create asset
export const createAsset = async (data: IexpenseProps) => {
  const response = await axiosInstance.post(`/assets/`, data);
  return response.data;
};

//create equity
export const createEquity = async (data: IexpenseProps) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method?.toUpperCase());
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('transaction_group', data.transaction_group);
  formData.append('transaction_type', data.transaction_type);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('account', data.name!);
  formData.append('name', data.name!);

  const response = await axios.post(`${baseURL}equity/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};

//create liability
export const createLiability = async (data: IexpenseProps) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method?.toUpperCase());
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('transaction_group', data.transaction_group);
  formData.append('transaction_type', data.transaction_type);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('name', data.name!);
  formData.append('account', data.name!);

  const response = await axios.post(`${baseURL}liability/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};
