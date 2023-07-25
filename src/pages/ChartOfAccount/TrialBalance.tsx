import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';
import Dot from '../../icons/Dot';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';
import { useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { useGetIncomes } from '../../hooks/queries/incomes';
import { useDeleteIncome } from '../../hooks/mutations/incomes';
import EditIncome from '../../components/Modals/IncomeAndExpense/EditIncome';
import { IexpenseRes } from '../../types/expenseTypes';
import { Ioverview } from '../../types/types';
import OverviewCard, {
  ICardProps,
} from '../../components/OverviewCard/OverviewCard';
import Asset from '../../icons/Asset';
import Liability from '../../icons/Liability';
import Equity from '../../icons/Equity';
import Net from '../../icons/Net';
import TotalCredit from '../../icons/TotalCredit';
import TotalDebit from '../../icons/TotalDebit';
import { useGetTrialBalance } from '../../hooks/queries/chartOfAccount';
import { removeLastItem } from '../../utilities';

const TrialBalance = () => {
  interface ICardDetails extends ICardProps {
    id: number;
  }

  //get incomes
  const { data, isLoading } = useGetTrialBalance();

  //let modifiedArray = removeLastItem(data);

  const totalDebit = data ? data[data.length - 1]?.debit_balance : 0;
  const totalCredit = data ? data[data.length - 1]?.credit_balance : 0;

  const cardDetails: ICardDetails[] = [
    {
      id: 1,
      title: 'TOTAL DEBIT',
      amount: `NGN ${totalDebit?.toLocaleString()}`,
      percentage: '2.4%',
      type: 'profit',
      icon: <TotalDebit />,
    },
    {
      id: 2,
      title: 'TOTAL CREDIT',
      amount: `NGN ${totalCredit?.toLocaleString()}`,
      percentage: '1.2%',
      type: 'loss',
      icon: <TotalCredit />,
    },
  ];

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

  //delete transaction
  const { mutate, isLoading: deleteLoading } = useDeleteIncome();

  const deleteTransaction = () => {
    mutate(selectedId, {
      onSuccess: (res) => {
        queryClient.setQueryData<any>(
          [`incomes-single-${selectedId}`],
          (prev: any) => {
            return prev;
          }
        );

        queryClient.invalidateQueries({
          queryKey: `incomes`,
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
                  onClick={() => navigate(`/income/${value}`)}
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
      Header: 'ACCOUNT CODE',
      accessor: 'account_code',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'LEDGER',
      accessor: 'ledger',
      Cell: ({ cell: { value } }: any) => (
        <div className='d-flex'>
          <Dot type={'income'} />
          <p>{value}</p>
        </div>
      ),
    },
    {
      Header: 'CREDIT BALANCE',
      accessor: 'credit_balance',
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },

    {
      Header: 'DEBIT BALANCE',
      accessor: 'debit_balance',
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },
    {
      Header: 'TRANSACTION DATE',
      accessor: 'transaction_date',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
  ];

  return (
    <div>
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

      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={data.slice(0, -1)} columns={columns} />
        )}

        <EditIncome
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

export default TrialBalance;
