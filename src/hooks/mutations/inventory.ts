import { useMutation } from 'react-query';
import {
  addProduct,
  discardProduct,
  dispenseProduct,
  editProduct,
  restockProduct,
} from '../../services/inventoryService';
import {
  getStaffPayslip,
  updateStaffPayslip,
} from '../../services/payrollService';

export const useAddProduct = () => {
  return useMutation<any, any, any>({
    mutationKey: ['add-product'],
    mutationFn: (data: any) => addProduct(data),
  });
};

export const useEditProduct = (id: string) => {
  return useMutation<any, any, any>({
    mutationKey: ['edit-product'],
    mutationFn: (data: any) => editProduct(data, id),
  });
};

export const useRestockProduct = (id: string) => {
  return useMutation<any, any, any>({
    mutationKey: ['restock-product'],
    mutationFn: (data: any) => restockProduct(id, data),
  });
};
export const useDispenseProduct = () => {
  return useMutation<any, any, any>({
    mutationKey: ['dispense-product'],
    mutationFn: (data: any) => dispenseProduct(data),
  });
};

export const useDiscardProduct = () => {
  return useMutation<any, any, any>({
    mutationKey: ['discard-product'],
    mutationFn: (id: string) => discardProduct(id),
  });
};

export const useGetStaffPayslip = (id: string) => {
  return useMutation<any, any, any>({
    mutationKey: ['get-staff-payslip'],
    mutationFn: (data: { staff: { name: string } }) =>
      getStaffPayslip(id, data),
  });
};

export const useUpdateStaffPayslip = (id: string) => {
  return useMutation<any, any, any>({
    mutationKey: ['update-staff-payslip'],
    mutationFn: (data: any) => updateStaffPayslip(id, data),
  });
};
