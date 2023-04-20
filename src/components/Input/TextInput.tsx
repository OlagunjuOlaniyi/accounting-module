import { useState } from 'react';
import SelectDropdown from '../SelectDropdown/SelectDropdown';
import { Iprops } from './interface';
import './input.scss';
import React from 'react';

const TextInput = ({
  type,
  name,
  handleChange,
  value,
  fieldClass,
  errorClass,
  errorMessage,
  options,
  label,
  id,
  placeholder,
  onSelectValue,
  isSearchable,
  handleSearchValue,
  searchValue,
  handleBlur,
  validationType,
  multi,
  selectedValues,
  toggleOption,
}: Iprops) => {
  const [fieldType, setFieldType] = useState('password');
  const toggleField = () => {
    if (fieldType === 'password') {
      setFieldType('text');
    } else {
      setFieldType('password');
    }
  };
  const fieldProps = {
    id,
    name,
    type: type === 'password' ? fieldType : type,
    value,
    placeholder,
    className: fieldClass,
    onChange: handleChange,
    onBlur: handleBlur,
  };

  return (
    <div className='input-component'>
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea {...fieldProps} />
      ) : type === 'dropdown' ? (
        <SelectDropdown
          placeholder={fieldProps.placeholder}
          options={options}
          onSelectValue={onSelectValue}
          selectedValue={fieldProps.value}
          name={fieldProps.name}
          isSearchable={isSearchable}
          handleSearchValue={handleSearchValue}
          searchValue={searchValue}
          multi={multi}
          selectedValues={selectedValues}
          toggleOption={toggleOption}
        />
      ) : type === 'password' ? (
        <div className='password-input'>
          <input {...fieldProps} data-validation={validationType} />
          <p onClick={() => toggleField()}>show</p>
        </div>
      ) : (
        <input {...fieldProps} data-validation={validationType} />
      )}
      <p className={errorClass}>{errorMessage}</p>
    </div>
  );
};

export default TextInput;
