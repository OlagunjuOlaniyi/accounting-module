import { useParams } from 'react-router';
import ChartofAccountWrapper from './ChartOfAccountWrapper';
import moment from 'moment';

import { groupTransactionsByTransactionTypeName } from '../../utilities';
import TableProfitLoss from '../../components/Table/TableProfitLoss';
import { useCurrency } from '../../context/CurrencyContext';

type tableData = {
  id: string;
  created_at: string;
  amount: number;
  transaction_type: any;
};

const ViewBalanceSheet = () => {
  const { id } = useParams();
  const { currency } = useCurrency();

  const { transaction_types, type } = JSON.parse(
    localStorage.getItem('balanceSheet')!
  );

  let tableItems: any[] = transaction_types
    ? Object.values(transaction_types).flat()
    : [];

  const groupedData = groupTransactionsByTransactionTypeName(tableItems);

  const resultArray: tableData[] = groupedData.map((data : any, index:any) => ({
    id: tableItems[0].transaction_type.account_code,
    transaction_type: data.name,
    created_at: tableItems[0].created_at,
    amount: data.amount,
  }));

  //table header and columns
  const columns = [
    {
      Header: 'GL_CODE',
      accessor: 'id',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'ACCOUNT TYPE',
      accessor: 'transaction_type',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: 'TRANSACTION DATE',
      accessor: 'created_at      ',
      Cell: ({ cell: { value } }: any) => (
        <p>
          {' '}
          <b>{moment(value).format('ll')}</b>
        </p>
      ),
    },

    {
      Header: 'DEBIT BALANCE',
      accessor: (d: any) => d.amount,
      Cell: ({ cell: { value } }: { cell: { value: number } }) => (
        <p>
          {type === 'bl'
            ? `${currency} ${value.toLocaleString()}`
            : 'Not Available'}
        </p>
      ),
    },
    {
      Header: 'CREDIT BALANCE',
      accessor: 'amount',
      Cell: ({ cell: { value } }: { cell: { value: number } }) => (
        <p>
          {type === 'Income'
            ? `${currency} ${value.toLocaleString()}`
            : 'Not Available'}
        </p>
      ),
    },
  ];

  return (
    <ChartofAccountWrapper id={id} breadcrumbSub='Balance Sheet'>
      <div className='table_container'>
        <TableProfitLoss
          data={resultArray}
          columns={columns}
          route='chart-of-account/type-balance-sheet'
        />
      </div>
    </ChartofAccountWrapper>
  );
};

export default ViewBalanceSheet;
