import { RouteTypes } from './types/types';
import IncomeAndExpenseLayout from './pages/IncomeAndExpense/IncomeAndExpenseLayout';
import SingleExpense from './pages/IncomeAndExpense/SingleExpense';
import SingleIncome from './pages/IncomeAndExpense/SingleIncome';

export const routes: RouteTypes[] = [
  {
    id: 1,
    path: '/',
    component: IncomeAndExpenseLayout,
  },
  {
    id: 2,
    path: '/expense/:id',
    component: SingleExpense,
  },
  {
    id: 3,
    path: '/income/:id',
    component: SingleIncome,
  },
];
