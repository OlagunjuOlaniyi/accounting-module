import { useQuery } from 'react-query';
import {
  getAssetGroups,
  getAssetTypes,
  getAssets,
  getEquity,
  getLiabilities,
  getProfitAndLoss,
  getTrialBalance,
} from '../../services/chartOfAccountService';

//get p and l
export const useGetProfitAndLoss = () => {
  return useQuery<any>({
    queryKey: 'profit-and-loss',
    queryFn: () => getProfitAndLoss(),
  });
};

//get trial balance
export const useGetTrialBalance = () => {
  return useQuery<any>({
    queryKey: 'trial-balance',
    queryFn: () => getTrialBalance(),
  });
};

//get assets
export const useGetAssets = () => {
  return useQuery<any>({
    queryKey: 'assets',
    queryFn: () => getAssets(),
  });
};

//get asset groups
export const useGetAssetGroups = () => {
  return useQuery<any>({
    queryKey: 'assets-groups',
    queryFn: () => getAssetGroups(),
  });
};

//get asset TYPES
export const useGetAssetTypes = () => {
  return useQuery<any>({
    queryKey: 'assets-types',
    queryFn: () => getAssetTypes(),
  });
};

//get liability
export const useGetLiabilities = () => {
  return useQuery<any>({
    queryKey: 'liabilities',
    queryFn: () => getLiabilities(),
  });
};

//get wquity
export const useGetEquity = () => {
  return useQuery<any>({
    queryKey: 'equity',
    queryFn: () => getEquity(),
  });
};
