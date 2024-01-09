import { useNavigate, useParams } from 'react-router';
import ViewPayment from '../../icons/ViewPayment';
import './BillsandFees.scss';
import { useGetSchoolDetails } from '../../hooks/queries/SchoolQuery';
import Dots from '../../icons/Dots';
import Export from '../../icons/Export';
import Header from '../../components/Header/Header';
import FeeItem from '../../components/FeeItem/FeeItem';
import { useGetStudentsBills } from '../../hooks/queries/billsAndFeesMgt';
import TextInput from '../../components/Input/TextInput';
import { useState } from 'react';
import Cash from '../../icons/Cash';
import Bank from '../../icons/Bank';
import Credit from '../../icons/Credit';
import {
  useRecordPayment,
  useSendReminder,
} from '../../hooks/mutations/billsAndFeesMgt';
import toast from 'react-hot-toast';

const RecordPayment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);

  let bill_name = queryParams.get('bill_name');

  const { data: schoolData } = useGetSchoolDetails();

  const { data } = useGetStudentsBills(id || '');

  let bills_and_fees = JSON.parse(localStorage.getItem('bills_and_fees') || '');

  const [fields, setFields] = useState({
    payment_method: '',
    amount_paid: '',
  });

  const handleChange = (evt: any) => {
    const value = evt.target.value;

    setFields({
      ...fields,
      [evt.target.name]: value
        .replace(/,/g, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    });
  };

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
  };

  const transformedArray = data?.bills?.map((item: any, index: number) => {
    const feeType = index + 1;
    return {
      student_payment_id: item.fees[bill_name || '']?.payment_id,
      fee_type: feeType,
      bill_id: bills_and_fees?.bill_id,

      student: data?.student_details,
      owner: bills_and_fees?.owner,
      channel: 'Online Payment',
      user: null,
      fee_name: item.fees[bill_name || '']?.fee_type_name,
      mandatory: item.fees[bill_name || '']?.mandatory,
      discount: item.fees[bill_name || '']?.has_discount,
      fee_amount: item.fees[bill_name || '']?.fee_amount,
      discount_amount: item.fees[bill_name || '']?.total_discount_amount,
    };
  });
  const { mutate, isLoading } = useRecordPayment();

  const submit = () => {
    const updatedArray = transformedArray.map((item: any) => ({
      ...item,
      amount_paid: fields?.amount_paid.replace(/,/g, ''),
      payment_method: fields?.payment_method?.props?.children[1],
    }));

    mutate(
      { payments: updatedArray },
      {
        onSuccess: (res) => {
          console.log(res);
          close();
          toast.success(res?.detail);

          setFields({ ...fields });
          // navigate('/bills-fees-management');
        },

        onError: (e) => {
          toast.error('Error recording payment');
        },
      }
    );
  };

  const { mutate: sendReminder, isLoading: sendLoading } = useSendReminder(
    id || ''
  );
  const onSendReminder = () => {
    let dataToSend = {};

    sendReminder(dataToSend, {
      onSuccess: (res) => {
        toast.success(res.detail);
      },

      onError: (e) => {
        toast.error(e?.response.data.message || 'error occured');
      },
    });
  };

  return (
    <div>
      <Header />
      <p
        className='sm-test'
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        Bills and Fees Management /
        <b style={{ color: '#010c15' }}>{bill_name}</b>
      </p>
      <div
        className='bills_overview'
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <h2 className='bills_overview__title'>{bill_name}</h2>
          <h1 className='bills_overview__approval'>
            APPROVAL STATUS: Approved
          </h1>
          <h1 className={`bills_overview__status `}>{`STATUS: `}</h1>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px 12px 16px',
              borderRadius: '4px',
              border: '1px solid #E4EFF9',
            }}
          >
            <span>
              <Export />
            </span>
            Download
          </button>

          <button
            disabled={sendLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px 10px 16px',
              borderRadius: '4px',
              background: '#439ADE',
              color: 'white',
              width: '185px',
            }}
            onClick={() => onSendReminder()}
          >
            <span>
              <ViewPayment />
            </span>
            {sendLoading ? 'Sending...' : 'Send Reminder'}
          </button>

          <Dots />
        </div>
      </div>

      <div className='bills_schoolInfo'>
        <div className='bills_schoolInfo__logo'>
          <img src={schoolData && schoolData?.data[0]?.arm?.logo} alt='' />
        </div>
        <div className='bills_schoolInfo__details'>
          {schoolData && schoolData?.data[0]?.arm?.name}
          <br /> {bill_name}
          <p className='bills_schoolInfo__details__email'>
            Email: {schoolData && schoolData?.data[0]?.arm?.email}
          </p>
        </div>
      </div>

      <div className='record-payment-header'>
        <h3>FEE TYPE</h3>
        <h3>DISCOUNT</h3>
        <h3>REASON FOR DISCOUNT</h3>
        <h3>AMOUNT</h3>
        <h3>TOTAL AMOUNT</h3>
      </div>
      {transformedArray?.map((el: any, index: number) => (
        <FeeItem
          key={index}
          name={el?.fee_name}
          mandatory={el?.mandatory}
          discount={el?.discount}
          amount={el?.fee_amount}
          discount_amount={el?.discount_amount}
        />
      ))}
      <div className='record-payment-footer'>
        <h3>TOTAL BILL AMOUNT</h3>
        <h3>NGN {Number(data?.total_outstanding_balance)?.toLocaleString()}</h3>
      </div>
      <div className='record-payment-amount-paid'>
        <h3>AMOUNT PAID</h3>
        <TextInput
          type={'text'}
          name={'amount_paid'}
          handleChange={handleChange}
          fieldClass={'input-field'}
          errorClass={''}
          errorMessage={''}
          label={''}
          id={''}
          placeholder={'Amount paid'}
          onSelectValue={selectValue}
          isSearchable={false}
          handleSearchValue={() => {}}
          searchValue={''}
          handleBlur={undefined}
          multi={false}
          toggleOption={() => {}}
          selectedValues={undefined}
          value={fields.amount_paid}
        />
      </div>
      <div className='record-payment-amount-paid'>
        <h3>PAYMENT METHOD</h3>
        <TextInput
          type={'dropdown'}
          name={'payment_method'}
          handleChange={handleChange}
          fieldClass={''}
          errorClass={''}
          errorMessage={''}
          label={''}
          id={''}
          placeholder={''}
          onSelectValue={selectValue}
          isSearchable={false}
          handleSearchValue={() => {}}
          searchValue={''}
          handleBlur={undefined}
          multi={false}
          value={fields.payment_method}
          toggleOption={() => {}}
          selectedValues={undefined}
          options={[
            {
              id: 1,
              name: (
                <div className='payment-method-dropdown'>
                  <Cash />
                  Cash
                </div>
              ),
            },
            {
              id: 2,
              name: (
                <div className='payment-method-dropdown'>
                  <Bank />
                  Bank
                </div>
              ),
            },
            {
              id: 3,
              name: (
                <div className='payment-method-dropdown'>
                  <Credit />
                  Credit
                </div>
              ),
            },
          ]}
        />
      </div>

      <div
        className='record-payment-footer'
        style={{
          border: 'none',
          borderTop: '1px solid rgba(1, 12, 21, 0.1)',
          marginTop: '32px',
          paddingTop: '32px',
        }}
      >
        <h3>Cancel</h3>
        <button
          disabled={isLoading}
          onClick={submit}
          style={{
            background: '#439ADE',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '5px',
          }}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default RecordPayment;
