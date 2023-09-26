import { useMutation } from 'react-query';
import { addBank, deleteBank } from '../../services/bankService';

export const useAddBank = () => {
  return useMutation<any, any, any>({
    mutationKey: ['add-bank'],
    mutationFn: (data: any) => addBank(data),
  });
};

export const useDeleteBank = () => {
  return useMutation<any, any, any>({
    mutationKey: ['delete-bank'],
    mutationFn: (id: string) => deleteBank(id),
  });
};
