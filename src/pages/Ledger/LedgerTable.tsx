import React, { useState } from 'react';
import Table from '../../components/Table/Table';

import Dots from '../../icons/Dots';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';
import EditExpense from '../../components/Modals/IncomeAndExpense/EditExpense';

import moment from 'moment';
import { useCurrency } from '../../context/CurrencyContext';

const LedgerTable = ({ data }: any) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const closeModal = () => {
    setDeleteModal(false);
    setEditModal(false);
  };

  //dots button component
  const DotsBtn = ({ value }: { value: string }) => {
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

                <div
                  className='action__flex'
                  onClick={() => setEditModal(true)}
                >
                  <Edit />
                  <p>Edit</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => setDeleteModal(true)}
                >
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

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={'generated-badge'}>Approved</div>;
  };

  //table header and columns
  const columns = [
    {
      Header: 'GL_CODE',
      accessor: 'transaction_ref',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ cell: { value } }: any) => (
        <p>
          {currency} {Number(value)?.toLocaleString()}
        </p>
      ),
    },

    {
      Header: 'Account',
      accessor: 'account',
      Cell: ({ cell: { value } }: any) => (
        <div className='d-flex'>
          <p>{value ? value : 'N/A'}</p>
        </div>
      ),
    },
    {
      Header: 'Opening Balance',
      accessor: 'opening_balance',
      Cell: ({ cell: { value } }: any) => (
        <div className='d-flex'>
          <p>{value ? value : 'N/A'}</p>
        </div>
      ),
    },

    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: ({ cell: { value } }: any) => <p>{moment(value).format('ll')}</p>,
    },

    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <DotsBtn value={value} />
      ),
    },
  ];

  return (
    <div>
      <div className='table_container'>
        <Table data={data} columns={columns} />

        <EditExpense
          modalIsOpen={editModal}
          closeModal={closeModal}
          selectedId={selectedId}
        />
      </div>
    </div>
  );
};

export default LedgerTable;
