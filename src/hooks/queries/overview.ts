import { useQuery } from 'react-query';
import {
  filterIncomeAndExpenseOverview,
  getIncomeAndExpenseOverview,
} from '../../services/overviewService';
import { Ioverview } from '../../types/types';

//get expenses
export const useGetIncomeAndExpenseOverview = () => {
  return useQuery<Ioverview>({
    queryKey: 'expenses',
    queryFn: () => getIncomeAndExpenseOverview(),
  });
};

//filter expenses
export const useFilterIncomeAndExpenseOverview = (
  start: string,
  end: string
) => {
  return useQuery<Ioverview>({
    queryKey: ['expenses', start, end],
    queryFn: () => filterIncomeAndExpenseOverview(start, end),
    refetchOnWindowFocus: false,
    enabled: false,
  });
};
