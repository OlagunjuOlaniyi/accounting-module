import { useQuery } from 'react-query';
import { getLedgers } from '../../services/ledgerService';

//get ledgers
export const useGetLedgers = () => {
  return useQuery<any>({
    queryKey: 'ledgers',
    queryFn: () => getLedgers(),
  });
};
