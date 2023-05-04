import axiosInstance from './utils';

//get expenses
export const getIncomeAndExpenseOverview = async () => {
  const response = await axiosInstance.get(`/incomes/overview`);
  return response.data;
};

//filter expenses by date
export const filterIncomeAndExpenseOverview = async (
  start: string,
  end: string
) => {
  const response = await axiosInstance.get(
    `/incomes/overview?start=${start}&end=${end}`
  );
  return response.data;
};

//search
export const search = async (keyword: string) => {
  const response = await axiosInstance.get(`/stats/search?keyword=${keyword}`);
  return response.data;
};
