import { ApiRes, IexpenseRes } from './expenseTypes';

//routes types
export interface RouteTypes {
  id: number;
  path: string;
  component: React.FunctionComponent;
}

//modal types
export interface Imodal {
  modalIsOpen: boolean;
  closeModal: any;
  name?: string;
  sizes?: any;
}

export interface IeditModal extends Imodal {
  selectedId?: string;
}

export interface IDashboardCard {
  year: string;
  month: string;
  total: number;
}
export interface Ioverview {
  expense_by_month: IDashboardCard[];
  income_by_month: IDashboardCard[];
  expenses: IexpenseRes[];
  incomes: IexpenseRes[];
  profit: number;
  status: number;
  total_expense: number;
  total_income: number;
}

//auth type
export interface ILogin {
  email: string;
  pasword: string;
}

export interface ILoginRes {
  data: {
    name: string;
    email: string;
    tokens: {
      refresh: string;
      access: string;
    };
  };
}

export interface FeeType {
  name: string;
  description: string;
  default_amount: number;
  classes: number[];
  students: number[];
  discounts: Discount[];
}

export interface Discount {
  value: number;
  description: string;
  is_percentage: boolean;
  students: number[];
  classes: number[];
}

export interface Fee {
  fee_type: FeeType;
  amount: number;
  mandatory: boolean;
}

export interface PayrollData {
  staffs: { name: string }[];
  net_amount: number; // This should be automatically calculated
  gross_amount: number;
  payroll_group_modifiers: PayrollGroupModifier[];
}

export interface PayrollGroupModifier {
  id?: number;
  modifier_name: string;
  modifier_type: string;
  is_percentage: boolean;
  amount?: number; // Present if is_percentage is false
  linking_percentage?: 'BASIC' | 'NET_AMOUNT' | ''; // Customize based on your requirements
  percentage?: number; // Present if is_percentage is true
}

export interface RunPayrollData {
  staffs: { name: string }[];
  type: ('ALL ALLOWANCE' | 'ALL DEDUCTION')[];
  transactions_date: string;
  payment_method: string;
}
