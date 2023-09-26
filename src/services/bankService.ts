import axiosInstance from './utils';

export const getBankList = async () => {
  const response = await axiosInstance.get(`/assets/bank/creation`);
  return response.data;
};

export const getBanks = async () => {
  const response = await axiosInstance.get(`/assets/banks`);
  return response.data;
};

export const addBank = async (data: any) => {
  const response = await axiosInstance.post(`/assets/bank/creation/`, data);
  return response.data;
};

export const deleteBank = async (id: string) => {
  const response = await axiosInstance.delete(`/assets/bank/creation/${id}`);
  return response.data;
};
