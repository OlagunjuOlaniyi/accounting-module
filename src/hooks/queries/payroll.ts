import { useQuery } from 'react-query';
import {
  AllowanceOrDeduction,
  PayrollResponse,
} from '../../types/payrollTypes';
import {
  getPayroll,
  listStaffAllowanceandDeduction,
} from '../../services/payrollService';

export const useGetPayroll = () => {
  return useQuery<PayrollResponse>({
    queryKey: 'products',
    queryFn: () => getPayroll(),
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
