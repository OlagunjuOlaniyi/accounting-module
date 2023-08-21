import React, { useEffect, useState } from 'react';
import { changeDateFormat, calcDiffInDays } from '../../utilities';
import moment from 'moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import {
  useFilterIncomeAndExpenseOverview,
  useSearch,
} from '../../hooks/queries/overview';
import { useDebounce } from 'use-debounce';
import '../ChartOfAccount/BalanceSheet.scss';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import Asset from '../../icons/Asset';
import Liability from '../../icons/Liability';
import Equity from '../../icons/Equity';
import { Ioverview } from '../../types/types';
import {
  useGetAssets,
  useGetEquity,
  useGetLiabilities,
} from '../../hooks/queries/chartOfAccount';

interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
}

const Overview = () => {
  const { data } = useGetAssets();
  const { data: liability } = useGetLiabilities();
  const { data: equity } = useGetEquity();

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
  });

  interface ICardDetails extends ICardProps {
    id: number;
  }

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'ASSET',
      amount: `NGN ${data?.total_asset?.toLocaleString() ?? 0}`,
      percentage: '2.4%',
      type: 'profit',
      icon: <Asset />,
    },
    {
      id: 2,
      title: 'LIABILITY',
      amount: `NGN ${liability?.total_liability?.toLocaleString() ?? 0}`,
      percentage: '1.2%',
      type: 'loss',
      icon: <Liability />,
    },
    {
      id: 3,
      title: 'EQUITY',
      amount: `NGN ${equity?.total_equity?.toLocaleString() ?? 0}`,
      percentage: '2.2%',
      type: 'profit',
      icon: <Equity />,
    },
  ];
  const [debouncedValue] = useDebounce(searchText, 1000);

  const closeModal = (type: string) => {
    setModalOpen({ income: false, expense: false });
  };

  const openModal = (type: string) => {
    type === 'income'
      ? setModalOpen({ income: true, expense: false })
      : setModalOpen({ income: false, expense: true });
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

  let searchres = useSearch(debouncedValue).data;

  //move tab to income after getting response from search
  useEffect(() => {
    if (searchres && activeTab === 1) {
      setActiveTab(2);
    }
  }, [searchres]);

  let totalLiabilityAndEquity =
    Number(equity?.total_equity ?? 0) + Number(liability?.total_liability ?? 0);

  return (
    <div>
      <div className='income-expense-overview__cards'>
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
      </div>

      <div className='income-expense-overview__statement-wrapper'>
        <div className='income-expense-flex' style={{ width: '100%' }}>
          <div style={{ width: '50%' }}>
            {' '}
            <div className='income-expense-overview__statement-wrapper__title'>
              <div className=''>
                <h3>Assets</h3>
              </div>
              <div className=''>
                <h3>AMOUNT</h3>
              </div>
            </div>
            <div className='overview-scroll-container'>
              {data?.data?.length === 0 ? (
                <div className='empty-state'>No data available</div>
              ) : (
                data?.data?.map((el: any) => (
                  <div
                    className='income-expense-overview__statement-wrapper__content'
                    key={el.id}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left'>
                      <p>{el.transaction_type?.name}</p>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>{Number(el.amount).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>Total Asset</h3>
              </div>
              <div className=''>
                <h3>{data?.total_asset?.toLocaleString() ?? 0}</h3>
              </div>
            </div>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
          >
            <div>
              {' '}
              <div className='income-expense-overview__statement-wrapper__title'>
                <div className=''>
                  <h3>Liabilties</h3>
                </div>
                <div className=''>
                  <h3>AMOUNT</h3>
                </div>
              </div>
              <div className='overview-scroll-container'>
                {liability?.data?.length === 0 ? (
                  <div className='empty-state'>No data available</div>
                ) : (
                  liability?.data?.map((el: any) => (
                    <div
                      className='income-expense-overview__statement-wrapper__content'
                      key={el.id}
                    >
                      <div className='income-expense-overview__statement-wrapper__content__left'>
                        <p>{el.transaction_type?.name}</p>
                      </div>
                      <div className='income-expense-overview__statement-wrapper__content__right'>
                        <p>{Number(el.amount).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className='income-expense-overview__statement-wrapper__total'>
                <div className=''>
                  <h3>TOTAL Liabilities</h3>
                </div>
                <div className=''>
                  <h3>
                    NGN {liability?.total_liability?.toLocaleString() ?? 0}
                  </h3>
                </div>
              </div>
            </div>

            <div>
              {' '}
              <div className='income-expense-overview__statement-wrapper__title'>
                <div className=''>
                  <h3>Equity</h3>
                </div>
                <div className=''>
                  <h3>AMOUNT</h3>
                </div>
              </div>
              <div className='overview-scroll-container'>
                {equity?.data?.length === 0 ? (
                  <div className='empty-state'>No data available</div>
                ) : (
                  equity?.data?.map((el: any) => (
                    <div
                      className='income-expense-overview__statement-wrapper__content'
                      key={el.id}
                    >
                      <div className='income-expense-overview__statement-wrapper__content__left'>
                        <p>{el.transaction_type?.name}</p>
                      </div>
                      <div className='income-expense-overview__statement-wrapper__content__right'>
                        <p>{Number(el.amount).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                className='income-expense-overview__statement-wrapper__total'
                style={{ borderBottom: 'none' }}
              >
                <div className=''>
                  <h3>TOTAL Equity</h3>
                </div>
                <div className=''>
                  <h3>NGN {equity?.total_equity?.toLocaleString() ?? 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: '10px' }}>
          <div
            className='income-expense-overview__statement-wrapper__total balance'
            style={{ borderTop: 'none', marginTop: '5px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '50%',
                paddingTop: '24px',
                alignItems: 'center',
              }}
            >
              <div className=''>
                <h3>TOTAL ASSET</h3>
              </div>
              <div className=''>
                <h3>NGN {data?.total_asset?.toLocaleString()}</h3>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '50%',
                paddingLeft: '24px',
                paddingTop: '24px',
                alignItems: 'center',
              }}
            >
              <div className=''>
                <h3>TOTAL LIABILITIES & SHAREHOLDERS’ EQUITY</h3>
              </div>
              <div className=''>
                <h3>NGN {totalLiabilityAndEquity.toLocaleString() ?? 0}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
