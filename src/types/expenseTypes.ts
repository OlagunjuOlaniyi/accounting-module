export interface IexpenseProps {
  payment_method: string;
  amount: string;
  description: string;
  transaction_group: string;
  transaction_type: string;
  date: string;
  attachment: string;
}

export interface IexpenseRes {
  id: string;
  payment_method: string;
  amount: string;
  description: string;
  transaction_group: {
    id: string | number;
    name: string;
  };
  transaction_type: {
    id: string | number;
    name: string;
  };
  attachment?: string;
  account: string;
  date: string;
}
