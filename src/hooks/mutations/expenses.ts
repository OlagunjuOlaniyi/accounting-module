import { useMutation } from 'react-query';
import { IexpenseProps, IexpenseRes } from '../../types/expenseTypes';

import {
  addExpense,
  deleteExpense,
  updateExpense,
} from '../../services/expenseService';

//create new expense
export const useCreateExpense = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-expense'],
    mutationFn: (data: IexpenseProps) => addExpense(data),
  });
};

//update expense
export const useUpdateExpense = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['update-expense'],
    mutationFn: (data: IexpenseProps) => updateExpense(data),
  });
};

//delete expense
export const useDeleteExpense = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['delete-expense'],
    mutationFn: (id: string) => deleteExpense(id),
  });
};
