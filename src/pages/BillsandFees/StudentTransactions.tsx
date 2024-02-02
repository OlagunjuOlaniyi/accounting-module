import { useEffect, useState } from 'react';
import { useViewStudentTransactions } from '../../hooks/mutations/billsAndFeesMgt';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '../../components/Button/Button';
import Addcircle from '../../icons/Addcircle';
import Filter from '../../icons/Filter';
import Export from '../../icons/Export';
import Header from '../../components/Header/Header';
import Search from '../../icons/Search';
import Table from '../../components/Table/Table';
import moment from 'moment';

const StudentTransactions = () => {
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  let bill_name = queryParams.get('bill_name');

  const { mutate, isLoading } = useViewStudentTransactions();

  const [apiData, setApiData] = useState<any>({
    total_outstanding_all: 0,
    total_overpayment: 0,
    transactions: [],
    student_details: {
      firstname: '',
      last_name: '',
      admission_number: '',
    },
  });

  const submit = () => {
    let dataToSend = {
      admission_number: id,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        setApiData(res);
      },

      onError: (e) => {
        toast.error(e?.response.data.message || 'error occured');
      },
    });
  };

  useEffect(() => {
    submit();
  }, [id]);

  //table header and columns
  const columns = [
    {
      Header: 'STUDENT NAME',
      accessor: 'class_name',
      Cell: ({ cell: { value } }: any) => (
        <p>
          {' '}
          {apiData?.student_details?.firstname}{' '}
          {apiData?.student_details?.last_name}
        </p>
      ),
    },
    {
      Header: 'BILL NAME',
      accessor: 'feetype_name',
      Cell: ({ cell: { value } }: any) => <p>{bill_name}</p>,
    },

    {
      Header: 'TOTAL AMOUNT',
      accessor: 'total_amount',
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },

    {
      Header: 'AMOUNT PAID',
      accessor: 'amount_paid',
      Cell: ({ cell: { value } }: any) => (
        <p>NGN {Number(value)?.toLocaleString()}</p>
      ),
    },
    {
      Header: 'STATUS',
      accessor: 'payment_status',
      Cell: ({ cell: { value } }: any) => (
        <div className={`${value?.toLowerCase()} payment-status`}>
          {value?.replace('_', ' ')}
        </div>
      ),
    },
    {
      Header: 'DATE OF TRANSACTION',
      accessor: 'created_at',
      Cell: ({ cell: { value } }: any) => <p>{moment(value)?.format('lll')}</p>,
    },
  ];

  return (
    <div>
      <Header />
      <p className='sm-test' onClick={() => navigate(-1)}>
        Bills and Fees Management /
        <b style={{ color: '#010c15' }}>{bill_name}</b>
      </p>
      <div style={{ margin: '32px 0' }}>
        <h3 style={{ fontSize: '36px', color: '#010C15' }}>
          {apiData?.student_details?.firstname}{' '}
          {apiData?.student_details?.last_name}
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
            onClick={() => {
              navigate('/CreateBill');
            }}
          />
        </div>
      </div>

      <div className='record-payment-header'>
        <h3>STUDENT NAME</h3>
        <h3>ADMISSION NUMBER</h3>

        <h3>AMOUNT OWED</h3>
        <h3>AMOUNT PAID</h3>
        <h3>AMOUNT OVERPAID</h3>
      </div>

      <div className='student-transactions-overview'>
        <h3>
          {apiData?.student_details?.firstname}{' '}
          {apiData?.student_details?.last_name}
        </h3>
        <h3>{apiData?.student_details?.admission_number}</h3>
        <h3>
          NGN {Number(apiData?.transactions[0]?.amount_owed).toLocaleString()}
        </h3>
        <h3>
          NGN {Number(apiData?.transactions[0]?.amount_paid).toLocaleString()}
        </h3>{' '}
        <h3>NGN {Number(apiData?.total_overpayment).toLocaleString()}</h3>
      </div>

      <div className='table_container'>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table data={apiData?.transactions || []} columns={columns} />
        )}

        {/* <Draft data={data} columns={columns} isLoading={isLoading}/> */}
      </div>
    </div>
  );
};

export default StudentTransactions;
