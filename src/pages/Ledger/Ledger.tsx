import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';

import { ledgerTabs } from '../../data';
import Addcircle from '../../icons/Addcircle';
import Calendar from '../../icons/Calendar';
import Clear from '../../icons/Clear';
import Export from '../../icons/Export';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';

import RightCaret from '../../icons/RightCaret';
import { DateRange } from 'react-date-range';
import { changeDateFormat, calcDiffInDays } from '../../utilities';
import moment from 'moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';

import LedgerTable from './LedgerTable';
import { useGetLedgers } from '../../hooks/queries/ledgers';
import OverviewCard from '../../components/OverviewCard/OverviewCard';
import Income from '../../icons/Income';
import Expense from '../../icons/Expense';
import Net from '../../icons/Net';

const Ledger = () => {
  const [activeTab, setActiveTab] = useState<string | number>('income_ledger');
  const [searchText, setSearchText] = useState<string>('');
  const [showActions, setShowActions] = useState<boolean>(false);
  const [showDateFilters, setShowDateFilters] = useState<boolean>(false);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);
  const [state, setState] = useState<any>([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  const { data, isLoading } = useGetLedgers();

  const cardDetails: any[] = [
    {
      id: 1,
      title: 'INCOME',
      amount: `NGN 500`,
      percentage: '2.4%',
      type: 'profit',
      icon: <Income />,
    },
    {
      id: 2,
      title: 'EXPENSE',
      amount: `NGN 500`,
      percentage: '1.2%',
      type: 'loss',
      icon: <Expense />,
    },
    {
      id: 3,
      title: 'NET PROFIT (LOSS)',
      amount: `NGN 500`,
      percentage: '2.2%',
      type: 'profit',
      icon: <Net />,
    },
    {
      id: 4,
      title: 'NET PROFIT (LOSS)',
      amount: `NGN 500`,
      percentage: '2.2%',
      type: 'profit',
      icon: <Net />,
    },
    {
      id: 5,
      title: 'NET PROFIT (LOSS)',
      amount: `NGN 500`,
      percentage: '2.2%',
      type: 'profit',
      icon: <Net />,
    },
  ];

  return (
    <div>
      <div className='ie_overview'>
        <h2 className='ie_overview__title'>Ledger</h2>
      </div>

      <div className='ie_overview__top-level'>
        <div className='ie_overview__top-level__search'>
          {' '}
          <Search />
          <input
            placeholder='Search by income type, expense type, payment method'
            className='ie_overview__top-level__search__input'
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
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
                  onClick={function (): void {
                    throw new Error('Function not implemented.');
                  }}
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
        <div className='ie_overview__top-level__btn-wrap'>
          <Button
            btnText='Post Ledger'
            btnClass='btn-primary'
            width='214px'
            icon={<Addcircle />}
            disabled={false}
            onClick={() => {}}
          />
          {showActions && (
            <div className='ie_overview__top-level__btn-wrap__dropdown'>
              <div className='ie_overview__top-level__btn-wrap__dropdown__item'>
                <div className={'income'}></div>
                <p>Income</p>
              </div>
              <div className='ie_overview__top-level__btn-wrap__dropdown__item'>
                <div className={'expense'}></div>
                <p>Expense</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='ie_overview__tabs'>
        {ledgerTabs.map((el) => (
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

      {/* <div className='income-expense-overview__cards'>
        {cardDetails.map((el) => (
          <div key={el.id}>
            <OverviewCard
              type={el.type}
              title={el.title}
              percentage={el.percentage}
              amount={el.amount}
              icon={el.icon}
            />
          </div>
        ))}
      </div> */}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <LedgerTable data={data[activeTab]} />
        </div>
      )}
    </div>
  );
};

export default Ledger;
