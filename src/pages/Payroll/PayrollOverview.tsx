import React, { useEffect } from 'react';
import BarChart from '../../components/Charts/BarChart';
import CustomLegend from '../../components/CustomLegend/CustomLegend';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import Expense from '../../icons/Expense';
import Income from '../../icons/Income';
import Net from '../../icons/Net';
import { useGetIncomeAndExpenseOverview } from '../../hooks/queries/overview';

import { Ioverview } from '../../types/types';
import { mergeMonths } from '../../utilities';
import { useCurrency } from '../../context/CurrencyContext';
import Button from '../../components/Button/Button';
import {
  useGetPayroll,
  useGetPayrollOverview,
} from '../../hooks/queries/payroll';

interface Iprops {
  filteredData?: any;
  filteredLoading: Boolean;
}
const PayrollOverview = ({ filteredData, filteredLoading }: Iprops) => {
  const { data: payroll } = useGetPayroll();
  const { data, refetch, isLoading } = useGetPayrollOverview(
    payroll ? payroll[0]?.id : ''
  );

  useEffect(() => {
    if (payroll && payroll.length > 0) {
      refetch();
    }
  }, [payroll]);

  //const { isLoading, data } = useGetIncomeAndExpenseOverview();
  const { currency } = useCurrency();

  interface ICardDetails extends ICardProps {
    id: number;
  }

  let apiData: any = filteredData ? filteredData : data;

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'PAYMENT DUE DATE',
      amount: `SEP 25 2021`,
      percentage: '',
      type: '',
      icon: <Income />,
    },
    {
      id: 2,
      title: 'NUMBER OF STAFF',
      amount: `1000`,
      percentage: '',
      type: '',
      icon: <Expense />,
    },
    {
      id: 3,
      title: 'NET AMOUNT',
      amount: `${currency} 120,000`,
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='income-expense-overview'>
          {/* <div className='flex justify-between'>
            <h2 className='font-bold'>
              September 2021 Payroll is due on Aug 25, 2021
            </h2>
            <div className='flex gap-4 mb-10'>
              <button className='ie_overview__top-level__filter-download'>
                {' '}
                <p>View Payroll</p>
              </button>
              <div className='ie_overview__top-level__btn-wrap'>
                <Button
                  btnText='Run Payroll'
                  btnClass='btn-primary'
                  width='214px'
                  icon={''}
                  disabled={false}
                  onClick={() => {}}
                />
              </div>
            </div>
          </div> */}
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

          <div className='income-expense-overview__chart-wrapper'>
            <div className='income-expense-overview__chart-wrapper__top'>
              <p>Report</p>
              <div>
                <CustomLegend
                  data={[
                    { id: 1, label: 'Allowance', bgColor: '#7380F6' },
                    { id: 2, label: 'Deduction', bgColor: '#CD4F56' },
                  ]}
                />
              </div>
            </div>
            <BarChart data={barData} />
          </div>
        </div>
      )}
    </>
  );
};

export default PayrollOverview;
