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
import { useDeleteExpense } from '../../hooks/mutations/expenses';
import { useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Ioverview } from '../../types/types';
import { useCurrency } from '../../context/CurrencyContext';
import Header from '../../components/Header/Header';

interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
  searchRes: any;
}

const ExpenseTable = ({ filteredData, searchRes }: Iprops) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const closeModal = () => {
    setDeleteModal(false);
    setEditModal(false);
  };

  //get expenses
  const { data, isLoading } = useGetExpenses();
  let apiData: any = searchRes?.expenses
    ? searchRes?.expenses
    : filteredData
    ? filteredData?.expenses
    : data?.data;
  let sortedData = apiData?.sort((a: any, b: any) => b.id - a.id);

  //delete transaction
  const { mutate, isLoading: deleteLoading } = useDeleteExpense();

  const deleteTransaction = () => {
    mutate(selectedId, {
      onSuccess: (res) => {
        queryClient.setQueryData<any>(
          [`expenses-single-${selectedId}`],
          (prev: any) => {
            return prev;
          }
        );

        queryClient.invalidateQueries({
          queryKey: `expenses`,
        });
        toast.success('Transaction deleted successfully');
        navigate('/income-and-expense');
        closeModal();
      },

      onError: (e) => {
        toast.error('Error deleting transaction');
      },
    });
  };

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={'generated-badge'}>Approved</div>;
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
          <Dot type={'expense'} />
          <p>{'Expense'}</p>
        </div>
      ),
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
      Header: 'Approval status',
      accessor: 'active',

      Cell: ({ cell: { value } }: { cell: { value: boolean } }) => (
        <Badge value={value} />
      ),
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
      <Header />
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
          deleteBtnText='Delete Transaction'
          confirmationText='Are you sure you want to delete this transaction?'
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default ExpenseTable;
