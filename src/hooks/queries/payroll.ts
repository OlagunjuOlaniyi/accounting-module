import { useQuery } from 'react-query';
import {
  AllowanceOrDeduction,
  PayrollResponse,
} from '../../types/payrollTypes';
import {
  getPayroll,
  getPayrollOverview,
  listStaffAllowanceandDeduction,
} from '../../services/payrollService';

export const useGetPayroll = () => {
  return useQuery<PayrollResponse[]>({
    queryKey: `payroll`,
    queryFn: () => getPayroll(),
  });
};

export const useGetPayrollOverview = (id: string) => {
  return useQuery<PayrollResponse>({
    queryKey: `payroll-${id}`,
    queryFn: () => getPayrollOverview(id),
  });
};

export const useListStaffAllowanceAndDeductions = (
  id: string,
  modifier_type: string
) => {
  return useQuery<AllowanceOrDeduction>({
    queryKey: `allowance-and-deductions-${id}-${modifier_type}`,
    queryFn: () => listStaffAllowanceandDeduction(id, modifier_type),
  });
};
