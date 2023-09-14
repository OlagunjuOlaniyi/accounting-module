import { useQuery } from "react-query";
import {
  getBills,
  getClasses,
  getSingleBill,
} from "../../services/billsServices";

//get classes
export const useGetClasses = () => {
  return useQuery<any>({
    queryKey: "classes",
    queryFn: () => getClasses(),
  });
};

//get bills
export const useGetBills = () => {
  return useQuery<any>({
    queryKey: "bills",
    queryFn: () => getBills(),
  });
};

//get single bill
export const useGetSingleBill = (id?: string) => {
  return useQuery<any>({
    queryKey: `bill-single-${id}`,
    queryFn: () => getSingleBill(id),
  });
};
