import { InputHTMLAttributes } from 'react';

interface OptionsProps {
  id: string | number;
  name: string;
}

export interface IDropdownProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  options: OptionsProps[] | any;
  placeholder: string;
  onSelectValue: (a: string, b: string, c?: string, ...r: any) => void;
  isSearchable: boolean;
  handleSearchValue: (e: any) => void;
  searchValue: string;
  selectedValue: string | number;
  toggleOption: (a: any) => void;
  multi: boolean;
  selectedValues: any;
}
