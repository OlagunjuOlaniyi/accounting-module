import { useState, useEffect } from 'react';
import Button from '../../components/Button/Button';
import './login.scss';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { fetchSchoolDetails } from '../../services/authService';

import TextInput from '../../components/Input/TextInput';
import { useLogin } from '../../hooks/mutations/auth';

type schoolDetails = {
  idx: number;
  subdomain: string;
};
const Login = () => {
  const navigate = useNavigate();
  const [schoolDetails, setSchoolDetails] = useState<schoolDetails[]>([]);

  // //get school details
  // const getSchoolDetails = async () => {
  //   try {
  //     let res = await fetchSchoolDetails();
  //     setSchoolDetails(res.data);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const { mutate, isLoading } = useLogin();
  const [state, setState] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleBlur = (evt: any) => {
    const value = evt.target.value;
    if (!value) {
      setErrors({
        ...errors,
        [evt.target.name]: `Field cannot be empty`,
      });
    } else {
      setErrors({
        ...errors,
        [evt.target.name]: ``,
      });
    }
  };

  //submit form
  const submit = async () => {
    let response = await fetchSchoolDetails();

    let dataToSend = {
      name: 'demo',
      password: 'edves_account_111',
      idx: response?.data[0]?.idx,
      school_url: response?.data[0]?.subdomain,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        //toast.success('Login successful');
        localStorage.setItem('userDetails', JSON.stringify(res?.data));
        localStorage.setItem('token', res?.data?.tokens?.access);
        window.location.replace('/income-and-expense');
      },

      onError: (e) => {
        console.log(e);
        //toast.error('Invalid credentials');
      },
    });
  };

  useEffect(() => {
    submit();
  }, []);

  return <div className='login'></div>;
};

export default Login;
