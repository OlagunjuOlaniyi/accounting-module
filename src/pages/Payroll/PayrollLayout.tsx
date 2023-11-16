import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import RecordExpense from '../../components/Modals/IncomeAndExpense/RecordExpense';
import RecordIncome from '../../components/Modals/IncomeAndExpense/RecordIncome';
import { payrollTabs } from '../../data';
import Addcircle from '../../icons/Addcircle';
import Calendar from '../../icons/Calendar';
import Clear from '../../icons/Clear';
import Export from '../../icons/Export';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';
//import '../IncomeAndExpense/incomeexpense.scss';
import { useNavigate } from 'react-router';

import RightCaret from '../../icons/RightCaret';
import { DateRange } from 'react-date-range';
import { changeDateFormat, calcDiffInDays } from '../../utilities';
import moment from 'moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';

import PayrollOverview from './PayrollOverview';
import { useGetPayroll } from '../../hooks/queries/payroll';
import PayrollTable from './AllowanceTable';
import AllowanceTable from './AllowanceTable';
import DeductionTable from './DeductionTable';

const PayrollLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | number>(1);
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
  const [modalOpen, setModalOpen] = useState<any>({
    income: false,
    expense: false,
  });

  const closeModal = (type: string) => {
    setModalOpen({ income: false, expense: false });
  };

  const { isLoading, data, refetch } = useGetPayroll();

  const dropdownRef = useRef(null);

  return (
    <div>
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
              <div className='ie_overview__top-level__filter-date-wrap__dropdown__footer'>
                <p>
                  {calcDiffInDays(
                    moment(state[0].startDate),
                    moment(state[0].endDate)
                  )}{' '}
                  day(s) selected
                </p>
                <Button
                  btnText='Apply Date'
                  btnClass='btn-primary'
                  width='97px'
                  disabled={false}
                  onClick={() => refetch()}
                />
              </div>
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

      <div className='ie_overview__tabs'>
        {payrollTabs.map((el) => (
          <div key={el.id} onClick={() => setActiveTab(el.id)}>
            <div
              className={`ie_overview__tabs__single__${
                activeTab === el.id ? 'active-tab' : 'inactive-tab'
              }`}
            >
              {el.title}
            </div>
          </div>
        ))}
      </div>

      <div>
        {activeTab === 1 && (
          <PayrollOverview filteredData={data} filteredLoading={isLoading} />
        )}

        {activeTab === 2 && (
          <AllowanceTable
            isLoading={isLoading}
            searchRes={undefined}
            filteredData={data}
          />
        )}
        {activeTab === 3 && (
          <DeductionTable
            isLoading={isLoading}
            searchRes={undefined}
            filteredData={data}
          />
        )}
      </div>
      <RecordIncome modalIsOpen={modalOpen.income} closeModal={closeModal} />
      <RecordExpense modalIsOpen={modalOpen.expense} closeModal={closeModal} />
    </div>
  );
};

export default PayrollLayout;
