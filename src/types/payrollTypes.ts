interface PayrollModifier {
  modifier_name: string;
  modifier_type: 'ALLOWANCE' | 'DEDUCTION';
  is_percentage: boolean;
  amount?: number;
  linking_percentage?: 'BASIC' | 'NET_AMOUNT' | string;
  percentage?: number;
}

interface PayrollGroup {
  staffs: { name: string }[];
  net_amount: number;
  gross_amount: number;
  payroll_group_modifiers: PayrollModifier[];
}

export interface PayrollEntry {
  name: string;
  due_date: string;
  payroll_groups: PayrollGroup[];
}

interface PayrollStaffGroupModifier {
  id: string;
  name: string;
  type: 'ALLOWANCE' | 'DEDUCTION';
  linking_percentage: '' | 'BASIC' | 'NET_AMOUNT' | string;
  is_percentage: boolean;
  percentage: string;
  amount: string;
  created_at: string;
  updated_at: string;
  owner: number;
  staff_group: string;
}

interface PayrollStaff {
  name: string;
}

interface PayrollStaffGroup {
  id: string;
  payroll_staff_group_modifiers: PayrollStaffGroupModifier[];
  staffs: PayrollStaff[];
  net_amount: string;
  gross_amount: string;
  created_at: string;
  updated_at: string;
  owner: number;
}

interface TotalAmount {
  total: number;
  status: string;
}

export interface PayrollResponse {
  id: string;
  payroll_staff_groups: PayrollStaffGroup[];
  total_allowance: TotalAmount;
  total_deduction: TotalAmount;
  total_gross_amount: number;
  total_net_amount: number;
  set_status: number;
  name: string;
  due_date: string;
  created_at: string;
  payment_status: string;
  updated_at: string;
  owner: number;
}

interface Detail {
  id: string;
  name: string;
  amount: string;
  status: string;
}

export interface AllowanceOrDeduction {
  name: string;
  details: Detail[];
  status: string;
}
