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
  });
};

export const useGetDispensedProducts = () => {
  return useQuery<InventoryApiResponse>({
    queryKey: 'dispensed-products',
    queryFn: () => getDispensedProducts(),
  });
};

export const useGetSingleProduct = (id: string) => {
  return useQuery<any | any>({
    queryKey: `single-product-${id}`,
    queryFn: () => getSingleProduct(id),
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery<any>({
    queryKey: [`product-search-${query}`],
    queryFn: () => searchProducts(query),
    refetchOnWindowFocus: false,
    enabled: Boolean(query),
  });
};

export const useGetProductHistory = (id: string) => {
  return useQuery<ProductHistoryData[]>({
    queryKey: `product-history-${id}`,
    queryFn: () => getProductHistory(id),
  });
};
