import { useQuery } from 'react-query';
import { getExpenses } from '../../services/expenseService';
import { IexpenseRes } from '../../types/expenseTypes';

//get billing cycles
export const useGetExpenses = () => {
  return useQuery<IexpenseRes>({
    queryKey: 'expenses',
    queryFn: () => getExpenses(),
  });
};
