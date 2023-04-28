import { useQuery } from 'react-query';

import { ApiRes, IexpenseRes } from '../../types/expenseTypes';
import { getIncomes, getSingleIncome } from '../../services/incomeService';

//get expenses
export const useGetIncomes = () => {
  return useQuery<ApiRes>({
    queryKey: 'incomes',
    queryFn: () => getIncomes(),
  });
};

//get single expense
export const useGetSingleIncome = (id?: string) => {
  return useQuery<ApiRes | any>({
    queryKey: `incomes-single-${id}`,
    queryFn: () => getSingleIncome(id),
  });
};
