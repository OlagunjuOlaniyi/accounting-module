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

import Button from '../../components/Button/Button';
import Export from '../../icons/Export';
import Addcircle from '../../icons/Addcircle';
import Filter from '../../icons/Filter';
import Search from '../../icons/Search';

const PaymentStatus = () => {
  const navigate = useNavigate();

  const [dropdownActions, setDropdownActions] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const toggleDeleteConfirmation = () => {
    setDeleteConfirmation(!deleteConfirmation);
  };

  //get incomes
  const { data, isLoading } = useGetBills();

  const bills_data = [
    {
      id: 1,
      class_name: 'JSS 1A',
      total_student: 20,
      fully_paid: 5,
      not_paid: 16,
      over_paid: 20,
      partly_paid: 11,
      actions: '',
    },
    {
      id: 2,
      class_name: 'JSS 1B',
      total_student: 30,
      fully_paid: 7,
      not_paid: 6,
      over_paid: 22,
      partly_paid: 7,
      actions: '',
    },
  ];

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
                <div
                  className='action__flex'
                  onClick={() => {
                    navigate(`/bill/${id}`);
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

                <div className='action__flex'>
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
      Header: 'CLASS NAME',
      accessor: 'class_name',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },
    {
      Header: 'TOTAL STUDENT',
      accessor: 'total_student',
    },

    {
      Header: 'Fully Paid',
      accessor: 'fully_paid',
      Cell: ({ cell: { value } }: any) => <p>{value}</p>,
    },

    {
      Header: 'NOT PAID',
      accessor: 'not_paid',
    },
    {
      Header: 'OVER PAID',
      accessor: 'over_paid',
    },
    {
      Header: 'PARTLY PAID',
      accessor: 'partly_paid',
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
      <div style={{ margin: '32px 0' }}>
        <h3 style={{ fontSize: '36px', color: '#010C15' }}>
          First term 2020/2021 Bill Payment Status
        </h3>
      </div>

      <div className='ie_overview__top-level'>
        <div className='ie_overview__top-level__search'>
          {' '}
          <Search />
          <input
            placeholder='Search by bill name, student name, admission no, class, parent phone no'
            className='ie_overview__top-level__search__input'
          />
        </div>

        <button className='ie_overview__top-level__filter-date' disabled>
          {' '}
          <Filter />
          <p>Filter</p>
        </button>

        <button className='ie_overview__top-level__filter-download'>
          {' '}
          <Export />
          <p>Download</p>
        </button>

        <div className='ie_overview__top-level__btn-wrap'>
          <Button
            btnText='Create Bill'
            btnClass='btn-primary'
            width='214px'
            icon={<Addcircle />}
            disabled={false}
            onClick={function (): void {
              throw new Error('Function not implemented.');
            }} //onClick={() => setShowActions(!showActions)}
          />
        </div>
      </div>
      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={bills_data} columns={columns} />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}
      </div>
    </div>
  );
};

export default PaymentStatus;
