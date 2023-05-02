import axios from 'axios';

export const baseURL = `https://ahmed0111.pythonanywhere.com/api/v1/`;

type Iprops = {
  Authorization: string;
};

let headers: any = {
  Authorization: '',
};

if (localStorage.token) {
  headers.Authorization = `Bearer ${localStorage.token}`;
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers,
});

axiosInstance.interceptors.response.use(
  (response: any) =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),
  (error: any) => {
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 401) {
      if (error.response.data.message === 'Invalid login credentials') {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      } else {
        window.location.replace('/login');
        localStorage.clear();
      }
    } else if (error.response.status === 502) {
      console.log('error');
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  }
);

export default axiosInstance;
