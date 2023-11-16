import { useMutation } from 'react-query';
import { PayrollEntry } from '../../types/payrollTypes';
import {
  createPayroll,
  remitAllowanceOrDeduction,
  runPayroll,
} from '../../services/payrollService';
import { RunPayrollData } from '../../types/types';

export const useCreatePayroll = () => {
  return useMutation<any, PayrollEntry, any>({
    mutationKey: ['create-payroll'],
    mutationFn: (data: PayrollEntry) => createPayroll(data),
  });
};

export const useRunPayroll = (id: string) => {
  return useMutation<any, RunPayrollData, any>({
    mutationKey: ['run-payroll'],
    mutationFn: (data: RunPayrollData) => runPayroll(id, data),
  });
};

export const useRemitAllowanceOrDeduction = (id: string) => {
  return useMutation<any, RunPayrollData, any>({
    mutationKey: ['remit-allowance-deduction'],
    mutationFn: (data: RunPayrollData) => remitAllowanceOrDeduction(id, data),
  });
};
