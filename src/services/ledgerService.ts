import axiosInstance from './utils';

//get Ledger
export const getLedgers = async () => {
  const response = await axiosInstance.get(`/ledgers/`);
  return response.data;
};
