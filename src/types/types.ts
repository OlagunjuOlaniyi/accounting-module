import { ApiRes, IexpenseRes } from './expenseTypes';

//routes types
export interface RouteTypes {
  id: number;
  path: string;
  component: React.FunctionComponent;
}

//modal types

export interface Imodal {
  modalIsOpen: boolean;
  closeModal: any;
}

export interface IeditModal extends Imodal {
  selectedId?: string;
}
