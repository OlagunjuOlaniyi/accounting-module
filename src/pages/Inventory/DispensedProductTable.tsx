import React, { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';
import Dot from '../../icons/Dot';
import Visibility from '../../icons/Visibility';

import { useNavigate } from 'react-router';

import { useCurrency } from '../../context/CurrencyContext';
import moment from 'moment';

interface Iprops {
  filteredData?: any[];
  isLoading: Boolean;
  searchRes: any;
}

const DispensedProductTable = ({
  filteredData,
  searchRes,
  isLoading,
}: Iprops) => {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');

  let apiData: any = searchRes ? searchRes : filteredData ? filteredData : [];

  //badge component on table
  const Badge = ({ value }: { value: string }) => {
    return (
      <div
        className={`${
          value?.toLowerCase() === 'available'
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
                  onClick={() => navigate(`/inventory/${value}`)}
                >
                  <Visibility />
                  <p>View Product</p>
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
      Header: 'PRODUCT ID',
      accessor: 'id',
    },

    {
      Header: 'PRODUCT NAME',
      accessor: (d: any) => `${d?.product?.name}`,
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'DISPENSED QUANTITY',
      accessor: 'sizes',
      Cell: ({ cell: { value } }: any) => (
        <div>
          {value?.map((el: { size: string; quantity: number }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <p>Size: {el?.size}</p>
              <p>Quantity: {el?.quantity}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      Header: 'DATE',
      accessor: 'created_at',
      Cell: ({ cell: { value } }: any) => <p>{moment(value).format('lll')}</p>,
    },

    {
      Header: 'STUDENTS',
      accessor: 'students',
      Cell: ({ cell: { value } }: any) => {
        const visibleStudents = value?.slice(0, 2);
        const remainingCount = value?.length - visibleStudents?.length;

        return (
          <>
            {value?.length > 0 ? (
              <div className='flex gap-2 items-center'>
                {visibleStudents?.map((el: { name: string }, index: number) => (
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
              <p>No student selected</p>
            )}
          </>
        );
      },
    },

    {
      Header: 'Actions',
      accessor: (d: any) => `${d?.product?.id}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: 'flex', gap: '16px' }}>
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
    </div>
  );
};

export default DispensedProductTable;
