import axios from 'axios';
import axiosInstance from './utils';
import { ILogin } from '../types/types';
import { baseURL } from './utils';

//add income
export const login = async (data: ILogin) => {
  const response = await axios.post(`${baseURL}/users/login/`, data);
  return response.data;
};
