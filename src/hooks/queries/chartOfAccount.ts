import { useQuery } from 'react-query';
import {
  getProfitAndLoss,
  getTrialBalance,
} from '../../services/chartOfAccountService';

//get expenses
export const useGetProfitAndLoss = () => {
  return useQuery<any>({
    queryKey: 'profit-and-loss',
    queryFn: () => getProfitAndLoss(),
  });
};

//get trial balance
export const useGetTrialBalance = () => {
  return useQuery<any>({
    queryKey: 'trial-balance',
    queryFn: () => getTrialBalance(),
  });
};
