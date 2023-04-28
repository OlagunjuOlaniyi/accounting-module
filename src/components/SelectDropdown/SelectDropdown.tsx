import { useState, useEffect, useRef } from 'react';
import './selectDropdown.scss';
import { IDropdownProps } from './interface';

import RadioChecked from '../../icons/RadioChecked';
import RadioUnchecked from '../../icons/RadioUnchecked';
import React from 'react';
import Clear from '../../icons/Clear';

const SelectDropdown = ({
  placeholder,
  options,
  onSelectValue,
  selectedValue,
  name,
  isSearchable,
  searchValue,
  handleSearchValue,
  toggleOption,
  multi,
  selectedValues,
  defaultValue,
}: IDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const searchRef = useRef<any>();

  //handle menu open and close
  useEffect(() => {
    const handler = () => setShowMenu(false);
    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);

  //focus on search input when showMenu value changes to true
  useEffect(() => {
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  //filter options by search value
  const getOptions = () => {
    if (!searchValue) {
      return options;
    }
    return options?.filter(
      (option: any) =>
        option.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  };

  //handle click to show dropdown
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const isSelected = (option: string) => {
    if (!isSelected) {
      return false;
    }

    return selectedValue === option;
  };

  //handle multiple selection true or false
  const isMultiSelected = (option: any) => {
    if (!isMultiSelected) {
      return false;
    }

    return selectedValues.filter((e: any) => e.id === option.id).length > 0;
  };

  const Icon = () => {
    return (
      <svg
        width='4'
        height='8'
        viewBox='0 0 4 8'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0.666504 7.3335L3.99984 4.00016L0.666504 0.66683L0.666504 7.3335Z'
          fill='#323232'
        />
      </svg>
    );
  };

  return (
    <div className='dropdown-container'>
      <div className={`dropdown-input`} onClick={handleClick}>
        {multi && selectedValues?.length ? (
          selectedValues?.length > 3 ? (
            <div className='badges-wrapper'>
              {selectedValues?.slice(0, 3).map((val: { name: string }) => (
                <div className='multi-badge'>
                  <p>{val?.name}</p>{' '}
                  <div onClick={() => toggleOption(val)}>
                    <Clear />
                  </div>
                </div>
              ))}
              <p> and {selectedValues?.length - 3} others</p>
            </div>
          ) : (
            <div className='badges-wrapper'>
              {selectedValues?.length > 0 &&
                selectedValues?.map((val: { name: string }) => (
                  <div className='multi-badge'>
                    <p>{val?.name}</p>{' '}
                    <div onClick={() => toggleOption(val)}>
                      <Clear />
                    </div>
                  </div>
                ))}
            </div>
          )
        ) : selectedValue ? (
          <div className='dropdown-selected-value'>{selectedValue}</div>
        ) : defaultValue ? (
          <div className='dropdown-selected-value'>{defaultValue}</div>
        ) : (
          <div className='dropdown-selected-placeholder'>{placeholder}</div>
        )}

        <div className='dropdown-tools'>
          <div className='dropdown-tool'>
            <Icon />
          </div>
        </div>
      </div>
      {showMenu &&
        (multi ? (
          <div
            className='dropdown-menu'
            onClick={(e: any) => e.stopPropagation()}
          >
            {isSearchable && options && (
              <div className='dropdown-menu__search-box'>
                <input
                  value={searchValue}
                  onChange={handleSearchValue}
                  ref={searchRef}
                  placeholder='Search'
                />
              </div>
            )}
            {options ? (
              getOptions()?.map((el: any) => (
                <div
                  key={el?.id}
                  className={`dropdown-item ${
                    isSelected(el?.value) && 'selected'
                  }`}
                  onClick={() => {
                    toggleOption(el);
                  }}
                >
                  {isMultiSelected(el) ? <RadioChecked /> : <RadioUnchecked />}
                  <p> {el?.name}</p>
                </div>
              ))
            ) : (
              <div
                style={{
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p>No options available</p>
              </div>
            )}
          </div>
        ) : (
          <div className='dropdown-menu'>
            {isSearchable && options && (
              <div className='dropdown-menu__search-box'>
                <input
                  value={searchValue}
                  onChange={handleSearchValue}
                  ref={searchRef}
                  placeholder='Search'
                />
              </div>
            )}
            {options ? (
              getOptions()?.map((el: any) => (
                <div
                  key={el?.id}
                  className={`dropdown-item ${
                    isSelected(el?.value) && 'selected'
                  }`}
                  onClick={() => {
                    onSelectValue(el?.name, name, el?.currency, el);
                  }}
                >
                  <p> {el?.name}</p>
                </div>
              ))
            ) : (
              <div
                style={{
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p>No options available</p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default SelectDropdown;
