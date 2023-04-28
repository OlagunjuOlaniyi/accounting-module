import axios from 'axios';

export const baseURL = `https://ahmed0111.pythonanywhere.com/api/v1/`;

type Iprops = {
  Authorization: string;
};

let headers: any = {
  Authorization: '',
};

export const urlToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgzMDczOTg3LCJpYXQiOjE2ODI2NDE5ODcsImp0aSI6IjY2ODI1MDdmZmE4NDQyYjRhMjM1MWQ3ZWRjZjFhNzUwIiwidXNlcl9pZCI6MX0.W5vpi4V3olVan1HaiYbRrdxqqW6vowtvehDXK1zbZ8U';

if (localStorage.token) {
  headers.Authorization = `Bearer ${localStorage.token}`;
} else {
  headers.Authorization = `Bearer ${urlToken}`;
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
        window.location.replace('/');
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
