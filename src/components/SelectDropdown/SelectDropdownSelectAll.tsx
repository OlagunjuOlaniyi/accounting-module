import { useState, useEffect, useRef } from "react";
import "./selectDropdown.scss";
import { IDropdownProps } from "./interface";
import React from "react";
import Clear from "../../icons/Clear";
import Checked from "../../icons/Checked";
import Unchecked from "../../icons/Unchecked";
import Arrow from "../../icons/arrow.svg";
import MultiLevelDropdown from "../MultilevelDropdown/MultilevelDropdown";

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
  isMultidropdown,
}: IDropdownProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const searchRef = useRef<any>();

  //handle menu open and close
  useEffect(() => {
    const handler = () => setShowMenu(false);
    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
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

  // handle "Select All" option
  const handleSelectAll = () => {
    toggleOption(options); // Pass all options to toggleOption
  };

  const isSelected = (option: string) => {
    if (!isSelected) {
      return false;
    }

    return selectedValue === option;
  };

  // Inside the SelectDropdown component
  // const handleSelectAll = () => {
  //   const allOptions = options.filter((option) => option.id !== "select-all"); // Exclude the "Select All" option
  //   onSelectValue(
  //     allOptions.map((option) => option.name),
  //     name,
  //     allOptions.map((option) => option.id)
  //   );
  // };

  //handle multiple selection true or false
  const isMultiSelected = (option: any) => {
    if (!isMultiSelected) {
      return false;
    }

    return (
      selectedValues.filter(
        (e: any) => e?.name.toLowerCase() === option?.name.toLowerCase()
      ).length > 0
    );
  };

  const Icon = () => {
    return (
      <svg
        width="4"
        height="8"
        viewBox="0 0 4 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.666504 7.3335L3.99984 4.00016L0.666504 0.66683L0.666504 7.3335Z"
          fill="#323232"
        />
      </svg>
    );
  };

  return (
    <div className="dropdown-container">
      <div className={`dropdown-input`} onClick={handleClick}>
        {(multi || isMultidropdown) && selectedValues?.length ? (
          selectedValues?.length > 3 ? (
            <div className="badges-wrapper">
              {selectedValues?.slice(0, 3).map((val: { name: string }) => (
                <div className="multi-badge">
                  <p>{val?.name}</p>{" "}
                  <div onClick={() => toggleOption(val)}>
                    <Clear />
                  </div>
                </div>
              ))}
              <p> and {selectedValues?.length - 3} others</p>
            </div>
          ) : (
            <div className="badges-wrapper">
              {selectedValues?.length > 0 &&
                selectedValues?.map((val: { name: string }) => (
                  <div className="multi-badge">
                    <p>{val?.name}</p>{" "}
                    <div onClick={() => toggleOption(val)}>
                      <Clear />
                    </div>
                  </div>
                ))}
            </div>
          )
        ) : selectedValue ? (
          <div className="dropdown-selected-value">{selectedValue}</div>
        ) : defaultValue ? (
          <div className="dropdown-selected-value">{defaultValue}</div>
        ) : (
          <div className="dropdown-selected-placeholder">{placeholder}</div>
        )}

        <div className="dropdown-tools">
          <div className="dropdown-tool">
            {/* <Icon /> */}
            <img src={Arrow} alt="" />
          </div>
        </div>
      </div>
      {showMenu &&
        (multi ? (
          <div
            className="dropdown-menu"
            onClick={(e: any) => e.stopPropagation()}
          >
            {isSearchable && options && (
              <div className="dropdown-menu__search-box">
                <input
                  value={searchValue}
                  onChange={handleSearchValue}
                  ref={searchRef}
                  placeholder="Search"
                />
              </div>
            )}
            {getOptions().length === 0 ? (
              <div
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>No options available</p>
              </div>
            ) : (
              <>
                <div
                  className={`dropdown-item ${
                    isSelected("Select All") && "selected"
                  }`}
                  onClick={handleSelectAll}
                >
                  {isSelected("Select All") ? <Checked /> : <Unchecked />}
                  <p>All Classes</p>
                </div>
                {getOptions().map((el: any) => (
                  <div
                    key={`${el?.id}-${el.name}`}
                    className={`dropdown-item ${
                      isSelected(el?.value) && "selected"
                    }`}
                    onClick={() => {
                      toggleOption(el);
                    }}
                  >
                    {isMultiSelected(el) ? <Checked /> : <Unchecked />}
                    <p> {el?.name}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : isMultidropdown ? (
          <div
            //className='dropdown-menu'
            onClick={(e: any) => e.stopPropagation()}
          >
            <MultiLevelDropdown
              data={options}
              selected={selectedValues || []}
              toggleOption={toggleOption}
            />
          </div>
        ) : (
          <div className="dropdown-menu">
            {isSearchable && options && (
              <div className="dropdown-menu__search-box">
                <input
                  value={searchValue}
                  onChange={handleSearchValue}
                  ref={searchRef}
                  placeholder="Search"
                />
              </div>
            )}
            {getOptions().length === 0 ? (
              <div
                style={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>No options available</p>
              </div>
            ) : (
              getOptions().map((el: any) => (
                <div
                  key={`${el?.id}-${el.name}`}
                  className={`dropdown-item ${
                    isSelected(el?.value) && "selected"
                  }`}
                  onClick={() => {
                    onSelectValue(el?.name, name, el.id);
                  }}
                >
                  <p> {el?.name}</p>
                </div>
              ))
            )}
          </div>
        ))}
    </div>
  );
};

export default SelectDropdown;
