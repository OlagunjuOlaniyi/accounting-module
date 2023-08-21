import { useMutation } from 'react-query';
import { IexpenseProps, IexpenseRes } from '../../types/expenseTypes';

import {
  createAsset,
  createEquity,
  createLiability,
} from '../../services/chartOfAccountService';

//create new asset
export const useCreateAsset = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-asset'],
    mutationFn: (data: IexpenseProps) => createAsset(data),
  });
};

//create new liability
export const useCreateLiability = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-liability'],
    mutationFn: (data: IexpenseProps) => createLiability(data),
  });
};

//create new equity
export const useCreateEquity = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-equity'],
    mutationFn: (data: IexpenseProps) => createEquity(data),
  });
};
