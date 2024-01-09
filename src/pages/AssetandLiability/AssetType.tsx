import Table from '../../components/Table/Table';

import { useParams } from 'react-router';
import AssetWrapper from './AssetWrapper';

import { replacePercent20WithSpaces } from '../../utilities';
import { useCurrency } from '../../context/CurrencyContext';
import BackupTableIcon from '../../icons/BackupTableIcon';
import RecordIcon from '../../icons/RecordIcon';
import RecordTransferIcon from '../../icons/RecordTransferIcon';
import { useState } from 'react';
import Dots from '../../icons/Dots';
import AssetModal from '../../components/Modals/Asset/AssetModal';

const AssetType = () => {
  const { id } = useParams();
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

  const { transaction_types, savedType } = JSON.parse(
    localStorage.getItem('balanceSheet')!
  );
  let tableItems = transaction_types[`${id}`];

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
      Header: 'TRANSACTION NAME',
      accessor: (d: any) => d?.acccount?.name,
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'TRANSACTION TYPE',
      accessor: 'transaction_type',
      Cell: ({ cell: { value } }: any) => <p>{value?.name}</p>,
    },
    {
      Header: 'TRANSACTION GROUP',
      accessor: 'transaction_group',
      Cell: ({ cell: { value } }: any) => <p>{value?.name}</p>,
    },

    {
      Header: 'AMOUNT',
      accessor: (d: any) => d.amount,
      Cell: ({ cell: { value } }: { cell: { value: number } }) => (
        <p>
          {savedType === 'bl'
            ? `${currency} ${Number(value).toLocaleString()}`
            : 'Not Available'}
        </p>
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
    
    <AssetWrapper id={`${replacePercent20WithSpaces(id || '')}`}>
      <div className='table_container'>
        <Table data={tableItems} columns={columns} />
      </div>
      <AssetModal modalIsOpen={type !== ''} closeModal={setType} type={type} />
    </AssetWrapper>
  );
};

export default AssetType;
