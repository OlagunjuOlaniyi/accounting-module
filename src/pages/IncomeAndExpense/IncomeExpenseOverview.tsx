import React from 'react';
import BarChart from '../../components/Charts/BarChart';
import CustomLegend from '../../components/CustomLegend/CustomLegend';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import Expense from '../../icons/Expense';
import Income from '../../icons/Income';
import Net from '../../icons/Net';
import { useGetIncomeAndExpenseOverview } from '../../hooks/queries/overview';
import Spinner from '../../components/Spinner/Spinner';
import { Ioverview } from '../../types/types';
import { mergeMonths } from '../../utilities';
import { useCurrency } from '../../context/CurrencyContext';
import Header from '../../components/Header/Header';

interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
}
const IncomeExpenseOverview = ({ filteredData }: Iprops) => {
  const { isLoading, data } = useGetIncomeAndExpenseOverview();
  const { currency } = useCurrency();

  interface ICardDetails extends ICardProps {
    id: number;
  }

  let apiData: any = filteredData ? filteredData : data;

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'INCOME',
      amount: `${currency} ${
        apiData ? apiData?.total_income?.toLocaleString() : 0
      }`,
      percentage: '',
      type: '',
      icon: <Income />,
    },
    {
      id: 2,
      title: 'EXPENSE',
      amount: `${currency} ${
        apiData ? apiData?.total_expense?.toLocaleString() : 0
      }`,
      percentage: '',
      type: '',
      icon: <Expense />,
    },
    {
      id: 3,
      title: 'NET PROFIT (LOSS)',
      amount: `${currency} ${apiData ? apiData?.profit?.toLocaleString() : 0}`,
      percentage: '',
      //type: apiData?.profit?.toLocaleString().includes('-') ? 'loss' : 'profit',
      type: '',
      icon: <Net />,
    },
  ];

  const unorderedLabels = mergeMonths(
    apiData?.income_by_month || [],
    apiData?.expense_by_month || []
  );

  const labels: string[] = unorderedLabels.sort((a, b) => {
    // Define a mapping of month names to their numerical representation
    const monthMap: { [key: string]: number } = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    // Compare the numerical representations of the months
    return monthMap[a] - monthMap[b];
  });

  const barData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: apiData?.income_by_month?.map((a: any) => a.income),
        backgroundColor: '#43F226',
        borderRadius: 40,
        barThickness: 45,
      },
      {
        label: 'Expense',
        data: apiData?.expense_by_month?.map((a: any) => a.expense),
        backgroundColor: '#FE5050',
        borderRadius: 40,
        barThickness: 45,
      },
    ],
  };

  return (
    <>
      <div className='income-expense-overview'>
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

        <div className='income-expense-overview__chart-wrapper'>
          <div className='income-expense-overview__chart-wrapper__top'>
            <p>Report</p>
            <div>
              <CustomLegend
                data={[
                  { id: 1, label: 'Income', bgColor: '#43F226' },
                  { id: 2, label: 'Expense', bgColor: '#FE5050' },
                ]}
              />
            </div>
          </div>
          <BarChart data={barData} />
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className='income-expense-overview__statement-wrapper'>
            <h2 className='income-expense-overview__statement-wrapper__heading'>
              Income Statement
            </h2>
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
                  {apiData?.incomes?.length === 0 ? (
                    <div className='empty-state'>No data available</div>
                  ) : (
                    apiData?.incomes?.map((el: any) => (
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
                    <h3>Total Income</h3>
                  </div>
                  <div className=''>
                    <h3>
                      {currency} {apiData?.total_income?.toLocaleString()}
                    </h3>
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
                  {apiData?.expenses?.length === 0 ? (
                    <div className='empty-state'>No data available</div>
                  ) : (
                    apiData?.expenses?.map((el: any) => (
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
                    <h3>Total Expense</h3>
                  </div>
                  <div className=''>
                    <h3>
                      {currency} {apiData?.total_expense?.toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className='income-expense-overview__statement-wrapper__footer footer-final'>
              <p className='income-expense-overview__statement-wrapper__footer__heading'>
                Net Profit (Loss)
              </p>
              <p className='income-expense-overview__statement-wrapper__footer__bold-text'>
                {currency} {apiData?.profit?.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IncomeExpenseOverview;
