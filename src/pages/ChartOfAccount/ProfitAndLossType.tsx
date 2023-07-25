import { useLocation } from 'react-router-dom';
import Table from '../../components/Table/Table';

import { useParams } from 'react-router';

import ChartofAccountWrapper from './ChartOfAccountWrapper';
import moment from 'moment';
import Addcircle from '../../icons/Addcircle';
import AddCircleBlue from '../../icons/AddCircleBlue';
import { replacePercent20WithSpaces } from '../../utilities';

const ProfitAndLossType = () => {
  const { id } = useParams();
  const location = useLocation();
  const { from } = location.state || {};

  const { transaction_types, type } = JSON.parse(
    localStorage.getItem('singlePl')!
  );
  let tableItems = transaction_types[`${id}`];

  //table header and columns
  const columns = [
    {
      Header: 'GL_CODE',
      accessor: (d: any) => d.transaction_type.account_code,
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
      Header: 'DESCRIPTION',
      accessor: 'description',
      Cell: ({ cell: { value } }: any) => <p> {value}</p>,
    },

    // {
    //   Header: 'TRANSACTION TYPE',
    //   accessor: 'transaction_type',
    //   Cell: ({ cell: { value } }: any) => <p>{value?.name}</p>,
    // },

    {
      Header: 'DEBIT BALANCE',
      accessor: (d: any) => d.amount,
      Cell: ({ cell: { value } }: any) => (
        <p>{type === 'Expense' ? `NGN ${value}` : 'Not Available'}</p>
      ),
    },
    {
      Header: 'CREDIT BALANCE',
      accessor: 'amount',
      Cell: ({ cell: { value } }: any) => (
        <p>{type === 'Income' ? `NGN ${value}` : 'Not Available'}</p>
      ),
    },

    {
      Header: 'ACTIONS',
      accessor: ' ',
      Cell: ({ cell: { value } }: any) => (
        <div className='add-transaction'>
          <AddCircleBlue />
          Add Transaction
        </div>
      ),
    },
  ];

  return (
    <ChartofAccountWrapper
      id={`${replacePercent20WithSpaces(
        from.replace('/chart-of-account/view-profit-and-loss/', '')
      )}/${replacePercent20WithSpaces(id || '')}`}
    >
      <div className='table_container'>
        <Table data={tableItems} columns={columns} />
      </div>
    </ChartofAccountWrapper>
  );
};

export default ProfitAndLossType;
