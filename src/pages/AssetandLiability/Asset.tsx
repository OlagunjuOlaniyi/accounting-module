import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';

import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';
import { useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

import EditIncome from '../../components/Modals/IncomeAndExpense/EditIncome';

import { Ioverview } from '../../types/types';
import { useGetAssets } from '../../hooks/queries/chartOfAccount';
import EditAsset from '../../components/Modals/EquityAssetAndLiability/EditAsset';
import { useDeleteAsset } from '../../hooks/mutations/chartofAccounts';
import RecordIcon from '../../icons/RecordIcon';
import BackupTableIcon from '../../icons/BackupTableIcon';
import RecordTransferIcon from '../../icons/RecordTransferIcon';
import LeaderboardIcon from '../../icons/LeaderboardIcon';
import HouseIcon from '../../icons/HouseIcon';
import AssetModal from '../../components/Modals/Asset/AssetModal';
import { useCurrency } from '../../context/CurrencyContext';

interface Iprops {
  filteredData?: Ioverview;
  filteredLoading: Boolean;
  searchRes: any;
}

const AssetTable = ({ filteredData, searchRes }: Iprops) => {
  const navigate = useNavigate();
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

  //get incomes
  const { data, isLoading } = useGetAssets();
  let apiData: any = searchRes?.incomes
    ? searchRes?.incomes
    : filteredData
    ? filteredData?.incomes
    : data?.data;
  let sortedData = apiData?.sort((a: any, b: any) => b.id - a.id);

  //delete transaction
  const { mutate, isLoading: deleteLoading } = useDeleteAsset();

  const deleteTransaction = () => {
    mutate(selectedId, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: `assets`,
        });
        toast.success('Transaction deleted successfully');
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
    let splitedValue = value.split(',');
    let id = splitedValue[0];
    let transaction_type: string = splitedValue[1];
    return (
      <div className='action-wrapper'>
        <button
          onClick={() => {
            setSelectedId(id);
            setDropdownActions(!dropdownActions);
          }}
          style={{ all: 'unset', cursor: 'pointer' }}
        >
          <Dots />

          {dropdownActions && id === selectedId && (
            <>
              <div className='action'>
                <div
                  className='action__flex'
                  onClick={() => navigate(`/income/${id}`)}
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
                {transaction_type?.toLowerCase() === 'cash at hand' && (
                  <>
                    <div
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
                    </div>
                  </>
                )}

                {(transaction_type?.toLowerCase() === 'savings' ||
                  transaction_type?.toLowerCase() === 'current') && (
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
                    <div
                      className='action__flex'
                      onClick={() => setType('record_bank_withdrawal')}
                    >
                      <BackupTableIcon />
                      <p>Record Bank Withdrawal</p>
                    </div>

                    <div
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
                    </div>
                  </>
                )}

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
      Header: 'Transaction Name',
      accessor: 'name',
      Cell: ({ cell: { value } }: any) => <p>{value ? value : 'N/A'}</p>,
    },
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
          <div className='asset'></div>
          <p>{'Asset'}</p>
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
      accessor: (d: any) => `${d.id},${d.transaction_type?.name}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
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
          <Table data={data?.data ? sortedData : []} columns={columns} />
        )}

        <EditIncome
          modalIsOpen={editModal}
          closeModal={closeModal}
          selectedId={selectedId}
        />

        <EditAsset modalIsOpen={false} closeModal={undefined} />

        <DeleteConfirmation
          deleteFn={deleteTransaction}
          modalIsOpen={deleteModal}
          close={closeModal}
          deleteBtnText='Delete Transaction'
          confirmationText='Are you sure you want to delete this transaction?'
          loading={deleteLoading}
        />

        <AssetModal
          modalIsOpen={type !== ''}
          closeModal={setType}
          type={type}
        />
      </div>
    </div>
  );
};

export default AssetTable;
