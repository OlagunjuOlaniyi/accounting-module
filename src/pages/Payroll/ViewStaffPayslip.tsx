import React, { useEffect, useState } from 'react';
import { useGetSchoolDetails } from '../../hooks/queries/SchoolQuery';
import { useParams, useNavigate } from 'react-router';
import BackArrow from '../../icons/BackArrow';

import { useGetStaffPayslip } from '../../hooks/mutations/inventory';
import toast from 'react-hot-toast';

const ViewStaffPayslip = () => {
  const navigate = useNavigate();
  const { data: schoolData } = useGetSchoolDetails();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let payrollId = queryParams.get('id');

  const { mutate } = useGetStaffPayslip(payrollId || '');

  const [apiData, setApiData] = useState({
    staff: { name: '' },
    modifiers: [
      {
        type: '',
        amount: 0,
      },
    ],
    gross_amount: 0,
    net_amount: 0,
  });

  const submit = () => {
    let dataToSend = {
      staff: { name: id },
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

  const allowanceArray = apiData?.modifiers?.filter(
    (item) => item?.type === 'ALLOWANCE'
  );
  const totalAllowanceAmount = allowanceArray.reduce(
    (total, item) => total + parseFloat(item?.amount),
    0
  );

  const deductionArray = apiData?.modifiers?.filter(
    (item) => item?.type === 'DEDUCTION'
  );

  const totalDeductionAmount = deductionArray.reduce(
    (total, item) => total + parseFloat(item?.amount),
    0
  );
  return (
    <div>
      <div className='single-expense-wrapper__top__breadcrumbs mb-5'>
        <BackArrow />
        <span
          className='single-expense-wrapper__top__breadcrumbs__inactive'
          onClick={() => navigate('/payroll')}
        >
          Payroll Management / {id} /
        </span>
      </div>
      <div className='bills_overview'>
        <h2 className='bills_overview__title'>{id}</h2>
        <h1 className='bills_overview__approval'>APPROVAL STATUS: Pending</h1>
        <h1 className='bills_overview__status'>STATUS: Draft</h1>
      </div>

      <div className='bills_schoolInfo'>
        <div className='bills_schoolInfo__logo'>
          <img src={schoolData && schoolData?.data[0]?.arm?.logo} alt='' />
        </div>
        <div className='bills_schoolInfo__details'>
          {schoolData && schoolData?.data[0]?.arm?.name}

          <p className='bills_schoolInfo__details__email'>
            Email: {schoolData && schoolData?.data[0]?.arm?.email}
          </p>
        </div>
      </div>

      <div className='income-expense-overview__statement-wrapper'>
        <div className='income-expense-flex' style={{ width: '100%' }}>
          <div style={{ width: '50%' }}>
            {' '}
            <div className='income-expense-overview__statement-wrapper__title'>
              <div className=''>
                <h3>ALLOWANCE</h3>
              </div>
              <div className=''>
                <h3>AMOUNT</h3>
              </div>
            </div>
            <div className='overview-scroll-container'>
              {allowanceArray?.length === 0 ? (
                <div className='empty-state'>No data available</div>
              ) : (
                allowanceArray?.map((el: any) => (
                  <div
                    className='income-expense-overview__statement-wrapper__content'
                    key={el.id}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left'>
                      <p>{el.name}</p>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>NGN {Number(el.amount).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>TOTAL ALLOWANCE</h3>
              </div>
              <div className=''>
                <h3>NGN {totalAllowanceAmount?.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            {' '}
            <div className='income-expense-overview__statement-wrapper__title'>
              <div className=''>
                <h3>DEDUCTION</h3>
              </div>
              <div className=''>
                <h3>AMOUNT</h3>
              </div>
            </div>
            <div className='overview-scroll-container'>
              {deductionArray?.length === 0 ? (
                <div className='empty-state'>No data available</div>
              ) : (
                deductionArray?.map((el: any) => (
                  <div
                    className='income-expense-overview__statement-wrapper__content'
                    key={el.id}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left'>
                      <p>{el?.name}</p>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>NGN {Number(el?.amount).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>TOTAL DEDUCTION</h3>
              </div>
              <div>
                <h3>NGN {totalDeductionAmount?.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className='income-expense-overview__statement-wrapper__footer footer-final'>
          <div className='flex justify-between w-[50%]'>
            <p className='income-expense-overview__statement-wrapper__footer__heading'>
              GROSS AMOUNT
            </p>
            <p className='pr-5'>
              NGN {Number(apiData?.gross_amount)?.toLocaleString()}
            </p>
          </div>

          <div className='flex justify-between w-[50%]'>
            <p className='income-expense-overview__statement-wrapper__footer__heading pl-5'>
              NET AMOUNT
            </p>
            <p> NGN {Number(apiData?.net_amount)?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStaffPayslip;
