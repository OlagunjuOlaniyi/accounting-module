import React, { useMemo, useState } from 'react';
import Table from '../../components/Table/Table';
import { useGetExpenses } from '../../hooks/queries/expenses';
import Dots from '../../icons/Dots';
import Dot from '../../icons/Dot';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';

const ExpenseTable = () => {
  const navigate = useNavigate();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | string>(0);
  //get expenses
  const { data, isLoading } = useGetExpenses();

  const Badge = ({ value }: { value: boolean }) => {
    return <div className={'generated-badge'}>Approved</div>;
  };
  console.log(dropdownActions);
  //dots button component
  const DotsBtn = ({ value }: { value: string | number }) => {
    //get single product/add on data

    return (
      <div className='action-wrapper'>
        <button
          onClick={() => {
            setSelectedId(value);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: 'unset', cursor: 'pointer' }}
        >
          <Dots />

          {dropdownActions && value === selectedId && (
            <>
              <div className='action'>
                <div
                  className='action__flex'
                  onClick={() => navigate(`/expense/${value}`)}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div className='action__flex'>
                  <Edit />
                  <p>Edit</p>
                </div>

                <div className='action__flex'>
                  <Delete />
                  <p>Delete</p>
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    );
  };

  //table header and columns
  const columns = [
    {
      Header: 'Transaction Type',
      accessor: 'transaction_type',
      Cell: ({ cell: { value } }: any) => <p>{value?.name}</p>,
    },

    {
      Header: 'Transaction Group',
      accessor: 'transaction_group',
      Cell: ({ cell: { value } }: any) => <p>{value?.name}</p>,
    },

    {
      Header: 'Account',
      accessor: 'account',
      Cell: ({ cell: { value } }: any) => (
        <div className='d-flex'>
          <Dot type={value?.toLowerCase()} />
          <p>{value}</p>
        </div>
      ),
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },

    {
      Header: 'Approval status',
      accessor: 'active',

      Cell: ({ cell: { value } }: { cell: { value: boolean } }) => (
        <Badge value={value} />
      ),
    },

    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ cell: { value } }: { cell: { value: number | string } }) => (
        <DotsBtn value={value} />
      ),
    },
  ];
  return (
    <div>
      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data?.data ? data?.data : []} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
