import { useQuery } from 'react-query';

import { ApiRes, IexpenseRes } from '../../types/expenseTypes';
import {
  getIncomeGroups,
  getIncomeTypes,
  getIncomes,
  getSingleIncome,
} from '../../services/incomeService';

//get incomes
export const useGetIncomes = () => {
  return useQuery<ApiRes>({
    queryKey: 'incomes',
    queryFn: () => getIncomes(),
  });
};

//get single income
export const useGetSingleIncome = (id?: string) => {
  return useQuery<ApiRes | any>({
    queryKey: `incomes-single-${id}`,
    queryFn: () => getSingleIncome(id),
  });
};

//get income types
export const useGetIncomeTypes = (id: string) => {
  return useQuery<ApiRes | any>({
    queryKey: `income-type-${id}`,
    queryFn: () => getIncomeTypes(id),
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
  });
};

//get income groups
export const useGetIncomeGroups = () => {
  return useQuery<ApiRes | any>({
    queryKey: `income-group`,
    queryFn: () => getIncomeGroups(),
  });
};
