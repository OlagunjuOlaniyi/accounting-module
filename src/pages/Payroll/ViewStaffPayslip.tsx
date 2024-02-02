import React, { useEffect, useState } from 'react';
import { useGetSchoolDetails } from '../../hooks/queries/SchoolQuery';
import { useParams, useNavigate } from 'react-router';
import BackArrow from '../../icons/BackArrow';

import {
  useGetStaffPayslip,
  useUpdateStaffPayslip,
} from '../../hooks/mutations/inventory';
import toast from 'react-hot-toast';
import { useCurrency } from '../../context/CurrencyContext';
import DeleteRed from '../../icons/DeleteRed';
import ToggleChecked from '../../icons/ToggleChecked';
import ToggleUnchecked from '../../icons/ToggleUnchecked';
import { PayrollGroupModifier } from '../../types/types';
import AddCircleBlue from '../../icons/AddCircleBlue';

const ViewStaffPayslip = () => {
  const navigate = useNavigate();
  const { data: schoolData } = useGetSchoolDetails();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let payrollId = queryParams.get('id');

  const { mutate } = useGetStaffPayslip(payrollId || '');
  const { mutate: send, isLoading } = useUpdateStaffPayslip(payrollId || '');
  const { currency } = useCurrency();

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
  const [toBeDeleted, setToBeDeleted] = useState<number[]>([]);

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

  const updatePayslip = () => {
    let dataToSend = {
      staff: { name: id },
      ...(payrollGroups.length > 0 && { added_modifiers: payrollGroups }),
      ...(toBeDeleted.length > 0 && { removed_modifiers: toBeDeleted }),
    };

    send(dataToSend, {
      onSuccess: (res) => {
        toast.success('Payslip updated successfully');
        window.location.reload();
      },

      onError: (e) => {
        toast.error(e?.response.data.message || 'error occured');
      },
    });
  };

  const allowanceArray = apiData?.modifiers?.filter(
    (item) => item?.type === 'ALLOWANCE'
  );
  const totalAllowanceAmount = allowanceArray.reduce(
    (total, item:any) => total + parseFloat(item?.amount),
    0
  );

  const deductionArray = apiData?.modifiers?.filter(
    (item) => item?.type === 'DEDUCTION'
  );

  const totalDeductionAmount = deductionArray.reduce(
    (total, item:any) => total + parseFloat(item?.amount),
    0
  );

  const [payrollGroups, setPayrollGroups] = useState<PayrollGroupModifier[]>(
    []
  );

  const addModifier = (type: string) => {
    setPayrollGroups((prevGroups) => {
      const newModifier: PayrollGroupModifier = {
        id: Math.floor(Math.random() * 906),
        modifier_name: '',
        modifier_type: type,
        is_percentage: false,
        amount: 0,
        linking_percentage: '',
        percentage: 0,
      };

      // Use a shallow copy of the previous groups and add the new modifier
      const newGroups = [...prevGroups, newModifier];

      return newGroups;
    });
  };

  const handleModifierNameChange = (groupId: number, value: string) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = prevGroups.map((group) =>
        group.id === groupId ? { ...group, modifier_name: value } : group
      );
      return newGroups;
    });
  };

  const deleteModifier = (groupId: number) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = prevGroups.filter((group) => group.id !== groupId);
      return newGroups;
    });
  };

  const handleIsPercentageChange = (groupId: number) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, is_percentage: !group.is_percentage }
          : group
      );
      return newGroups;
    });
  };

  const handleLinkingPercentageChange = (groupId: number, value: string) => {
    setPayrollGroups((prevGroups:any) => {
      const newGroups = prevGroups.map((group: { id: number; }) =>
        group.id === groupId ? { ...group, linking_percentage: value } : group
      );
      return newGroups;
    });
  };

  const handlePercentageChange = (groupId: number, value: number) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = prevGroups.map((group) =>
        group.id === groupId ? { ...group, percentage: value } : group
      );
      return newGroups;
    });
  };

  const handleAmountChange = (groupId: number, value: number) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = prevGroups.map((group) =>
        group.id === groupId ? { ...group, amount: value } : group
      );
      return newGroups;
    });
  };

  const getModifierNames = (groupIndex: number) => {
    return payrollGroups.map((modifier) => modifier.modifier_name);
  };

  useEffect(() => {}, []);

  const calculatePercentage = (groupId: number): number => {
    const modifier = payrollGroups.find((group) => group.id === groupId);

    if (modifier) {
      const modifierNames = getModifierNames(groupId);
      const linkingPercentage = modifier.linking_percentage;

      if (linkingPercentage && modifierNames.includes(linkingPercentage)) {
        const linkedModifier = payrollGroups.find(
          (m) => m.modifier_name === linkingPercentage
        );

        let percentage = modifier.percentage || 0;
        let amount = linkedModifier?.amount || 0;

        if (linkedModifier && linkedModifier.amount) {
          const newGroups = [...payrollGroups];
          const updatedGroups = newGroups.map((group) => {
            if (group.id === groupId) {
              // Create a new object with updated amount
              return { ...group, amount: (amount / 100) * percentage };
            }
            // Return the unchanged object
            return group;
          });

          setPayrollGroups(updatedGroups);

          return (amount / 100) * percentage;
        }
      }
    }

    return 0;
  };

  const renderModifiers = (group: any, groupIndex: number) => {
    const modifierNames = getModifierNames(groupIndex);
    return (
      <div className='bg-[#F6F6F6] py-5 pr-7'>
        <div
          key={groupIndex}
          className='px-7 flex mb-6 gap-7 w-full items-center'
        >
          <div className='w-full flex flex-col gap-2'>
            <input
              placeholder='Name'
              type='text'
              className='input-field'
              value={group.modifier_name}
              onChange={(e) =>
                handleModifierNameChange(groupIndex, e.target.value)
              }
            />
          </div>

          {group.is_percentage ? (
            <>
              <div className='w-full flex flex-col gap-2'>
                <input
                  className='input-field'
                  type='number'
                  placeholder='percentage (%) amount'
                  value={group.percentage}
                  onChange={(e) =>
                    handlePercentageChange(
                      groupIndex,
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <p className='pt-4'>of</p>
              <div className='w-full flex flex-col gap-2'>
                <select
                  className='input-field'
                  value={group.linking_percentage || ''}
                  onChange={(e) =>
                    handleLinkingPercentageChange(groupIndex, e.target.value)
                  }
                  onBlur={() => calculatePercentage(groupIndex)}
                >
                  <option value=''>Select Payroll Type</option>
                  {modifierNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='w-full flex flex-col gap-2'>
                <input
                  placeholder='Amount'
                  className='input-field'
                  type='number'
                  value={
                    payrollGroups.find((el) => el.id === groupIndex)?.amount
                  }
                  disabled
                />
              </div>
            </>
          ) : (
            <div className='w-full flex flex-col gap-2'>
              <input
                placeholder='amount'
                className='input-field'
                type='number'
                value={group.amount}
                onChange={(e) =>
                  handleAmountChange(
                    groupIndex,

                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
          )}
          <button className='pt-4' onClick={() => deleteModifier(groupIndex)}>
            <DeleteRed />
          </button>
        </div>
        <div
          className='flex justify-end items-center gap-2 cursor-pointer'
          onClick={() => handleIsPercentageChange(groupIndex)}
        >
          {group.is_percentage ? <ToggleChecked /> : <ToggleUnchecked />}
          <p>Percentage</p>
        </div>
      </div>
    );
  };

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
      <p style={{ fontSize: '14px', margin: '10px 0' }}>
        Note: To delete an item, click on the multiple items to want to delete,
        then click on save payroll when done.
      </p>
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
                    className={`income-expense-overview__statement-wrapper__content ${
                      toBeDeleted.includes(el.id) ? 'bg-gray-s' : ''
                    }`}
                    key={el.id}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left flex gap-3 '>
                      <p>{el.name}</p>

                      <button
                        onClick={() => {
                          setToBeDeleted((prevState) => {
                            const isItemInArray = prevState.includes(el.id);

                            if (isItemInArray) {
                              return prevState.filter((id) => id !== el.id);
                            } else {
                              return [...prevState, el.id];
                            }
                          });
                        }}
                      >
                        <DeleteRed />
                      </button>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>
                        {currency} {Number(el.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {payrollGroups
              .filter((group) => group.modifier_type === 'ALLOWANCE')
              .map((group:any, groupIndex) => {
                return (
                  <div
                    key={groupIndex}
                    className='mt-10x'
                    style={{ borderRight: '1px solid rgba(1, 12, 21, 0.1)' }}
                  >
                    {renderModifiers(group, group?.id)}
                  </div>
                );
              })}
            <div className='bills_form__other_form__addons'>
              <p className='pl-5 pb-5' onClick={() => addModifier('ALLOWANCE')}>
                <AddCircleBlue />
                Add Allowance
              </p>
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>TOTAL ALLOWANCE</h3>
              </div>
              <div className=''>
                <h3>
                  {currency} {totalAllowanceAmount?.toLocaleString()}
                </h3>
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
                    className={`income-expense-overview__statement-wrapper__content ${
                      toBeDeleted.includes(el.id) ? 'bg-gray-s' : ''
                    }`}
                    key={el.id}
                  >
                    <div className='income-expense-overview__statement-wrapper__content__left flex gap-3'>
                      <p>{el?.name}</p>
                      <button
                        onClick={() => {
                          setToBeDeleted((prevState) => {
                            const isItemInArray = prevState.includes(el.id);

                            if (isItemInArray) {
                              return prevState.filter((id) => id !== el.id);
                            } else {
                              return [...prevState, el.id];
                            }
                          });
                        }}
                      >
                        <DeleteRed />
                      </button>
                    </div>
                    <div className='income-expense-overview__statement-wrapper__content__right'>
                      <p>
                        {currency} {Number(el?.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {payrollGroups
              .filter((group) => group.modifier_type === 'DEDUCTION')
              .map((group:any, groupIndex) => (
                <div
                  key={groupIndex}
                  className='mt-10x'
                  style={{ borderRight: '1px solid rgba(1, 12, 21, 0.1)' }}
                >
                  {renderModifiers(group, group?.id)}
                </div>
              ))}
            <div className='bills_form__other_form__addons'>
              <p className='pl-5 pb-5' onClick={() => addModifier('DEDUCTION')}>
                <AddCircleBlue />
                Add Deduction
              </p>
            </div>
            <div className='income-expense-overview__statement-wrapper__total'>
              <div className=''>
                <h3>TOTAL DEDUCTION</h3>
              </div>
              <div>
                <h3>
                  {currency} {totalDeductionAmount?.toLocaleString()}
                </h3>
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
              {currency} {Number(apiData?.gross_amount)?.toLocaleString()}
            </p>
          </div>

          <div className='flex justify-between w-[50%]'>
            <p className='income-expense-overview__statement-wrapper__footer__heading pl-5'>
              NET AMOUNT
            </p>
            <p>
              {' '}
              {currency} {Number(apiData?.net_amount)?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className='bills_form__btns'>
        <button
          style={{
            background: 'transparent',
            padding: '16px 20px',
            borderRadius: '5px',
          }}
          onClick={() => navigate('/payroll')}
        >
          Cancel
        </button>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
          <button
            disabled={isLoading}
            style={{
              background: '#439ADE',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '5px',
            }}
            onClick={() => updatePayslip()}
          >
            {isLoading ? 'Saving...' : 'Save Payroll'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStaffPayslip;
