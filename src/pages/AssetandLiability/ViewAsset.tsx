import { useParams } from 'react-router';
import AssetWrapper from './AssetWrapper';
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

const ViewAsset = () => {
  const { id } = useParams();
  const { currency } = useCurrency();

  const { transaction_types, type } = JSON.parse(
    localStorage.getItem('balanceSheet')!
  );

  let tableItems: any[] = transaction_types
    ? Object.values(transaction_types).flat()
    : [];

  const groupedData = groupTransactionsByTransactionTypeName(tableItems);

  const resultArray: tableData[] = groupedData.map((data: any) => ({
    id: tableItems[0].transaction_type.account_code,
    transaction_type: data.name,
    transaction_group: id,
    created_at: tableItems[0].created_at,
    amount: data.amount,
    name: tableItems[0].name,
  }));

  //table header and columns
  const columns = [
    // {
    //   Header: 'TRANSACTION NAME',
    //   accessor: 'name',
    //   Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    // },

    {
      Header: 'TRANSACTION TYPE',
      accessor: 'transaction_type',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: 'TRANSACTION GROUP',
      accessor: 'transaction_group',
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
    <AssetWrapper id={id} breadcrumbSub='Asset'>
      <div className='table_container'>
        <TableProfitLoss
          data={resultArray}
          columns={columns}
          route='asset-and-liability/type-asset'
        />
      </div>
    </AssetWrapper>
  );
};

export default ViewAsset;
