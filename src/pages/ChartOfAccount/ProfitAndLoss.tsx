import React, { useEffect, useState } from 'react';
import ExpenseTable from '../IncomeAndExpense/ExpenseTable';
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
import './BalanceSheet.scss';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import Income from '../../icons/Income';
import Expense from '../../icons/Expense';
import Net from '../../icons/Net';
import { useGetProfitAndLoss } from '../../hooks/queries/chartOfAccount';
import { useNavigate } from 'react-router';

const ProfitAndLoss = () => {
  const navigate = useNavigate();

  const { data } = useGetProfitAndLoss();

  const [activeTab, setActiveTab] = useState<string | number>(1);
  const [searchText, setSearchText] = useState<string>('');
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

  let apiData: any = data;

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'INCOME',
      amount: `NGN ${apiData ? apiData?.total_income?.toLocaleString() : 0}`,
      percentage: ' 2.4%',
      type: 'profit',
      icon: <Income />,
    },
    {
      id: 2,
      title: 'EXPENSE',
      amount: `NGN ${apiData ? apiData?.total_expense?.toLocaleString() : 0}`,
      percentage: '1.2%',
      type: 'loss',
      icon: <Expense />,
    },
    {
      id: 3,
      title: 'NET PROFIT',
      amount: `NGN ${apiData ? apiData?.profit?.toLocaleString() : 0}`,
      percentage: '2.2%',
      type: 'profit',
      icon: <Net />,
    },
  ];
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

  let searchres = useSearch(debouncedValue).data;

  //move tab to income after getting response from search
  useEffect(() => {
    if (searchres && activeTab === 1) {
      setActiveTab(2);
    }
  }, [searchres]);

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
                <h3>INCOME</h3>
              </div>
              <div className=''>
                <h3>AMOUNT</h3>
              </div>
            </div>
            <div className='overview-scroll-container'>
              {!apiData ? (
                <div className='empty-state'>No data available</div>
              ) : (
                Object.keys(apiData?.income_by_group).map((groupName: any) => (
                  <div
                    className='income-expense-overview__statement-wrapper__content'
                    key={groupName}
                    onClick={() => {
                      navigate(
                        `/chart-of-account/view-profit-and-loss/${groupName}`
                      );
                      localStorage.setItem(
                        'singlePl',
                        JSON.stringify({
                          ...apiData?.income_by_group[groupName],
                          type: 'Income',
                        })
                      );
                    }}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left'>
                      <p>{groupName}</p>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>
                        NGN{' '}
                        {Number(
                          apiData?.income_by_group[groupName].balance
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>Total Income</h3>
              </div>
              <div className=''>
                <h3>NGN {apiData?.total_income?.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          <div style={{ width: '50%' }}>
            {' '}
            <div className='income-expense-overview__statement-wrapper__title'>
              <div className=''>
                <h3>EXPENSE</h3>
              </div>
              <div className=''>
                <h3>AMOUNT</h3>
              </div>
            </div>
            <div className='overview-scroll-container'>
              {!apiData ? (
                <div className='empty-state'>No data available</div>
              ) : (
                Object.keys(apiData?.expense_by_group)?.map(
                  (groupName: any) => (
                    <div
                      className='income-expense-overview__statement-wrapper__content'
                      key={groupName}
                      onClick={() => {
                        navigate(
                          `/chart-of-account/view-profit-and-loss/${groupName}`
                        );
                        localStorage.setItem(
                          'singlePl',
                          JSON.stringify({
                            ...apiData?.expense_by_group[groupName],
                            type: 'Expense',
                          })
                        );
                      }}
                    >
                      <div className='income-expense-overview__statement-wrapper__content__left'>
                        <p>{groupName}</p>
                      </div>
                      <div className='income-expense-overview__statement-wrapper__content__right'>
                        <p>
                          NGN{' '}
                          {Number(
                            apiData?.expense_by_group[groupName].balance
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>Total Expense</h3>
              </div>
              <div className=''>
                <h3>NGN {apiData?.total_expense?.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className='income-expense-overview__statement-wrapper__footer footer-final'>
          <p className='income-expense-overview__statement-wrapper__footer__heading'>
            Net Profit (Loss)
          </p>
          <p className='income-expense-overview__statement-wrapper__footer__bold-text'>
            NGN {apiData?.profit?.toLocaleString()}
          </p>
        </div>
        {/* <div style={{ paddingBottom: "10px" }}>
          <div className="income-expense-overview__statement-wrapper__total balance">
            <div style={{ display: "flex", gap: "377px" }}>
              <div className="">
                <h3>TOTAL ASSET</h3>
              </div>
              <div className="">
                <h3>NGN {apiData?.total_income?.toLocaleString()}</h3>
              </div>
            </div>
            <div style={{ display: "flex", gap: "150px" }}>
              <div className="">
                <h3>TOTAL LIABILITIES & SHAREHOLDERS’ EQUITY</h3>
              </div>
              <div className="">
                <h3>NGN {apiData?.total_expense?.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProfitAndLoss;
