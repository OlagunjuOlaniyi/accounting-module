import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
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
import './BalanceSheet.scss';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import { useNavigate } from 'react-router';

const ChartofAccountWrapper = ({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

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

  interface ICardDetails extends ICardProps {
    id: number;
  }

  const [debouncedValue] = useDebounce(searchText, 1000);

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
      <p className='sm-test' onClick={() => navigate('/chart-of-account')}>
        Chart of Account / Profit & Loss /{' '}
        <b style={{ color: '#010c15' }}>{id}</b>
      </p>
      <div className='ie_overview'>
        <h2 className='ie_overview__title'>{id}</h2>
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

        <div className='ie_overview__top-level__btn-wrap'>
          <Button
            btnText='Create Transaction'
            btnClass='btn-primary'
            width='214px'
            icon={<Addcircle />}
            disabled={false}
            onClick={() => setShowActions(!showActions)}
          />
        </div>
      </div>

      {children}
    </div>
  );
};

export default ChartofAccountWrapper;
