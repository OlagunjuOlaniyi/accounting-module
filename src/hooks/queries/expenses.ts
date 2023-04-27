import { useQuery } from 'react-query';
import { getExpenses, getSingleExpense } from '../../services/expenseService';
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
    queryKey: 'expenses-single',
    queryFn: () => getSingleExpense(id),
  });
};
