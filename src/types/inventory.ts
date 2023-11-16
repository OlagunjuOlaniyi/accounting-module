interface Product {
  id: string;
  check_status: null | string;
  quantity: number;
  product_group: {
    id: string;
    category: {
      id: string;
      name: string;
      created_date: string;
    };
    name: string;
    created_date: string;
    owner: number;
  };
  payment_method: string;
  name: string;
  general_purchasing_price: string;
  general_selling_price: string;
  sizes: {
    size: string;
    quantity: number;
    ppu: string;
    spu: string;
  }[];
  description: string;
  date: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
  same_unit_price: boolean;
  transaction_date: string;
  reorder_level: string;
  tnx_type: string;
  owner: number;
  attachment: any[]; // You can replace 'any' with the appropriate type if needed
}

export interface InventoryApiResponse {
  data: Product[];
  status: number;
}

interface ProductHistoryDetail {
  id: string;
  students: null | any; // You can replace 'any' with a more specific type if needed
  size: string;
  owner_id: number;
  product_id: string;
  activity: string;
  amount: number;
  residual_amount: number;
  created_at: string;
  updated_at: string;
}

export interface ProductHistoryData {
  size: string;
  details: ProductHistoryDetail[];
}
