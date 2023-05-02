import { useMutation } from 'react-query';
import { ILogin, ILoginRes } from '../../types/types';

import { login } from '../../services/authService';

//create new expense
export const useLogin = () => {
  return useMutation<ILoginRes, ILogin, any>({
    mutationKey: ['login'],
    mutationFn: (data: ILogin) => login(data),
  });
};
