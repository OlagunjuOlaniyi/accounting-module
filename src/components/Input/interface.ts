import { InputHTMLAttributes } from 'react';

type OptionsProps = {
  id: string | number;
  name: any;
};

export interface Iprops extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  name: string;
  handleChange: any;
  value?: string | number;
  fieldClass: string;
  errorClass: string;
  errorMessage: string;
  options?: OptionsProps[];
  label: string;
  id: string;
  placeholder: string;
  onSelectValue: (a: string, b: string, c?: string, ...r: any) => void;
  isSearchable: boolean;
  handleSearchValue: (e: any) => void;
  searchValue: string;
  handleBlur: any;
  validationType?: string;
  selectedValue?: string;
  multi: boolean;
  toggleOption: (a: any) => void;
  selectedValues: any;
}
