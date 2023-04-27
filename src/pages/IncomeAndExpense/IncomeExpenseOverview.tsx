import React from 'react';
import BarChart from '../../components/Charts/BarChart';
import CustomLegend from '../../components/CustomLegend/CustomLegend';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import { expense, income } from '../../data';
import Expense from '../../icons/Expense';
import Income from '../../icons/Income';
import Net from '../../icons/Net';

const IncomeExpenseOverview = () => {
  interface ICardDetails extends ICardProps {
    id: number;
  }
  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'INCOME',
      amount: 'NGN 120,000',
      percentage: '2.4%',
      type: 'profit',
      icon: <Income />,
    },
    {
      id: 2,
      title: 'EXPENSE',
      amount: 'NGN 700,000',
      percentage: '1.2%',
      type: 'loss',
      icon: <Expense />,
    },
    {
      id: 3,
      title: 'NET PROFIT (LOSS)',
      amount: 'NGN 119,300',
      percentage: '2.2%',
      type: 'profit',
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
            <>
              {income.map((el) => (
                <div
                  className='income-expense-overview__statement-wrapper__content'
                  key={el.id}
                >
                  <div className='income-expense-overview__statement-wrapper__content__left'>
                    <p>{el.title}</p>
                  </div>
                  <div className='income-expense-overview__statement-wrapper__content__right'>
                    <p>{el.amount}</p>
                  </div>
                </div>
              ))}
            </>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>TOTAL INCOME</h3>
              </div>
              <div className=''>
                <h3>NGN 5,820,000</h3>
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
            <>
              {expense.map((el) => (
                <div
                  className='income-expense-overview__statement-wrapper__content'
                  key={el.id}
                >
                  <div className='income-expense-overview__statement-wrapper__content__left'>
                    <p>{el.title}</p>
                  </div>
                  <div className='income-expense-overview__statement-wrapper__content__right'>
                    <p>{el.amount}</p>
                  </div>
                </div>
              ))}
            </>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>TOTAL EXPENSE</h3>
              </div>
              <div className=''>
                <h3>NGN 5,820,000</h3>
              </div>
            </div>
          </div>
        </div>

        <div className='income-expense-overview__statement-wrapper__footer footer-final'>
          <p className='income-expense-overview__statement-wrapper__footer__heading'>
            NET PROFIT (LOSS)
          </p>
          <p className='income-expense-overview__statement-wrapper__footer__bold-text'>
            NGN 549,000
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseOverview;
