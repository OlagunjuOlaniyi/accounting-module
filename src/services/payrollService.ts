import { PayrollEntry } from '../types/payrollTypes';
import { RunPayrollData } from '../types/types';
import axiosInstance from './utils';

export const createPayroll = async (data: PayrollEntry) => {
  const response = await axiosInstance.post(`/payroll/`, data);
  return response.data;
};

export const getPayroll = async () => {
  const response = await axiosInstance.get(`/payroll/`);
  return response.data;
};

export const runPayroll = async (id: string, data: RunPayrollData) => {
  const response = await axiosInstance.post(`/payroll/run_payroll/${id}`, data);
  return response.data;
};

export const remitAllowanceOrDeduction = async (
  id: string,
  data: RunPayrollData
) => {
  const response = await axiosInstance.post(
    `/payroll/remit_allowance_or_deduction/${id}`,
    data
  );
  return response.data;
};

export const listStaffAllowanceandDeduction = async (
  id: string,
  modifier_type: string
) => {
  const response = await axiosInstance.get(
    `/payroll/list_staffs_allowance_or_deduction/${id}?modifier_type=${modifier_type}`
  );
  return response.data;
};

export const getStaffPayslip = async (
  id: string,
  data: { staff: { name: string } }
) => {
  const response = await axiosInstance.post(
    `/payroll/staff_payslip/${id}`,
    data
  );
  return response.data;
};
