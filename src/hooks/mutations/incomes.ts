import { useMutation } from 'react-query';
import { IexpenseProps, IexpenseRes } from '../../types/expenseTypes';
import {
  addIncome,
  deleteIncome,
  updateIncome,
} from '../../services/incomeService';

export const useCreateIncome = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-income'],
    mutationFn: (data: IexpenseProps) => addIncome(data),
  });
};

//deleteincome
export const useDeleteIncome = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['delete-income'],
    mutationFn: (id: string) => deleteIncome(id),
  });
};

//update income
export const useUpdateIncome = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['update-income'],
    mutationFn: (data: IexpenseProps) => updateIncome(data),
  });
};
