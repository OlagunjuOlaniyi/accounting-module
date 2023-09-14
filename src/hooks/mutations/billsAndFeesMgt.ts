import { useMutation } from 'react-query';
import { Fee } from '../../types/types';
import {
  createBill,
  deleteBill,
  duplicateBill,
  updateBill,
} from '../../services/billsServices';

//create new expense
export const useCreateBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['add-bill'],
    mutationFn: (data: Fee) => createBill(data),
  });
};

export const useDuplicateBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['duplicate-bill'],
    mutationFn: (id: string) => duplicateBill(id),
  });
};

export const useDeleteBill = () => {
  return useMutation<any, Fee, any>({
    mutationKey: ['delete-bill'],
    mutationFn: (id: string) => deleteBill(id),
  });
};

export const useUpdateBill = (id: string) => {
  return useMutation<any, Fee, any>({
    mutationKey: ['update-bill'],
    mutationFn: (data: Fee) => updateBill(id, data),
  });
};
