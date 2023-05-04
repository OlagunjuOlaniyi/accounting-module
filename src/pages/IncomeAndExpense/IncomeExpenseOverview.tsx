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

interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
}
const IncomeExpenseOverview = ({ filteredData, filteredLoading }: Iprops) => {
  const { isLoading, data } = useGetIncomeAndExpenseOverview();
  interface ICardDetails extends ICardProps {
    id: number;
  }

  let apiData: any = filteredData ? filteredData : data;

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'INCOME',
      amount: `NGN ${apiData ? apiData?.total_income?.toLocaleString() : 0}`,
      percentage: '2.4%',
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
      title: 'NET PROFIT (LOSS)',
      amount: `NGN ${apiData ? apiData?.profit?.toLocaleString() : 0}`,
      percentage: '2.2%',
      type: apiData?.profit?.toLocaleString().includes('-') ? 'loss' : 'profit',
      icon: <Net />,
    },
  ];

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const barData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: [100, 400, 600, 200, 700, 300, 400, 200, 254, 100, 433, 546],
        backgroundColor: '#43F226',
        borderRadius: 40,
        barThickness: 45,
      },
      {
        label: 'Expense',
        data: [100, 200, 500, 200, 500, 400, 600, 200, 900, 300, 500, 100],
        backgroundColor: '#FE5050',
        borderRadius: 40,
        barThickness: 45,
      },
    ],
  };
  return (
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
                  <h3>TOTAL INCOME</h3>
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
                  <h3>TOTAL EXPENSE</h3>
                </div>
                <div className=''>
                  <h3>NGN {apiData?.total_expense?.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className='income-expense-overview__statement-wrapper__footer footer-final'>
            <p className='income-expense-overview__statement-wrapper__footer__heading'>
              NET PROFIT (LOSS)
            </p>
            <p className='income-expense-overview__statement-wrapper__footer__bold-text'>
              NGN {apiData?.profit?.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeExpenseOverview;
