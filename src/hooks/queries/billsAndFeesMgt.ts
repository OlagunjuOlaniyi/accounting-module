import { useQuery } from 'react-query';
import {
  getBills,
  getClassPaymentStatus,
  getClasses,
  getFeeTypes,
  getSingleBill,
  getStudentBills,
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

export const useGetStudentsBills = (id: string) => {
  return useQuery<any>({
    queryKey: `students-bills-${id}`,
    queryFn: () => getStudentBills(id),
  });
};
