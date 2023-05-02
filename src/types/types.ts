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
