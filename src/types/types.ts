//routes types
export interface RouteTypes {
  id: number;
  path: string;
  component: React.FunctionComponent;
}

//modal types

export interface Imodal {
  modalIsOpen: boolean;
  closeModal: (a: string) => void;
}
