import { useQuery } from 'react-query';
import {
  getDispensedProducts,
  getProductHistory,
  getProducts,
  getSingleProduct,
  searchProducts,
} from '../../services/inventoryService';
import {
  InventoryApiResponse,
  ProductHistoryData,
} from '../../types/inventory';

export const useGetProducts = () => {
  return useQuery<InventoryApiResponse>({
    queryKey: 'products',
    queryFn: () => getProducts(),
    cacheTime: 0,
  });
};

export const useGetDispensedProducts = () => {
  return useQuery<any[]>({
    queryKey: 'dispensed-products',
    queryFn: () => getDispensedProducts(),
    cacheTime: 0,
  });
};

export const useGetSingleProduct = (id: string) => {
  return useQuery<any | any>({
    queryKey: `single-product-${id}`,
    queryFn: () => getSingleProduct(id),
    cacheTime: 0,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery<any>({
    queryKey: [`product-search-${query}`],
    queryFn: () => searchProducts(query),
    refetchOnWindowFocus: false,
    enabled: Boolean(query),
    cacheTime: 0,
  });
};

export const useGetProductHistory = (id: string) => {
  return useQuery<ProductHistoryData[]>({
    queryKey: `product-history-${id}`,
    queryFn: () => getProductHistory(id),
    cacheTime: 0,
  });
};
