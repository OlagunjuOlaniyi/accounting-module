import React, { useMemo, useState } from 'react';
import Table from '../../components/Table/Table';
import { useGetExpenses } from '../../hooks/queries/expenses';
import Dots from '../../icons/Dots';
import Dot from '../../icons/Dot';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';
import EditExpense from '../../components/Modals/IncomeAndExpense/EditExpense';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';

import { useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Ioverview } from '../../types/types';
import { useGetBankList } from '../../hooks/queries/banks';
import { useDeleteBank } from '../../hooks/mutations/bank';

interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
  searchRes: any;
}

const BankList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const closeModal = () => {
    setDeleteModal(false);
    setEditModal(false);
  };

  //get expenses
  const { data, isLoading } = useGetBankList();

  let sortedData = data?.data?.sort((a: any, b: any) => b.id - a.id);

  //delete transaction
  const { mutate, isLoading: deleteLoading } = useDeleteBank();

  const deleteTransaction = () => {
    mutate(selectedId, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: `list-of-banks`,
        });

        toast.success('Bank deleted successfully');
        closeModal();
      },

      onError: (e) => {
        toast.error('Error deleting ');
      },
    });
  };

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={'generated-badge'}>Active</div>;
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

  //table header and columns
  const columns = [
    {
      Header: 'Account Name',
      accessor: 'account_name',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'Account number',
      accessor: 'account_number',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'Bank Balance',
      accessor: 'bank_balance',
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },

    {
      Header: 'Status',
      accessor: 'delete_status',

      Cell: ({ cell: { value } }: { cell: { value: boolean } }) => (
        <Badge value={value} />
      ),
    },
  ];

  return (
    <div>
      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data?.data ? sortedData : []} columns={columns} />
        )}

        <EditExpense
          modalIsOpen={editModal}
          closeModal={closeModal}
          selectedId={selectedId}
        />

        <DeleteConfirmation
          deleteFn={deleteTransaction}
          modalIsOpen={deleteModal}
          close={closeModal}
          deleteBtnText='Delete Bank Details'
          confirmationText='Are you sure you want to delete this bank record?'
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default BankList;
