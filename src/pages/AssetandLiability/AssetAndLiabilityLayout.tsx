import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import { AssetandLiability } from '../../data';
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
import {
  useFilterIncomeAndExpenseOverview,
  useGetIncomeAndExpenseOverview,
  useSearch,
} from '../../hooks/queries/overview';
import { useDebounce } from 'use-debounce';
import SmallSpinner from '../../assets/smallspinner.svg';
import '../ChartOfAccount/BalanceSheet.scss';

import RecordIncome from '../../components/Modals/IncomeAndExpense/RecordIncome';
import RecordExpense from '../../components/Modals/IncomeAndExpense/RecordExpense';
import RecordEquity from '../../components/Modals/EquityAssetAndLiability/RecordEquity';
import RecordLiability from '../../components/Modals/EquityAssetAndLiability/RecordLiability';
import RecordAsset from '../../components/Modals/EquityAssetAndLiability/RecordAsset';
import Overview from './Overview';
import Asset from './Asset';
import AssetTable from './Asset';
import LiabilityTable from './Liability';
import EquityTable from './Equity';
import Header from '../../components/Header/Header';

const AssetAndLiabilityLayout = () => {
  const { data } = useGetIncomeAndExpenseOverview();
  const [activeTab, setActiveTab] = useState<string | number>(1);
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

  const [modalOpen, setModalOpen] = useState<any>({
    income: false,
    expense: false,
    equity: false,
    liability: false,
    asset: false,
  });
  const dropdownRef = useRef<HTMLElement | null>(null);

  // Add a click event listener to the document body to close the dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef?.current &&
        !(dropdownRef?.current as Node)?.contains(event.target as Node)
      ) {
        setShowActions(false);
        // setShowDateFilters(false);
        setShowDateRange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [debouncedValue] = useDebounce(searchText, 1000);

  const closeModal = (type: string) => {
    setModalOpen({
      income: false,
      expense: false,
      equity: false,
      liability: false,
      asset: false,
    });
  };

  const openModal = (type: string) => {
    type === 'income'
      ? setModalOpen({
          income: true,
          expense: false,
          equity: false,
          liability: false,
          asset: false,
        })
      : type === 'expense'
      ? setModalOpen({
          income: false,
          expense: true,
          equity: false,
          liability: false,
          asset: false,
        })
      : type === 'equity'
      ? setModalOpen({
          income: false,
          expense: false,
          equity: true,
          liability: false,
          asset: false,
        })
      : type === 'liability'
      ? setModalOpen({
          income: false,
          expense: false,
          equity: false,
          liability: true,
          asset: false,
        })
      : setModalOpen({
          income: false,
          expense: false,
          equity: false,
          liability: false,
          asset: true,
        });
  };

  let formatedStartDate = changeDateFormat(
    moment(state[0]?.startDate).format('l')
  );
  let formatedEndDate = changeDateFormat(moment(state[0]?.endDate).format('l'));

  const { isLoading, refetch } = useFilterIncomeAndExpenseOverview(
    formatedStartDate,
    state[0]?.endDate ? formatedEndDate : formatedStartDate
  );

  //filter for today
  const fetchToday = () => {
    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  //filter for yesterday
  const fetchYesterday = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    setState([
      {
        startDate: date,
        endDate: date,
        key: 'selection',
      },
    ]);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  //filter all
  const fetchAll = () => {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    setState([
      {
        startDate: '',
        endDate: '',
        key: 'selection',
      },
    ]);

    setTimeout(() => {
      refetch();
    }, 500);
  };

  let searchres = useSearch(debouncedValue).data;
  let searchLoading = useSearch(debouncedValue).isLoading;

  //move tab to income after getting response from search
  useEffect(() => {
    if (searchres && activeTab === 1) {
      setActiveTab(2);
    }
  }, [searchres]);
  return (
    <div>
      <Header />
      <div className='ie_overview'>
        <h2 className='ie_overview__title'>Asset and Liability Management</h2>
      </div>
      <div className='ie_overview__top-level'>
        <div className='ie_overview__top-level__search'>
          {' '}
          <Search />
          <input
            placeholder='Search by asset name, liabilty name, equity type'
            className='ie_overview__top-level__search__input'
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          {searchText && (
            <div
              style={{ marginTop: '5px', cursor: 'pointer' }}
              onClick={() => setSearchText('')}
            >
              {searchLoading ? <img src={SmallSpinner} alt='' /> : <Clear />}
            </div>
          )}
        </div>

        <div className='ie_overview__top-level__filter-date-wrap'>
          <button
            className='ie_overview__top-level__filter-date'
            onClick={() => {
              setShowDateFilters(!showDateFilters);
              setShowDateRange(false);
              if (showDateFilters) {
                fetchAll();
              }
            }}
          >
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
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => fetchToday()}
              >
                <p>Today</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => fetchYesterday()}
              >
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

        <div className='ie_overview__top-level__btn-wrap' ref={dropdownRef as React.RefObject<HTMLDivElement>}>
          <Button
            btnText='Create Transaction'
            btnClass='btn-primary'
            width='214px'
            icon={<Addcircle />}
            disabled={false}
            onClick={() => setShowActions(!showActions)}
          />
          {showActions && (
            <div className='ie_overview__top-level__btn-wrap__dropdown'>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('asset')}
              >
                <div className={'asset'}></div>
                <p>Asset</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('liability')}
              >
                <div className={'liability'}></div>
                <p>Liability</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('equity')}
              >
                <div className={'equity'}></div>
                <p>Equity</p>
              </div>
            </div>
          )}

          {showActions && activeTab === 4 && (
            <div className='ie_overview__top-level__btn-wrap__dropdown'>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('asset')}
              >
                <div className={'asset'}></div>
                <p>Asset</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('equity')}
              >
                <div className={'equity'}></div>
                <p>Equity</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('expense')}
              >
                <div className={'expense'}></div>
                <p>Expense</p>
              </div>
              <div
                className='ie_overview__top-level__btn-wrap__dropdown__item'
                onClick={() => openModal('income')}
              >
                <div className={'income'}></div>
                <p>Income</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='ie_overview__tabs'>
        {AssetandLiability.map((el) => (
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
          <>
            <Overview />
          </>
        )}
        {activeTab === 2 && (
          <>
            <AssetTable filteredLoading={false} searchRes={''} />
          </>
        )}
        {activeTab === 3 && (
          <>
            <LiabilityTable filteredLoading={false} searchRes={''} />
          </>
        )}
        {activeTab === 4 && (
          <>
            <EquityTable filteredLoading={false} searchRes={''} />
          </>
        )}
      </div>

      <RecordIncome modalIsOpen={modalOpen.income} closeModal={closeModal} />
      <RecordExpense modalIsOpen={modalOpen.expense} closeModal={closeModal} />
      <RecordEquity modalIsOpen={modalOpen.equity} closeModal={closeModal} />
      <RecordLiability
        modalIsOpen={modalOpen.liability}
        closeModal={closeModal}
      />
      <RecordAsset modalIsOpen={modalOpen.asset} closeModal={closeModal} />
    </div>
  );
};

export default AssetAndLiabilityLayout;
