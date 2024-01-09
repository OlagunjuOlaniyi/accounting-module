import React, { useState } from 'react';
import Table from '../../components/Table/Table';

import Dots from '../../icons/Dots';

import EditExpense from '../../components/Modals/IncomeAndExpense/EditExpense';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';

import { useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

import { useGetBankList } from '../../hooks/queries/banks';
import { useDeleteBank } from '../../hooks/mutations/bank';
import { useCurrency } from '../../context/CurrencyContext';

import BackupTableIcon from '../../icons/BackupTableIcon';
import RecordIcon from '../../icons/RecordIcon';
import RecordTransferIcon from '../../icons/RecordTransferIcon';
import AssetModal from '../../components/Modals/Asset/AssetModal';
import Header from '../../components/Header/Header';

const BankList = () => {
  const queryClient = useQueryClient();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [type, setType] = useState<
    | 'record_cash_deposit'
    | 'record_cash_withdrawal'
    | 'record_bank_withdrawal'
    | 'record_bank_deposit'
    | 'record_bank_transfer'
    | ''
  >('');

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
                <>
                  {/* <div
                    className='action__flex'
                    onClick={() => setType('record_cash_deposit')}
                  >
                    <RecordIcon />
                    <p>Record Cash Deposit</p>
                  </div>

                  <div
                    className='action__flex'
                    onClick={() => setType('record_cash_withdrawal')}
                  >
                    <BackupTableIcon />
                    <p>Record Cash Withdrawal</p>
                  </div> */}
                </>

                <>
                  <div
                    className='action__flex'
                    onClick={() => setType('record_bank_transfer')}
                  >
                    <RecordTransferIcon />
                    <p>Record Bank Transfer</p>
                  </div>

                  <div
                    className='action__flex'
                    onClick={() => setType('record_bank_deposit')}
                  >
                    <RecordIcon />

                    <p>Record Bank Deposit</p>
                  </div>
                  {/* <div
                    className='action__flex'
                    onClick={() => setType('record_bank_withdrawal')}
                  >
                    <BackupTableIcon />
                    <p>Record Bank Withdrawal</p>
                  </div> */}

                  {/* <div
                    className='action__flex'
                    onClick={() => setEditModal(true)}
                  >
                    <LeaderboardIcon />
                    <p>Record Bank Charges</p>
                  </div>
                  <div
                    className='action__flex'
                    onClick={() => setEditModal(true)}
                  >
                    <HouseIcon />
                    <p>Record Bank Interest</p>
                  </div> */}
                </>
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
        <p>
          {currency} {Number(value)?.toLocaleString()}
        </p>
      ),
    },

    {
      Header: 'Status',
      accessor: 'delete_status',

      Cell: ({ cell: { value } }: { cell: { value: boolean } }) => (
        <Badge value={value} />
      ),
    },
    {
      Header: 'Actions',
      accessor: (d: any) => `${d.id}`,
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
          deleteBtnText='Delete Bank Details'
          confirmationText='Are you sure you want to delete this bank record?'
          loading={deleteLoading}
        />
        <AssetModal
          modalIsOpen={type !== ''}
          closeModal={setType}
          type={type}
          bankId={selectedId}
        />
      </div>
    </div>
  );
};

export default BankList;
