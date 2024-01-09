import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';
import Dot from '../../icons/Dot';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate, useParams } from 'react-router';

import Dispense from '../../icons/Dispense';

import { AllowanceOrDeduction } from '../../types/payrollTypes';

import RemitAllowance from '../../components/Modals/Payroll/RemitAllowance';
import RemitDeductions from '../../components/Modals/Payroll/RemitDeductions';
import { useCurrency } from '../../context/CurrencyContext';

interface Iprops {
  filteredData?: AllowanceOrDeduction;
  isLoading: Boolean;
  searchRes: any;
  type: string;
}

const ViewPayrollTable = ({
  filteredData,
  searchRes,
  isLoading,
  type,
}: Iprops) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [remitModalOpen, setRemitModalOpen] = useState<string>('');

  let apiData: any = searchRes ? searchRes : filteredData ? filteredData : [];

  //badge component on table
  const Badge = ({ value }: { value: string }) => {
    return (
      <div
        className={`${
          value?.toLowerCase() === 'paid'
            ? 'generated-badge'
            : value?.toLowerCase()
        }`}
      >
        {value?.toLowerCase()}
      </div>
    );
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
                  onClick={() => navigate(`/payroll/payslip/${value}?id=${id}`)}
                >
                  <Visibility />
                  <p>View Payslip</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => navigate(`/inventory/${value}?action=edit`)}
                >
                  <Edit />
                  <p>Update</p>
                </div>
                <div
                  className='action__flex'
                  onClick={() => setRemitModalOpen(type?.toLowerCase())}
                >
                  <Dispense />
                  <p>Remit {type}</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => navigate(`/inventory/${value}?action=delete`)}
                >
                  <Delete />
                  <p>Discard</p>
                </div>
              </div>
            </>
          )}
        </button>
      </div>
    );
  };

  const uniqueDetailNames = Array.from(
    new Set(
      filteredData
        ?.filter((el) => el.name !== '')
        ?.flatMap((item: any) =>
          item?.details.map((detail: { name: string }) => detail?.name)
        )
    )
  );

  // Organize data into columns based on detail names
  const columns = React.useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      ...uniqueDetailNames.map((detailName) => ({
        Header: detailName,
        accessor: (row) => {
          const amount = row.details.find(
            (detail: { name: string }) => detail.name === detailName
          )?.amount;

          return amount
            ? `${currency} ${Number(amount).toLocaleString()}`
            : 'N/A';
        },
      })),
      {
        Header: 'STATUS',
        accessor: 'status',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <Badge value={value} />
        ),
      },
      {
        Header: 'Actions',
        accessor: (d: any) => `${d.name}`,
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/payroll/payslip/${value}`)}
              >
                <Edit />
              </div>

              <DotsBtn value={value} />
            </div>
          </>
        ),
      },
    ],
    [uniqueDetailNames]
  );

  return (
    <div>
      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={apiData ? apiData : []} columns={columns} />
        )}
      </div>

      <RemitAllowance
        id={id}
        closeModal={() => setRemitModalOpen('')}
        modalIsOpen={remitModalOpen === 'allowance'}
      />
      <RemitDeductions
        id={id}
        closeModal={() => setRemitModalOpen('')}
        modalIsOpen={remitModalOpen === 'deduction'}
      />
    </div>
  );
};

export default ViewPayrollTable;
