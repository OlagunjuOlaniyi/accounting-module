import { useQuery } from 'react-query';

import { getStudents } from '../../services/studentService';
import { SchoolData } from '../../types/studentTypes';

//get expenses
export const useGetStudents = () => {
  return useQuery<SchoolData>({
    queryKey: 'students',
    queryFn: () => getStudents(),
  });
};
