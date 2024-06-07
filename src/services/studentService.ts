import axiosInstance from './utils';

//get classes
// export const getStudents = async () => {
//   const response = await axiosInstance.get(`/payments/payments/student/`);
//   return response.data;
// };

export const getStudents = async (term: any, year: any) => {
  
  const response = await axiosInstance.post(`/payments/payments/student/?term=${term}&year=${year}`);
  return response.data;
};
