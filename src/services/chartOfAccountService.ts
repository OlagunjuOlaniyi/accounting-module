import axiosInstance from './utils';

//get profit and loss
export const getProfitAndLoss = async () => {
  const response = await axiosInstance.get(`/incomes/profitloss`);
  return response.data;
};

//get trial balance
export const getTrialBalance = async () => {
  const response = await axiosInstance.get(`/incomes/trialbalance`);
  return response.data;
};
