import { RouteTypes } from './types/types';
import IncomeAndExpenseLayout from './pages/IncomeAndExpense/IncomeAndExpenseLayout';
import SingleExpense from './pages/IncomeAndExpense/SingleExpense';
import SingleIncome from './pages/IncomeAndExpense/SingleIncome';
import Login from './pages/Login/Login';
import ChartofAccountLayout from './pages/ChartOfAccount/ChartofAccountLayout';
import ProfitAndLossView from './pages/ChartOfAccount/ProfitAndLossView';
import Ledger from './pages/Ledger/Ledger';
import ProfitAndLossType from './pages/ChartOfAccount/ProfitAndLossType';
import AssetAndLiabilityLayout from './pages/AssetandLiability/AssetAndLiabilityLayout';
import ViewBalanceSheet from './pages/ChartOfAccount/ViewBalanceSheet';
import BalanceSheetType from './pages/ChartOfAccount/BalanceSheetType';
import BillsandFeesLayout from './pages/BillsandFees/BillsandFeesLayout';
import CreateBill from './pages/BillsandFees/CreateBill';
import SingleBill from './pages/BillsandFees/SingleBill';
import UpdateBill from './pages/BillsandFees/UpdateBill';
import PaymentStatus from './pages/BillsandFees/PaymentStatus';
import BankLayout from './pages/Bank/BankLayout';
import InventoryLayout from './pages/Inventory/InventoryLayout';
import SingleProduct from './pages/Inventory/SingleProduct';
import ProductHistory from './pages/Inventory/ProductHistory';
import PayrollLayout from './pages/Payroll/PayrollLayout';
import CreatePayroll from './pages/Payroll/CreatePayroll';
import SinglePayroll from './pages/Payroll/SinglePayroll';
import ViewStaffPayslip from './pages/Payroll/ViewStaffPayslip';
import ViewAsset from './pages/AssetandLiability/ViewAsset';
import AssetType from './pages/AssetandLiability/AssetType';
import ClassPaymentStatus from './pages/BillsandFees/ClassPaymentStatus';
import PaymentBroadsheet from './pages/BillsandFees/PaymentBroadsheet';
import RecordPayment from './pages/BillsandFees/RecordPayment';
import StudentTransactions from './pages/BillsandFees/StudentTransactions';
import StudentBill from './pages/BillsandFees/StudentBill';
import Wallet from './pages/BillsandFees/Wallet';
import ParentWallet from './pages/BillsandFees/ParentWallet';
import Transaction from './pages/BillsandFees/Transaction';

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

  {
    id: 9,
    path: '/chart-of-account/view-balance-sheet/:id',
    component: ViewBalanceSheet,
  },
  {
    id: 10,
    path: '/chart-of-account/type-balance-sheet/:id',
    component: BalanceSheetType,
  },
  {
    id: 11,
    path: '/bills-fees-management',
    component: BillsandFeesLayout,
  },
  {
    id: 12,
    path: '/createBill',
    component: CreateBill,
  },
  {
    id: 13,
    path: '/bill/:id',
    component: SingleBill,
  },
  {
    id: 13,
    path: '/update-bill/:id',
    component: UpdateBill,
  },
  {
    id: 14,
    path: '/payment-status/:id',
    component: PaymentStatus,
  },
  {
    id: 15,
    path: '/banks',
    component: BankLayout,
  },
  {
    id: 16,
    path: '/inventory',
    component: InventoryLayout,
  },
  {
    id: 16,
    path: '/inventory/:id',
    component: SingleProduct,
  },
  {
    id: 17,
    path: '/payroll',
    component: PayrollLayout,
  },
  {
    id: 18,
    path: '/create-payroll',
    component: CreatePayroll,
  },
  {
    id: 19,
    path: '/inventory/history/:id',
    component: ProductHistory,
  },
  {
    id: 20,
    path: '/payroll/:id',
    component: SinglePayroll,
  },
  {
    id: 21,
    path: '/payroll/payslip/:id',
    component: ViewStaffPayslip,
  },

  {
    id: 22,
    path: '/asset-and-liability/view-asset/:id',
    component: ViewAsset,
  },
  {
    id: 23,
    path: '/asset-and-liability/type-asset/:id',
    component: AssetType,
  },
  {
    id: 24,
    path: '/class-payment-status/:id',
    component: ClassPaymentStatus,
  },
  {
    id: 25,
    path: '/payment-broadsheet/:id',
    component: PaymentBroadsheet,
  },
  {
    id: 26,
    path: '/record-payment/:id',
    component: RecordPayment,
  },  
  {
    id: 27,
    path: '/student-transactions/:id',
    component: StudentTransactions,
  },
  {
    id: 26,
    path: '/student-bill/:id',
    component: StudentBill,
  },
  {
    id: 27,
    path: '/wallet',
    component: Wallet,
  },
  {
    id: 28,
    path: '/parent-wallet/:id',
    component: ParentWallet,
  },
  {
    id: 29,
    path: '/student-transaction',
    component: Transaction,
  },
];
