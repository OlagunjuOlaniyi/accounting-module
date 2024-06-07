import { useQuery, useMutation } from 'react-query';
import {
  getBills,
  getClassPaymentStatus,
  getClasses,
  getFeeTypes,
  getParentWallet,
  getSingleBill,
  getStudentBills,
  getTerm,
  fundWallet,
  getSingleParentWallet,
  getStudentTransacton,
  fetchParentHistory
} from '../../services/billsServices';

export const useGetClasses = () => {
  return useQuery<any>({
    queryKey: 'classes',
    queryFn: () => getClasses(),
  });
};

export const useGetBills = () => {
  return useQuery<any>({
    queryKey: 'bills',
    queryFn: () => getBills(),
  });
};


export const useGetFeeTypes = () => {
  return useQuery<any>({
    queryKey: 'fee-types',
    queryFn: () => getFeeTypes(),
  });
};

export const useGetTerm = () => {
  return useQuery<any>({
    queryKey: 'term',
    queryFn: () => getTerm(),
  });
};

export const useGetSingleBill = (id?: string) => {
  return useQuery<any>({
    queryKey: `bill-single-${id}`,
    queryFn: () => getSingleBill(id),
  });
};

export const useGetClassPaymentStatus = (id: string) => {
  return useQuery<any>({
    queryKey: `class-payment-status-${id}`,
    queryFn: () => getClassPaymentStatus(id),
  });
};
export const useGetParentWallet = () => {
  return useQuery<any>({
    queryKey: `parent-wallet`,
    queryFn: () => getParentWallet(),
  });
};

export const useSingleParentWallet = (id: string) => {
  return useQuery<any>({
    queryKey: `parent-wallet-${id}`,
    queryFn: () => getSingleParentWallet(id),
  });
};

export const useStudentsTransaction = () => {
  return useQuery<any>({
    queryKey: `student-transaction`,
    queryFn: () => getStudentTransacton(),
  });
};

export const useGetStudentsBills = (id: string) => {
  return useQuery<any>({
    queryKey: `students-bills-${id}`,
    queryFn: () => getStudentBills(id),
  });
};

export const useGetParentHistory = (admission_number: any, bill_id: any) => {
  return useQuery<any>({
    queryKey: `parent-history`,
    queryFn: () => fetchParentHistory(admission_number, bill_id),
  });
};

export const useFundWallet = () => {
  return useMutation<any, any, any>({
    mutationKey: ['fund-wallet'],
    mutationFn: (data: any) => fundWallet(data),
  });
};
