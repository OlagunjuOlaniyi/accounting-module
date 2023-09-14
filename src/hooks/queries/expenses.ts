import { useQuery } from 'react-query';
import {
  getExpenseGroups,
  getExpenseTypes,
  getExpenses,
  getSingleExpense,
} from '../../services/expenseService';
import { ApiRes, IexpenseRes } from '../../types/expenseTypes';

//get expenses
export const useGetExpenses = () => {
  return useQuery<ApiRes>({
    queryKey: 'expenses',
    queryFn: () => getExpenses(),
  });
};

//get single expense
export const useGetSingleExpenses = (id?: string) => {
  return useQuery<ApiRes | any>({
    queryKey: `expenses-single-${id}`,
    queryFn: () => getSingleExpense(id),
  });
};

//get expense types
export const useGetExpenseTypes = (id: string) => {
  return useQuery<ApiRes | any>({
    queryKey: `expenses-type`,
    queryFn: () => getExpenseTypes(),
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
  });
};

//get expense groups
export const useGetExpenseGroups = () => {
  return useQuery<ApiRes | any>({
    queryKey: `expenses-group`,
    queryFn: () => getExpenseGroups(),
  });
};
