import { useLocation } from 'react-router-dom';
import Table from '../../components/Table/Table';

import { useParams } from 'react-router';

import ChartofAccountWrapper from './ChartOfAccountWrapper';
import moment from 'moment';
import AddCircleBlue from '../../icons/AddCircleBlue';
import { replacePercent20WithSpaces } from '../../utilities';

const BalanceSheetType = () => {
  const { id } = useParams();

  const { transaction_types, type } = JSON.parse(
    localStorage.getItem('balanceSheet')!
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
      Header: 'DEBIT AMOUNT',
      accessor: (d: any) => d.amount,
      Cell: ({ cell: { value } }: { cell: { value: number } }) => (
        <p>
          {type === 'bl'
            ? `NGN ${Number(value).toLocaleString()}`
            : 'Not Available'}
        </p>
      ),
    },
    {
      Header: 'CREDIT AMOUNT',
      accessor: 'amount',
      Cell: ({ cell: { value } }: any) => (
        <p>
          {type === 'Income'
            ? `NGN ${Number(value).toLocaleString()}`
            : 'Not Available'}
        </p>
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
    <ChartofAccountWrapper id={`${replacePercent20WithSpaces(id || '')}`}>
      <div className='table_container'>
        <Table data={tableItems} columns={columns} />
      </div>
    </ChartofAccountWrapper>
  );
};

export default BalanceSheetType;
