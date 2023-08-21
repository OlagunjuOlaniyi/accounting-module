import { RouteTypes } from './types/types';
import IncomeAndExpenseLayout from './pages/IncomeAndExpense/IncomeAndExpenseLayout';
import SingleExpense from './pages/IncomeAndExpense/SingleExpense';
import SingleIncome from './pages/IncomeAndExpense/SingleIncome';
import Login from './pages/Login/Login';
import Chart from './pages/ChartOfAccount/BalanceSheet';
import ChartofAccountLayout from './pages/ChartOfAccount/ChartofAccountLayout';
import BalanceSheet from './pages/ChartOfAccount/BalanceSheet';
import ProfitAndLossView from './pages/ChartOfAccount/ProfitAndLossView';
import Ledger from './pages/Ledger/Ledger';
import ProfitAndLossType from './pages/ChartOfAccount/ProfitAndLossType';
import AssetAndLiabilityLayout from './pages/AssetandLiability/AssetAndLiabilityLayout';

export const routes: RouteTypes[] = [
  {
    id: 1,
    path: '/income-and-expense',
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
  {
    id: 4,
    path: '/',
    component: Login,
  },
  {
    id: 5,
    path: '/chart-of-account',
    component: ChartofAccountLayout,
  },
  {
    id: 6,
    path: '/chart-of-account/view-profit-and-loss/:id',
    component: ProfitAndLossView,
  },
  {
    id: 8,
    path: '/chart-of-account/type-profit-and-loss/:id',
    component: ProfitAndLossType,
  },
  {
    id: 7,
    path: '/ledger',
    component: Ledger,
  },
  {
    id: 8,
    path: '/asset-and-liability',
    component: AssetAndLiabilityLayout,
  },
];
