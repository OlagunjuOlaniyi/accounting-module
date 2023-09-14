import { useQuery } from "react-query";
import { fetchSchoolDetails } from "../../services/authService";

//get school Detail
export const useGetSchoolDetails = () => {
  return useQuery<any>({
    queryKey: "school",
    queryFn: () => fetchSchoolDetails(),
  });
};
