import axios from 'axios';
import { Fee } from '../types/types';
import axiosInstance, { baseURL } from './utils';
import { IStudentPayment } from '../types/billTypes';

//get classes
export const getClasses = async () => {
  const response = await axiosInstance.get(`/payments/payments/classes`);
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

export const getFeeTypes = async () => {
  const response = await axiosInstance.get(`/payments/payments/feetypes`);
  return response.data;
};

export const getTerm = async () => {
  const response = await axiosInstance.get(`/payments/payments/term`);
  return response.data;
};

//get single bill
export const getSingleBill = async (id?: string) => {
  const response = await axiosInstance.get(`/payments/payments/bills/${id}/`);
  return response.data;
};

//get student bill
export const getStudentBill = async (id: string) => {
  const formData = new FormData();
  formData.append('bill_id', id);
  const response = await axiosInstance.get(`/payments/payments/bills/${id}/`);
  return response.data;
};

export const duplicateBill = async (id: string) => {
  const response = await axiosInstance.post(
    `/payments/payments/bills/${id}/duplicate/`
  );
  return response.data;
};

export const sendBill = async (id: string) => {
  const response = await axiosInstance.post(
    `/payments/payments/bills/${id}/send_bills/`
  );
  return response.data;
};

export const unSendBill = async (id: string) => {
  const response = await axiosInstance.post(
    `/payments/payments/bills/${id}/unsend_bills/`
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

export const waiveBill = async (id: any, data: any) => {
  const response = await axiosInstance.post(
    `/payments/payments/bills/${id}/waive_bill/`,
    data
  );
  return response.data;
};

export const deactivateWallet = async ( data: any) => {
  const response = await axiosInstance.post(
    `/payments/payments/wallet_deactivate/`,
    data
  );
  return response.data;
};
export const deleteStudentBill = async ( data: any) => {
  let dataToSend = {student_payment_id: data.student_payment_id}
  const response = await axiosInstance.post(
    `/payments/payments/bills/${data.id}/delete_student_bill/`,
    dataToSend
  );
  return response.data;
};

export const getClassPaymentStatus = async (id: string) => {
  const response = await axiosInstance.get(`/payments/classpayments/${id}/`);
  return response.data;
};

export const getParentWallet = async () => {
  const response = await axiosInstance.get(`/payments/payments/parentwallet/`);
  return response.data;
};

export const getSingleParentWallet = async (id: string) => {
  const response = await axiosInstance.get(`/payments/payments/parentwallet/${id}/`);
  return response.data;
};

export const getStudentTransacton = async () => {
  const response = await axiosInstance.get(`/payments/payments/transactions_sch/`);
  return response.data;
};

export type IPaymentStatusOnBill = {
  bill_id: string;
  payment_status: string;
  class: string
};

export const getPaymentStatusOnBill = async (data: IPaymentStatusOnBill) => {
  const formData = new FormData();
  formData.append('bill_id', data.bill_id);
  formData.append('payment_status', data.payment_status);
  formData.append('class', data.class);

  const response = await axios.post(
    `${baseURL}/payments/payments/studentpaymentstatus/`,
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

export type IPaymentBroadsheetData = {
  bill_id: string;
  class: string;
};
export const getPaymentBroadSheet = async (data: IPaymentBroadsheetData) => {
  const formData = new FormData();
  formData.append('bill_id', data.bill_id);
  formData.append('class', data.class);

  const response = await axios.post(
    `${baseURL}/payments/payments/classbroadsheet/`,
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

export const getStudentBills = async (id: any) => {
  const formData = new FormData();
  formData.append('idx', id);
  
  const response = await axiosInstance.get(`/payments/student_bills/${id}/`);
  return response.data;
};

export const recordPayment = async (data: { payments: IStudentPayment[] }) => {
  const response = await axiosInstance.post(`/payments/payments/recordpayment/`, data);
  return response.data;
};

export const viewStudentTransactions = async (data: {
  admission_number: any; bill_id: any
}) => {
  const formData = new FormData();
  formData.append('admission_number', data.admission_number);
  formData.append('bill_id', data.bill_id);

  const response = await axios.post(
    `${baseURL}/payments/payments/parent_history/`,
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

export const sendReminder = async (data: any, id: string) => {
  const response = await axiosInstance.post(
    `/payments/payments/bills/${id}/send_bills/`,
    data
  );
  return response.data;
};

export const sendStudentReminder = async (id: string) => {
  const response = await axiosInstance.post(
    `/payments/send_student_invoice/${id}`
  );
  return response.data;
};

export const downloadClassBroadsheet = async (data: any) => {
  const response = await axiosInstance.get(`/payments/payments/class-payment/`, data);
  return response.data;
};

export const fetchStudentBill = async (admNum: any, idxValue: any) => {
  const url = `${baseURL}/payments/student_bills/${admNum}/`;
   const formData = new FormData();
  formData.append('idx', idxValue);

  try {
    const response = await axios.post(url, formData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch student bill');
  }
};

export const fetchParentHistory = async (admNum: any, billId: any) => {
  const url = `${baseURL}/payments/payments/parent_history/`;
   const formData = new FormData();
  formData.append('admission_number', admNum);
  formData.append('bill_id', billId);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch parent history');
  }
};

export const fundWallet = async (data: any) => {
  const response = await axiosInstance.post(
    `/payments/payments/manual_wallet_funding/?wallet_id=${data.wallet_id}&amount=${data.amount}&payment_method=${data.payment_method}`,
  );
  return response.data;
};