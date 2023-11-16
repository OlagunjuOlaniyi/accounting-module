import { useQuery } from 'react-query';
import { getBankList, getBanks } from '../../services/bankService';

export const useGetBankList = () => {
  return useQuery<any>({
    queryKey: 'list-of-banks',
    queryFn: () => getBankList(),
  });
};

export const useGetBanks = () => {
  return useQuery<any>({
    queryKey: 'banks',
    queryFn: () => getBanks(),
  });
};
