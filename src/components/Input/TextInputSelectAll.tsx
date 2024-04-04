import { useState } from "react";
import SelectDropdownSelectAll from "../SelectDropdown/SelectDropdownSelectAll";
import { Iprops } from "./interface";
import "./input.scss";
import React from "react";

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
  defaultValue,
  disabled,
  isMultidropdown,
}: Iprops) => {
  const [fieldType, setFieldType] = useState("password");
  const toggleField = () => {
    if (fieldType === "password") {
      setFieldType("text");
    } else {
      setFieldType("password");
    }
  };
  const fieldProps = {
    id,
    name,
    type: type === "password" ? fieldType : type,
    value,
    placeholder,
    className: fieldClass,
    onChange: handleChange,
    onBlur: handleBlur,
  };

  // Add the "Select All" option to the options list
  // const updatedOptions = [
  //   { id: "select-all", name: "Select All" }, // Add the "Select All" option
  //   ...options, // Spread the existing options
  // ];

  return (
    <div className="input-component">
      <label>{label}</label>
      {type === "textarea" ? (
        <textarea
          {...fieldProps}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      ) : type === "dropdown" ? (
        <SelectDropdownSelectAll
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
          type={type}
          defaultValue={defaultValue}
          isMultidropdown={isMultidropdown}
        />
      ) : type === "password" ? (
        <div className="password-input">
          <input
            {...fieldProps}
            data-validation={validationType}
            disabled={disabled}
          />
          <p onClick={() => toggleField()}>show</p>
        </div>
      ) : (
        <input
          {...fieldProps}
          data-validation={validationType}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      )}
      <p className={errorClass}>{errorMessage}</p>
    </div>
  );
};

export default TextInput;
