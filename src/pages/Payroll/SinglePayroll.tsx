import { useRef, useState } from 'react';
import Button from '../../components/Button/Button';

import Addcircle from '../../icons/Addcircle';
import Calendar from '../../icons/Calendar';

import Export from '../../icons/Export';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';
//import '../IncomeAndExpense/incomeexpense.scss';
import { useNavigate, useParams } from 'react-router';

import RightCaret from '../../icons/RightCaret';
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';

import { useListStaffAllowanceAndDeductions } from '../../hooks/queries/payroll';

import BackArrow from '../../icons/BackArrow';
import ViewPayrollTable from './ViewPayrollTable';

const SinglePayroll = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchText, setSearchText] = useState<string>('');

  const [showDateFilters, setShowDateFilters] = useState<boolean>(false);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);
  const [state, setState] = useState<any>([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  const queryParams = new URLSearchParams(location.search);
  let type = queryParams.get('type');

  const { isLoading, data } = useListStaffAllowanceAndDeductions(
    id || '',
    type?.toUpperCase() || 'ALLOWANCE'
  );

  const dropdownRef = useRef(null);

  return (
    <div>
      <div className='single-expense-wrapper__top__breadcrumbs'>
        <BackArrow />
        <span
          className='single-expense-wrapper__top__breadcrumbs__inactive'
          onClick={() => navigate('/payroll')}
        >
          Payroll Management / {type?.toUpperCase()} /
        </span>
      </div>
      <div className='ie_overview'>
        <h2 className='ie_overview__title'>Payroll Management</h2>
      </div>
      <div className='ie_overview__top-level'>
        <div className='ie_overview__top-level__search'>
          {' '}
          <Search />
          <input
            placeholder='Search by payslip name, staff name, staff id'
            className='ie_overview__top-level__search__input'
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          {/* {searchText && (
            <div
              className="ie_overview__top-level__search__dropdown-menu"
              onClick={(e: any) => e.stopPropagation()}
            >
              <div className="ie_overview__top-level__search__dropdown-menu__top">
                <h3>Recent Search</h3>
                <p>Clear All</p>
              </div>
              <div className="ie_overview__top-level__search__dropdown-menu__list">
                {recentSearch.map((s) => (
                  <div
                    className="ie_overview__top-level__search__dropdown-menu__list__item"
                    key={s.id}
                  >
                    <p>{s.title}</p>
                    <div className="ie_overview__top-level__search__dropdown-menu__list__item__cat">
                      <div className={s.type}></div>
                      <p>{s.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {searchText && (
            <div
              style={{ marginTop: '5px', cursor: 'pointer' }}
              onClick={() => setSearchText('')}
            >
              {/* {searchLoading ? <img src={SmallSpinner} alt='' /> : <Clear />} */}
            </div>
          )}
        </div>

        <div className='ie_overview__top-level__filter-date-wrap'>
          <button className='ie_overview__top-level__filter-date'>
            {' '}
            <Calendar />
            <p>2023</p>
          </button>

          {showDateRange && (
            <div className='ie_overview__top-level__filter-date-wrap__dropdown'>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
              />
            </div>
          )}
          {showDateFilters && (
            <div className='ie_overview__top-level__filter-date-wrap__dropdown'>
              <div className='ie_overview__top-level__btn-wrap__dropdown__item'>
                <p>Today</p>
              </div>
              <div className='ie_overview__top-level__btn-wrap__dropdown__item'>
                <p>Yesterday</p>
              </div>

              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => {
                  setShowDateRange(true);
                  setShowDateFilters(false);
                }}
              >
                <p>Custom Date</p>
                <RightCaret />
              </div>
            </div>
          )}
        </div>

        {showDateFilters && (
          <button className='ie_overview__top-level__filter-date' disabled>
            {' '}
            <Filter />
            <p>Filter</p>
          </button>
        )}
        <button className='ie_overview__top-level__filter-download'>
          {' '}
          <Export />
          <p>Download</p>
        </button>
        <div className='ie_overview__top-level__btn-wrap' ref={dropdownRef}>
          <Button
            btnText='Create Payroll'
            btnClass='btn-primary'
            width='214px'
            icon={<Addcircle />}
            disabled={false}
            onClick={() => navigate('/create-payroll')}
          />
        </div>
      </div>

      <div>
        <ViewPayrollTable
          isLoading={isLoading}
          searchRes={''}
          filteredData={data}
          type={type}
        />
      </div>
    </div>
  );
};

export default SinglePayroll;
