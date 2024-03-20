import { useMutation } from 'react-query';
import { Fee } from '../../types/types';
import {
  IPaymentBroadsheetData,
  IPaymentStatusOnBill,
  createBill,
  deleteBill,
  duplicateBill,
  getPaymentBroadSheet,
  getPaymentStatusOnBill,
  recordPayment,
  sendBill,
  sendReminder,
  unSendBill,
  updateBill,
  waiveBill,
  viewStudentTransactions,
} from '../../services/billsServices';
import { IStudentPayment } from '../../types/billTypes';

export const useCreateBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['add-bill'],
    mutationFn: (data: Fee) => createBill(data),
  });
};

export const useDuplicateBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['duplicate-bill'],
    mutationFn: (id: string) => duplicateBill(id),
  });
};

export const useSendBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['send-bill'],
    mutationFn: (id: string) => sendBill(id),
  });
};

export const useUnsendBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['unsend-bill'],
    mutationFn: (id: string) => unSendBill(id),
  });
};

export const useDeleteBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['delete-bill'],
    mutationFn: (id: string) => deleteBill(id),
  });
};

export const useUpdateBill = (id: string) => {
  return useMutation<any, Fee, any>({
    mutationKey: ['update-bill'],
    mutationFn: (data: Fee) => updateBill(id, data),
  });
};

export const useWaiveBill = (id: any) => {
  return useMutation<any, Fee, any>({
    mutationKey: ['waive-bill'],
    mutationFn: (data: any) => waiveBill(id, data),
  });
};

export const useGetPaymentStatusOnBill = () => {
  return useMutation<any, any, any>({
    mutationKey: ['get-payment-status-on-bill'],
    mutationFn: (data: IPaymentStatusOnBill) => getPaymentStatusOnBill(data),
  });
};

export const useGetPaymentBroadsheet = () => {
  return useMutation<any, any, any>({
    mutationKey: ['get-payment-broadshet'],
    mutationFn: (data: IPaymentBroadsheetData) => getPaymentBroadSheet(data),
  });
};

export const useViewStudentTransactions = () => {
  return useMutation<any, any, any>({
    mutationKey: ['view-student-transaction'],
    mutationFn: (data: { admission_number: any }) =>
      viewStudentTransactions(data),
  });
};

export const useRecordPayment = () => {
  return useMutation<any, IStudentPayment, any>({
    mutationKey: ['record-payment'],
    mutationFn: (data: { payments: IStudentPayment[] }) => recordPayment(data),
  });
};

export const useSendReminder = (id: string) => {
  return useMutation<any, any, any>({
    mutationKey: ['send-reminddr'],
    mutationFn: (data: any) => sendReminder(data, id),
  });
};


