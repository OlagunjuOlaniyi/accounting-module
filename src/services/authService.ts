import axios from 'axios';
import axiosInstance from './utils';
import { ILogin } from '../types/types';
import { baseURL } from './utils';

//add income
export const login = async (data: ILogin) => {
  const response = await axios.post(`${baseURL}/users/login/`, data);
  return response.data;
};

//get school
// let url = document.referrer
//   ? document.referrer.endsWith('/')
//     ? document.referrer.replace('https://', '').slice(0, -1)
//     : document.referrer.replace('https://', '')
//   : 'demo.edves.net';
let url = 'demo.edves.net';

export const fetchSchoolDetails = async () => {
  let res = await axiosInstance.get(
    `https://devapi2.edves.net/edves-basic/school-service/api/v1/schools/search?subdomain=${url}`
  );
  return res.data;
};
