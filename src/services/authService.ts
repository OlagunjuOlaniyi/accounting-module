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
let url =
  window.location != window.parent.location
    ? document.referrer.endsWith('/')
      ? document.referrer.replace('https://', '').slice(0, -1)
      : document.referrer.replace('https://', '')
    : 'demo.edves.net';

export const fetchSchoolDetails = async () => {
  let res = await axiosInstance.get(
    `https://devapi2.edves.net/edves-basic/school-service/api/v1/schools/search?subdomain=${url}`
    // `https://devapi2.edves.net/edves-basic/school-service/api/v1/schools/search?subdomain=demo.edves.net`
  );
  return res.data;
};



// get staff
export const fetchStaffDetails = async () => {
  let res = await axiosInstance.get(
    `https://edves.cloud/api/v1/payments/payments/staff`
  );
  return res.data;
};
