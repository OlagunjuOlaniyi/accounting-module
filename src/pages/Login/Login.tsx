import { useState } from 'react';
import Button from '../../components/Button/Button';
import './login.scss';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';

import TextInput from '../../components/Input/TextInput';
import { useLogin } from '../../hooks/mutations/auth';

const Login = () => {
  const navigate = useNavigate();

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
  const submit = () => {
    let dataToSend = {
      email: state.username,
      password: state.password,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        toast.success('Login successful');
        localStorage.setItem('userDetails', JSON.stringify(res?.data));
        localStorage.setItem('token', res?.data?.tokens?.access);
        window.location.replace('/');
      },

      onError: (e) => {
        console.log(e);
        toast.error('Invalid credentials');
      },
    });
  };

  return (
    <div className='login'>
      <div className='login__card'>
        <div className='login__card__logo'>
          <h2>Accounting Module</h2>
        </div>

        <div className='login__card__form'>
          <TextInput
            label='Email Address'
            fieldClass={errors['username'] ? 'error-field' : 'input-field'}
            placeholder='edves1@gmail.com'
            name='username'
            value={state.username}
            handleChange={handleChange}
            handleBlur={handleBlur}
            type='email'
            errorMessage={errors['username']}
            errorClass={'error-msg'}
            id={'email'}
            onSelectValue={function (
              a: string,
              b: string,
              c?: string | undefined,
              ...r: any
            ): void {
              throw new Error('Function not implemented.');
            }}
            isSearchable={false}
            handleSearchValue={function (e: any): void {
              throw new Error('Function not implemented.');
            }}
            searchValue={''}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('Function not implemented.');
            }}
            selectedValues={undefined}
          />

          <TextInput
            label='Password*'
            fieldClass={errors['password'] ? 'error-field' : 'input-field'}
            placeholder='password'
            name='password'
            value={state.password}
            handleChange={handleChange}
            handleBlur={handleBlur}
            type='password'
            errorMessage={errors['password']}
            errorClass={'error-msg'}
            id={'password'}
            onSelectValue={function (
              a: string,
              b: string,
              c?: string | undefined,
              ...r: any
            ): void {
              throw new Error('Function not implemented.');
            }}
            isSearchable={false}
            handleSearchValue={function (e: any): void {
              throw new Error('Function not implemented.');
            }}
            searchValue={''}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('Function not implemented.');
            }}
            selectedValues={undefined}
          />

          <Button
            btnClass={'btn-primary'}
            btnText={isLoading ? 'Please wait...' : 'Log In'}
            width='100%'
            onClick={() => {
              submit();
            }}
            disabled={
              state.username === '' || state.password === '' || isLoading
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
