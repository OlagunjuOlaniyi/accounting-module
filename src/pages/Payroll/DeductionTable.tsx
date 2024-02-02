import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';

import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';
import { PayrollResponse } from '../../types/payrollTypes';
import RunPayroll from '../../components/Modals/Payroll/RunPayroll';
import { useCurrency } from '../../context/CurrencyContext';

interface Iprops {
  filteredData?: any;
  isLoading: Boolean;
  searchRes: any;
}

const DeductionTable = ({ filteredData, searchRes, isLoading }: Iprops) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [runPayrollModalOpen, setPayrollModalOpen] = useState<boolean>(false);

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
                  onClick={() => navigate(`/payroll/${value}?type=deduction`)}
                >
                  <Visibility />
                  <p>View Deduction</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => {
                    setPayrollModalOpen(true);
                  }}
                >
                  <Visibility />
                  <p>Run Payroll</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => navigate(`/inventory/${value}?action=edit`)}
                >
                  <Edit />
                  <p>Edit</p>
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

  //table header and columns
  const columns = [
    {
      Header: 'PAYROLL NAME',
      accessor: 'name',
    },

    {
      Header: 'ASSIGNED STAFF',
      accessor: (d: any) => d?.payroll_staff_groups[0]?.staffs,
      Cell: ({ cell: { value } }: any) => {
        const visibleStaff = value?.slice(0, 2);
        const remainingCount = value?.length - visibleStaff?.length;

        return (
          <>
            {value?.length > 0 ? (
              <div className='flex gap-2 items-center'>
                {visibleStaff?.map((el: { name: string }, index: number) => (
                  <div
                    key={index}
                    className='rounded-2xl h-[25px] bg-[#E4EFF9] mb-3 flex items-center justify-center p-2'
                  >
                    <p>{el?.name}</p>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className='rounded-2xl h-[25px] mb-3 flex items-center justify-center p-2'>
                    <p>and {remainingCount} others</p>
                  </div>
                )}
              </div>
            ) : (
              <p>No staff selected</p>
            )}
          </>
        );
      },
    },

    {
      Header: 'TOTAL DEDUCTION',
      accessor: (d: any) => d?.total_deduction?.total,
      Cell: ({ cell: { value } }: any) => (
        <p>
          {currency} {Number(value).toLocaleString()}
        </p>
      ),
    },

    {
      Header: 'TOTAL GROSS AMOUNT',
      accessor: 'total_gross_amount',
      Cell: ({ cell: { value } }: any) => (
        <p>
          {currency} {Number(value).toLocaleString()}
        </p>
      ),
    },

    {
      Header: 'STATUS',
      accessor: 'payment_status',
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <Badge value={value} />
      ),
    },

    {
      Header: 'Actions',
      accessor: (d: any) => `${d.id}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/inventory/${value}?action=edit`)}
            >
              <Edit />
            </div>

            <DotsBtn value={value} />
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={apiData ? apiData : []} columns={columns} />
        )}
      </div>
      <RunPayroll
        id={selectedId}
        modalIsOpen={runPayrollModalOpen}
        closeModal={() => setPayrollModalOpen(false)}
      />
    </div>
  );
};

export default DeductionTable;
