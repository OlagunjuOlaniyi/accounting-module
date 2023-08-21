export interface IexpenseProps {
  id?: string;
  payment_method: string;
  amount: string;
  description: string;
  transaction_group: string;
  transaction_type: string;
  date: string;
  attachment: string;
  account: string;
  name?: string;
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
  date: any;
}

export interface ApiRes {
  data: IexpenseRes[];
}
