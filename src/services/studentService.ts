import axiosInstance from './utils';

//get classes
export const getStudents = async () => {
  const response = await axiosInstance.get(`/payments/payments/student`);
  return response.data;
};
