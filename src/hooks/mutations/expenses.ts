import { useMutation } from 'react-query';
import { IexpenseProps, IexpenseRes } from '../../types/expenseTypes';

import { addExpense } from '../../services/expenseService';

//create new expense
export const useCreateExpense = () => {
  return useMutation<IexpenseRes, IexpenseProps, any>({
    mutationKey: ['add-expense'],
    mutationFn: (data: IexpenseProps) => addExpense(data),
  });
};
