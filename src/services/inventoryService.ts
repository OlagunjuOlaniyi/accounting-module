import axiosInstance from './utils';
import { baseURL } from './utils';
import axios from 'axios';

export const getProducts = async () => {
  const response = await axiosInstance.get(`/inventory`);
  return response.data;
};

export const getDispensedProducts = async () => {
  const response = await axiosInstance.get(`/inventory/student/dispense/`);
  return response.data;
};

export const searchProducts = async (query: string) => {
  const response = await axiosInstance.get(
    `/inventory/product/search/?query=${query}`
  );
  return response.data;
};

export const addProduct = async (data: any) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method);
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('product_group_name', data.product_group_name?.toUpperCase());
  formData.append(
    'product_category_name',
    data.product_category_name?.toUpperCase()
  );
  formData.append('image', data.image);
  formData.append('attachment', data.attachment);
  formData.append('date', data.date);
  formData.append('name', data.name);
  formData.append('is_newly_purchased', data.is_newly_purchased);
  formData.append('reorder_level', data.reorder_level);
  formData.append('transaction_date', data.date);
  formData.append('sizes', JSON.stringify(data.sizes));

  const response = await axios.post(`${baseURL}/inventory/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};

export const editProduct = async (data: any, id: string) => {
  const formData = new FormData();
  formData.append('payment_method', data.payment_method);
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('product_group_name', data.product_group_name);
  formData.append('product_category_name', data.product_category_name);
  if (data.image) {
    formData.append('image', data.image);
  }
  formData.append('date', data.date);
  formData.append('name', data.name);
  formData.append('is_newly_purchased', data.is_newly_purchased);
  formData.append('reorder_level', data.reorder_level);
  formData.append('transaction_date', data.date);
  formData.append('sizes', JSON.stringify(data.sizes));

  const response = await axios.put(`${baseURL}/inventory/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  return response.data;
};

export const getSingleProduct = async (id: string) => {
  const response = await axiosInstance.get(`/inventory/${id}`);
  return response.data;
};

export const dispenseProduct = async (data: any) => {
  const response = await axiosInstance.post(
    `/inventory/student/dispense/`,
    data
  );
  return response.data;
};

export const restockProduct = async (id: string, data: any) => {
  const formData = new FormData();
  console.log({data});
  
  formData.append('payment_method', data.payment_method);
  formData.append('description', data.description);
  formData.append('amount', data.amount);
  formData.append('product_group_name', data.product_group_name);
  formData.append('product_category_name', data.product_category_name);
  formData.append('image', data.image);
  formData.append('date', data.date);
  formData.append(
    'restocking_same_unit_price',
    data.restocking_same_unit_price
  );
  formData.append('reorder_level', data.reorder_level);
  formData.append('transaction_date', data.date);
  formData.append('sizes', JSON.stringify(data.sizes));

  const response = await axios.put(
    `${baseURL}/inventory/restock/${id}/`,
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

export const discardProduct = async (id?: string) => {
  const response = await axiosInstance.delete(`/inventory/${id}/`, {
    action: 'DELETE',
  }as any);
  return response.data;
};

export const getProductHistory = async (id: string) => {
  const response = await axiosInstance.get(`/inventory/product/history/${id}`);
  return response.data;
};
export const downloadInventory = async () => {
  const response = await axiosInstance.get(`/inventory/inventory/pdf/1`);
  return response.data;
};
export const downloadHistoryInventory = async () => {
  const response = await axiosInstance.get(`/inventory/history/pdf/1`);
  return response.data;
};