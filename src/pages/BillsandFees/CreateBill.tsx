import { useEffect, useState } from 'react';

import './BillsandFees.scss';
import TextInput from '../../components/Input/TextInput';
import Button from '../../components/Button/Button';
import Addcircle from '../../icons/Addcircle';
import AddCircleBlue from '../../icons/AddCircleBlue';
import ToggleUnchecked from '../../icons/ToggleUnchecked';
import ToggleChecked from '../../icons/ToggleChecked';
import { useGetSchoolDetails } from '../../hooks/queries/SchoolQuery';
import { useNavigate } from 'react-router';
import { useGetClasses } from '../../hooks/queries/billsAndFeesMgt';
import { Discount, Fee } from '../../types/types';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useCreateBill } from '../../hooks/mutations/billsAndFeesMgt';
import DeleteRed from '../../icons/DeleteRed';
import ClassAndStudentSelection from '../../components/ClassAndStudentSelection/ClassAndStudentSelection';

const CreateBill = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addClass, setAddClass] = useState<boolean>(false);
  const [addFee, setAddFee] = useState<boolean>(false);
  const [addDiscount, setAddDiscount] = useState<boolean>(false);
  const [partPayment, setPartPayment] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<boolean>(false);
  const [selectedClasses, setSelectedClasses] = useState<any>([]);
  const [classSearchValue, setClassSearchValue] = useState<string>('');
  const [selectedFee, setSelectedFee] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(200);
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);
  const [selectedFeeForDiscount, setSelectedFeeForDiscount] = useState('');

  const [discountValue, setDiscounValue] = useState('');
  const [discountedAmount, setDiscountAmout] = useState(0);

  const [fees, setFees] = useState<Fee[]>([
    {
      fee_type: {
        name: '',
        description: '',
        default_amount: 0.0,
        classes: [],
        students: [],
        student: [],
        discounts: [],
      },
      amount: 0.0,
      mandatory: true,
    },
  ]);

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      value: 0,
      description: '',
      is_percentage: true,
      students: [],
      classes: [],
    },
  ]);

  const calcDiscountedValue = () => {
    const filterFeesByFeeTypeName = (): Fee[] => {
      return fees.filter((fee) => fee.fee_type.name === selectedFeeForDiscount);
    };
    let discounted =
      (Number(filterFeesByFeeTypeName()[0]?.fee_type?.default_amount) *
        discountValue) /
      100;
    setDiscountAmout(Number(discounted).toLocaleString());
  };

  useEffect(() => {
    calcDiscountedValue();
  }, [discountValue, selectedFeeForDiscount]);

  const [fields, setFields] = useState({
    billName: '',
    dueDate: '',
    status: 'draft',
    classes: [],
    amount: 0,
    mandatory: false,
  });

  const { data: schoolData } = useGetSchoolDetails();
  const { data: classes } = useGetClasses();
  const formattedClasses = classes?.results?.map((c: any) => ({
    id: c.id,
    name: c.class_name,
  }));

  const toggleClasses = (option: any) => {
    setSelectedClasses((prevSelected: any) => {
      // if it's in, remove
      const newArray = [...prevSelected];

      if (newArray.filter((e) => e.id === option.id).length > 0) {
        return newArray.filter((item) => item.id != option.id);
        // else, add
      } else {
        newArray.push(option);
        return newArray;
      }
    });
  };

  //handle field change
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    setFields({
      ...fields,
      [evt.target.name]: value,
    });
  };

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
  };

  const handleClassSearch = (evt: any) => {
    setClassSearchValue(evt.target.value);
  };

  //add fee
  const handleAddFee = () => {
    const newFee: Fee = {
      fee_type: {
        name: '',
        description: '',
        default_amount: 0.0,
        classes: [],
        students: [],
        student: [],
        discounts: [],
      },
      amount: 0.0,
      mandatory: false,
    };
    setFees([...fees, newFee]);
  };

  const handleAddDiscount = () => {
    const newDiscount: Discount = {
      value: 10,
      description: '',
      is_percentage: true,
      students: [],
      classes: [],
    };
    setDiscounts([...discounts, newDiscount]);
  };

  const handleFeeTypeChange = (index: number, field: string, value: any) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              [field]: value,
            },
          }
        : fee
    );
    setFees(updatedFees);
  };

  const handleDiscountChange = (index: number, field: string, value: any) => {
    const updatedDiscount = discounts.map((discount, i) =>
      i === index
        ? {
            ...discount,
            [field]: value,
          }
        : discount
    );
    setDiscounts(updatedDiscount);
  };
  const handleClassChange = (index: number, selectedClasses: number[]) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              classes: selectedClasses,
            },
          }
        : fee
    );

    setFees(updatedFees);
  };

  const handleStudentChange = (index: number, selectedStudents: number[]) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            fee_type: {
              ...fee.fee_type,
              student: selectedStudents,
              students: selectedStudents,
            },
          }
        : fee
    );
    setFees(updatedFees);
  };

  const handleClassDropdownChange = (
    index: number,
    selectedClasses: number[]
  ) => {
    // Call the handleClassChange function to update the fees state
    handleClassChange(index, selectedClasses);
  };

  const handleStudentDropdownChange = (
    index: number,
    selectedStudents: number[]
  ) => {
    // Call the handleClassChange function to update the fees state
    handleStudentChange(index, selectedStudents);
  };

  const handleAmountChange = (index: number, value: string) => {
    const updatedFees = fees.map((fee, i) =>
      i === index
        ? {
            ...fee,
            amount: Number(value),
            fee_type: {
              ...fee.fee_type,
              default_amount: Number(value),
            },
          }
        : fee
    );
    setFees(updatedFees);
  };

  useEffect(() => {
    // Calculate the total amount
    const totalAmount = fees.reduce((total, fee) => total + fee.amount, 0);
    setFields({ ...fields, amount: totalAmount });
  }, [fees]);

  const removeFee = (name: string) => {
    let filtered = fees.filter((el) => el.fee_type.name !== name);
    setFees(filtered);
  };

  const handleToggleMandatory = (index: number) => {
    const updatedFees = fees.map((fee, i) =>
      i === index ? { ...fee, mandatory: !fee.mandatory } : fee
    );
    setFees(updatedFees);
  };

  let classIds = selectedClasses.map((item: { id: number }) => {
    return item.id;
  });

  const showClasses = (fee: string) => {
    if (fee == '') {
      toast.error('Please enter the fee type first');
      return;
    }
    if (selectedFee === fee) {
      setSelectedFee('');
    } else {
      setSelectedFee(fee);
    }
  };

  const showClassesForDiscount = (index: number) => {
    if (selectedDiscount === index) {
      setSelectedDiscount(200);
    } else {
      setSelectedDiscount(index);
    }
  };

  const { mutate, isLoading } = useCreateBill();

  //submit form
  const submit = () => {
    if (isNaN(Number(fields.amount))) {
      toast.error('Amount field can only contain numbers');
      return;
    }

    let dataToSend = {
      bill_name: fields.billName,
      due_date: fields.dueDate,
      status: 'draft',
      classes: classIds,
      fees: fees,
      amount: fields.amount,
      mandatory: false,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Bill created successfully');
        queryClient.invalidateQueries({
          queryKey: `bills`,
        });

        setFields({ ...fields });
        navigate('/bills-fees-management');
      },

      onError: (e) => {
        toast.error('Error creating bill');
      },
    });
  };
  return (
    <div>
      <div className='bills_overview'>
        <h2 className='bills_overview__title'>{fields.billName || ''} Bill</h2>
        <h1 className='bills_overview__approval'>APPROVAL STATUS: Pending</h1>
        <h1 className='bills_overview__status'>STATUS: Draft</h1>
      </div>

      <div className='bills_schoolInfo'>
        <div className='bills_schoolInfo__logo'>
          <img src={schoolData && schoolData.data[0].arm.logo} alt='' />
        </div>
        <div className='bills_schoolInfo__details'>
          {schoolData && schoolData?.data[0].arm.name}
          <br /> {fields.billName ? `${fields.billName} BILL` : ''}
          <p className='bills_schoolInfo__details__email'>
            Email: {schoolData && schoolData?.data[0].arm.email}
          </p>
        </div>
      </div>

      <div className='bills_form'>
        <div className='bills_form__top'>
          <TextInput
            label='Bill Name'
            placeholder='Bill Name'
            className='bills_form__top__input'
            name='billName'
            type='dropdown'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.billName}
            fieldClass={''}
            errorMessage={''}
            id={'billName'}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={''}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            selectedValues={undefined}
            options={[
              { id: 1, name: 'Third term 2022/2023' },
              { id: 2, name: 'First term 2023/2024' },
              { id: 3, name: 'Second term 2023/2024' },
              { id: 4, name: 'Third term 2023/2024' },
            ]}
          />

          <TextInput
            label='Bill Due Date'
            placeholder='Bill Name'
            name='dueDate'
            type='date'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.dueDate}
            fieldClass={'input-field'}
            errorMessage={''}
            id={'dueDate'}
            onSelectValue={function (): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={''}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            selectedValues={undefined}
            options={[]}
          />
        </div>

        <Button
          disabled={false}
          btnText='Add Class'
          btnClass='btn-cancel'
          width='100%'
          icon={<Addcircle />}
          onClick={() => setAddClass(!addClass)}
        />
      </div>

      {addClass && (
        <div className='bills_form__other_form'>
          <div className='bills_form__other_form__header'>
            <p>ASSIGNED CLASS</p>
            <p>TOTAL BILL AMOUNT</p>
          </div>

          <div className='bills_form__top'>
            <TextInput
              label=''
              placeholder='Assign Bill to class'
              name='classes'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={''}
              value={''}
              fieldClass={''}
              errorMessage={''}
              id={'classes'}
              onSelectValue={selectValue}
              isSearchable={true}
              handleSearchValue={handleClassSearch}
              searchValue={classSearchValue}
              handleBlur={''}
              multi={true}
              toggleOption={toggleClasses}
              selectedValues={selectedClasses}
              options={formattedClasses}
            />

            <TextInput
              label=''
              placeholder=''
              name='amount'
              type='text'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.amount?.toLocaleString()}
              fieldClass={'input-field'}
              errorMessage={''}
              id={'amount'}
              onSelectValue={function (): void {}}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={''}
              multi={false}
              toggleOption={function (a: any): void {
                throw new Error('');
              }}
              selectedValues={undefined}
              options={[]}
              disabled={true}
            />
          </div>

          <div className='bills_form__other_form__addons'>
            <p onClick={() => setAddFee(!addFee)}>
              <AddCircleBlue />
              Add Fee
            </p>

            {fees.length > 0 && (
              <div className='bills_form__other_form__addons__addFee'>
                {addFee &&
                  fees.map((fee, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: '30px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          marginBottom: '20px',
                        }}
                      >
                        <div className='bills_form__other_form__addons__addFee__input'>
                          <label>Fee Type</label>
                          <div className='bills_form__other_form__addons__addFee__input__wrapper'>
                            <input
                              className='bills_form__other_form__addons__addFee__input__wrapper__input'
                              type='text'
                              name=''
                              id=''
                              value={fee.fee_type.name}
                              onChange={(e) =>
                                handleFeeTypeChange(
                                  index,
                                  'name',
                                  e.target.value
                                )
                              }
                              placeholder='type or select fee type'
                            />
                            <button
                              onClick={() => showClasses(fee.fee_type.name)}
                            >
                              <AddCircleBlue />
                            </button>
                          </div>
                          {selectedFee !== '' &&
                            selectedFee === fee.fee_type.name && (
                              <ClassAndStudentSelection
                                classes={classes?.results}
                                cancel={() => showClasses(fee.fee_type.name)}
                                selectedClassesInFees={fee.fee_type.classes}
                                onClassChange={(selectedClasses: number[]) =>
                                  handleClassDropdownChange(
                                    index,
                                    selectedClasses
                                  )
                                }
                                onStudentsChange={(
                                  selectedStudents: number[]
                                ) =>
                                  handleStudentDropdownChange(
                                    index,
                                    selectedStudents
                                  )
                                }
                              />
                            )}
                        </div>
                        <div className='bills_form__other_form__addons__addFee__input'>
                          <div className='bills_form__other_form__addons__addFee__input__wrapper'>
                            <input
                              className='bills_form__other_form__addons__addFee__input__wrapper__input'
                              type='text'
                              name=''
                              id=''
                              placeholder='Amount'
                              value={fee.amount}
                              onChange={(e) =>
                                handleAmountChange(index, e.target.value)
                              }
                            />
                          </div>
                          <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeFee(fee.fee_type.name)}
                          >
                            <DeleteRed />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '10px',
                        }}
                      >
                        {fee.mandatory ? (
                          <button onClick={() => handleToggleMandatory(index)}>
                            <ToggleUnchecked />
                          </button>
                        ) : (
                          <button onClick={() => handleToggleMandatory(index)}>
                            <ToggleChecked />
                          </button>
                        )}
                        Optional
                      </div>
                    </div>
                  ))}

                {addFee && fees.length > 0 && (
                  <div
                    onClick={handleAddFee}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '10px',
                      color: 'rgba(67, 154, 222, 1)',
                      marginTop: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    <AddCircleBlue />
                    Add Another Fee
                  </div>
                )}
              </div>
            )}

            {/* <p onClick={() => setAddDiscount(!addDiscount)}>
              <AddCircleBlue />
              Add Discount
            </p> */}

            {discounts.length > 0 &&
              addDiscount &&
              discounts.map((d, index) => (
                <div className='bills_form__other_form__addons__addDiscount'>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '70px',
                      alignItems: 'flex-end',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      className='bills_form__other_form__addons__addFee__input'
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <label>Discount</label>
                      <div className='bills_form__other_form__addons__addFee__input__wrapper'>
                        <input
                          className='bills_form__other_form__addons__addFee__input__wrapper__input'
                          type='text'
                          name=''
                          id=''
                          value={d.value}
                          onChange={(e) =>
                            handleDiscountChange(index, 'name', e.target.value)
                          }
                          placeholder='type or select fee type'
                        />
                        <button onClick={() => showClassesForDiscount(index)}>
                          <AddCircleBlue />
                        </button>
                        {selectedDiscount !== 200 &&
                          selectedDiscount === index && (
                            <ClassAndStudentSelection
                              classes={classes?.results}
                              cancel={() => showClassesForDiscount(index)}
                              selectedClassesInFees={d.classes}
                              onClassChange={(selectedClasses: number[]) =>
                                handleClassDropdownChange(
                                  index,
                                  selectedClasses
                                )
                              }
                              onStudentsChange={(selectedStudents: number[]) =>
                                handleStudentDropdownChange(
                                  index,
                                  selectedStudents
                                )
                              }
                            />
                          )}
                      </div>
                    </div>
                    of
                    <div style={{ position: 'relative' }}>
                      <div className='bills_form__other_form__addons__addDiscount__input'>
                        <input
                          type='text'
                          name=''
                          id=''
                          value={selectedFeeForDiscount}
                          placeholder='Select fee type'
                          onClick={() =>
                            setShowDiscountDropdown(!showDiscountDropdown)
                          }
                        />
                      </div>
                      <div className='discount_dropdown'>
                        {showDiscountDropdown &&
                          fees.map((fee) => (
                            <div
                              className='discount_dropdown__item'
                              onClick={() => {
                                setSelectedFeeForDiscount(fee?.fee_type?.name);
                                setShowDiscountDropdown(false);
                              }}
                            >
                              <p>{fee?.fee_type?.name}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                    —
                    <div className='bills_form__other_form__addons__addDiscount__input'>
                      <input
                        type='text'
                        name=''
                        id=''
                        placeholder=''
                        disabled
                        value={discountedAmount ? discountedAmount : 0}
                      />
                    </div>
                    <div className='bills_form__other_form__addons__addDiscount__input'>
                      <input
                        type='text'
                        name=''
                        id=''
                        placeholder='Reason for discount'
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '10px',
                    }}
                  >
                    {percentage ? (
                      <button onClick={() => setPercentage(!percentage)}>
                        <ToggleChecked />
                      </button>
                    ) : (
                      <button onClick={() => setPercentage(!percentage)}>
                        <ToggleUnchecked />
                      </button>
                    )}
                    Percentage
                  </div>
                </div>
              ))}
            {addDiscount && discounts.length > 0 && (
              <div
                onClick={handleAddDiscount}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '10px',
                  color: 'rgba(67, 154, 222, 1)',
                  marginTop: '20px',
                  cursor: 'pointer',
                }}
              >
                <AddCircleBlue />
                Add Another Discount
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              {partPayment ? (
                <button onClick={() => setPartPayment(!partPayment)}>
                  <ToggleChecked />
                </button>
              ) : (
                <button onClick={() => setPartPayment(!partPayment)}>
                  <ToggleUnchecked />
                </button>
              )}

              <p
                style={{
                  margin: '0',
                  padding: '0',
                  fontSize: '14px',
                  color: 'black',
                }}
              >
                Click to allow part payment of school bill
              </p>
            </div>
          </div>

          <div className='bills_form__other_form__note'>
            <label>Notes</label>
            <textarea
              name=''
              id=''
              cols={0}
              rows={10}
              placeholder='Add Notes'
              style={{
                width: '100%',
                height: '100px',
                background: 'rgba(250, 250, 250, 1)',
                padding: '20px',
                borderRadius: '5px',
                border: '1px solid rgba(1, 12, 21, 0.1)',
              }}
            ></textarea>
          </div>
        </div>
      )}

      <div className='bills_form__btns'>
        <button
          style={{
            background: 'transparent',
            padding: '16px 20px',
            borderRadius: '5px',
          }}
          onClick={() => navigate('/bills-fees-management')}
        >
          Cancel
        </button>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
          <button
            style={{
              background: '#E4EFF9',
              padding: '16px 20px',
              borderRadius: '5px',
            }}
          >
            Save as Draft
          </button>

          <button
            disabled={isLoading}
            style={{
              background: '#439ADE',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '5px',
            }}
            onClick={() => submit()}
          >
            Send Bill
          </button>

          {/* <Button
              disabled={false}
              btnText="Send Bill"
              btnClass="btn-primary"
              width="100%"
              onClick={() => {}}
            /> */}
        </div>
      </div>
    </div>
  );
};

export default CreateBill;
