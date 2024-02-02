import { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useQueryClient } from 'react-query';
import { useGetBills } from '../../hooks/queries/billsAndFeesMgt';
import { filterByStatus } from '../../services/utils';
import Send from '../../icons/Send';
import Duplicate from '../../icons/Duplicate';
import { useCurrency } from '../../context/CurrencyContext';
import Header from '../../components/Header/Header';
interface Iprops {
  filteredData?: any;
  filteredLoading: Boolean;
  searchRes: any;
}
const Draft = ({filteredLoading, filteredData, searchRes }: Iprops) => {
  const queryClient = useQueryClient();
  const { currency } = useCurrency();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  let billStatus: string = 'draft';

  const { data, isLoading } = useGetBills();

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={`${value}-generated-badge`}>{value}</div>;
  };

  //dots button component
  const DotsBtn = ({ value }: { value: string }) => {
    let splitedValue = value.split(',');
    let id = splitedValue[0];
    let status: string = splitedValue[1];

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

          {dropdownActions && id === selectedId && status === 'draft' && (
            <>
              {/* {billStatus} */}
              <div className='action'>
                <div className='action__flex'>
                  <Visibility />
                  <p>View</p>
                </div>

                <div className='action__flex'>
                  <Edit />
                  <p>Edit</p>
                </div>

                <div className='action__flex'>
                  <Send />
                  <p>Send Bill</p>
                </div>

                <div className='action__flex'>
                  <Duplicate />
                  <p>Duplicate</p>
                </div>

                <div className='action__flex'>
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
      Header: 'Bill Name',
      accessor: 'bill_name',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: 'Assigned Class',
      accessor: 'classes',
      Cell: ({ cell: { value } }: any) => (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          {value?.map((item: any) => (
            <div
              style={{
                background: '#E4EFF9',
                padding: '2px 12px 2px 12px',
                borderRadius: '12px',
              }}
            >
              {item.class_name}
            </div>
          ))}
        </div>
      ),
    },

    {
      Header: 'Total Student',
      accessor: 'total_students',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'Total Amount',
      accessor: 'total_amount',
      Cell: ({ cell: { value } }: any) => (
        <p>
          {currency} {Number(value)?.toLocaleString()}
        </p>
      ),
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ cell: { value } }: any) => <Badge value={value} />,
    },
    {
      Header: 'Actions',
      accessor: (d: any) => `${d.id},${d.status}`,
      Cell: ({ cell: { value } }: { cell: { value: string } }) => (
        <>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['draft', 'unsent'].includes(value.split(',')[1].toLowerCase()) ? (
              <Edit />
            ) : (
              ''
            )}
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
          <Table
            data={data ? filterByStatus(data, billStatus) : []}
            columns={filterByStatus(data, billStatus).length > 0 ? columns : []}
          />
        )}
      </div>
    </div>
  );
};

export default Draft;
