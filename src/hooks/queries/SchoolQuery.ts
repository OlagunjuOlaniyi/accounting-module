import { useQuery } from "react-query";
import { fetchSchoolDetails, fetchStaffDetails } from "../../services/authService";

//get school Detail
export const useGetSchoolDetails = () => {
  return useQuery<any>({
    queryKey: "school",
    queryFn: () => fetchSchoolDetails(),
  });
};

//get staff Detail
export const useStaffDetails = () => {
  return useQuery<any>({
    queryKey: "staff",
    queryFn: () => fetchStaffDetails(),
  });
};
