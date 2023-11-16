import { useMutation } from 'react-query';
import { IexpenseProps, IexpenseRes } from '../../types/expenseTypes';

import {
  createAsset,
  createEquity,
  createLiability,
  deleteAsset,
  recordBankDeposit,
  recordBankTransfer,
  recordCashDeposit,
  recordCashWithdrawal,
} from '../../services/chartOfAccountService';

//create new asset
export const useCreateAsset = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-asset'],
    mutationFn: (data: IexpenseProps) => createAsset(data),
  });
};

export const useDeleteAsset = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['delete-asset'],
    mutationFn: (id: string) => deleteAsset(id),
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

export const useRecordBankTransfer = () => {
  return useMutation<any, any, any>({
    mutationKey: ['record-bank-transfer'],
    mutationFn: (data: any) => recordBankTransfer(data),
  });
};

export const useRecordCashDeposit = () => {
  return useMutation<any, any, any>({
    mutationKey: ['record-cash-deposit'],
    mutationFn: (data: any) => recordCashDeposit(data),
  });
};

export const useRecordBankDeposit = () => {
  return useMutation<any, any, any>({
    mutationKey: ['record-bank-deposit'],
    mutationFn: (data: any) => recordBankDeposit(data),
  });
};

export const useRecordCashWithdrawal = () => {
  return useMutation<any, any, any>({
    mutationKey: ['record-cash-withdrawal'],
    mutationFn: (data: any) => recordCashWithdrawal(data),
  });
};
