import { RouteTypes } from './types/types';
import IncomeAndExpenseLayout from './pages/IncomeAndExpense/IncomeAndExpenseLayout';

export const routes: RouteTypes[] = [
  {
    id: 1,
    path: '/',
    component: IncomeAndExpenseLayout,
  },
];
