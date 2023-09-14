import { useState } from 'react';
import Table from '../../components/Table/Table';
import Dots from '../../icons/Dots';
import Visibility from '../../icons/Visibility';
import Delete from '../../icons/Delete';
import Edit from '../../icons/Edit';
import { useNavigate } from 'react-router';
import { useQueryClient } from 'react-query';

import { useGetBills } from '../../hooks/queries/billsAndFeesMgt';
import Send from '../../icons/Send';
import Duplicate from '../../icons/Duplicate';
import Unsend from '../../icons/Unsend';
import ViewPayment from '../../icons/ViewPayment';
import {
  useDeleteBill,
  useDuplicateBill,
} from '../../hooks/mutations/billsAndFeesMgt';
import toast from 'react-hot-toast';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';

interface Iprops {
  filteredData?: any;
  filteredLoading: Boolean;
  searchRes: any;
}

const Overview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

  //get incomes
  const { data, isLoading } = useGetBills();

  //badge component on table
  const Badge = ({ value }: { value: boolean }) => {
    return <div className={`${value}-generated-badge`}>{value}</div>;
  };

  const { mutate } = useDuplicateBill();
  const { mutate: deleteBillFn, isLoading: deleteLoading } = useDeleteBill();

  const duplicate = () => {
    mutate(selectedId, {
      onSuccess: (res) => {
        close();
        toast.success('Bill duplicated successfully');
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
      },

      onError: (e) => {
        toast.error('Error duplicating bill');
      },
    });
  };
  const deleteBill = () => {
    deleteBillFn(selectedId, {
      onSuccess: (res) => {
        close();
        toast.success('Bill deleted successfully');
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });
        setDeleteConfirmation(false);
      },

      onError: (e) => {
        toast.error('Error deleting bill');
      },
    });
  };

  const getClasses = () => {
    let filtered = data.filter((d: any) => Number(d.id) === Number(selectedId));
    localStorage.setItem('classes', JSON.stringify(filtered[0].classes));
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
                <div
                  className='action__flex'
                  onClick={() => {
                    navigate(`/bill/${id}`);
                    getClasses();
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => navigate(`/update-bill/${id}`)}
                >
                  <Edit />
                  <p>Edit</p>
                </div>

                <div className='action__flex'>
                  <Send />
                  <p>Send Bill</p>
                </div>

                <div className='action__flex' onClick={() => duplicate()}>
                  <Duplicate />
                  <p>Duplicate</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => toggleDeleteConfirmation()}
                >
                  <Delete />
                  <p>Delete</p>
                </div>
              </div>
            </>
          )}

          {dropdownActions && id === selectedId && status === 'sent' && (
            <>
              {/* {billStatus} */}
              <div className='action'>
                <div
                  className='action__flex'
                  onClick={() => {
                    navigate(`/bill/${id}`);
                    getClasses();
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div className='action__flex'>
                  <Duplicate />
                  <p>Duplicate</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => navigate(`/payment-status/${id}`)}
                >
                  <ViewPayment />
                  <p>View Payment Status</p>
                </div>

                <div className='action__flex'>
                  <Unsend />
                  <p>Unsend Bill</p>
                </div>

                <div className='action__flex'>
                  <Delete />
                  <p>Delete</p>
                </div>
              </div>
            </>
          )}

          {dropdownActions && id === selectedId && status === 'unsent' && (
            <>
              {/* {billStatus} */}
              <div className='action'>
                <div
                  className='action__flex'
                  onClick={() => {
                    navigate(`/bill/${id}`);
                    getClasses();
                  }}
                >
                  <Visibility />
                  <p>View</p>
                </div>

                <div
                  className='action__flex'
                  onClick={() => navigate(`/update-bill/${id}`)}
                >
                  <Edit />
                  <p>Edit</p>
                </div>

                <div className='action__flex' onClick={() => duplicate()}>
                  <Duplicate />
                  <p>Duplicate</p>
                </div>

                <div className='action__flex'>
                  <Unsend />
                  <p>Resend Bill</p>
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
          {value.map((item: any) => (
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
        <p>NGN {Number(value)?.toLocaleString()}</p>
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
              <button
                style={{ all: 'unset' }}
                onClick={() => navigate(`/update-bill/${value.split(',')[0]}`)}
              >
                <Edit />
              </button>
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
          <Table data={data ? data : []} columns={columns} />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}
      </div>
      <DeleteConfirmation
        modalIsOpen={deleteConfirmation}
        close={toggleDeleteConfirmation}
        confirmationText={'This action cannot be reversed'}
        deleteFn={deleteBill}
        deleteBtnText={'Delete Bill'}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Overview;
