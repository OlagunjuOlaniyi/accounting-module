import { useState } from 'react';

import './payroll.scss';
import TextInput from '../../components/Input/TextInput';
import Button from '../../components/Button/Button';
import Addcircle from '../../icons/Addcircle';
import AddCircleBlue from '../../icons/AddCircleBlue';
import ToggleUnchecked from '../../icons/ToggleUnchecked';
import ToggleChecked from '../../icons/ToggleChecked';
import { useGetSchoolDetails } from '../../hooks/queries/SchoolQuery';
import { useNavigate } from 'react-router';

import { PayrollData, PayrollGroupModifier } from '../../types/types';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

import DeleteRed from '../../icons/DeleteRed';

import { useCreatePayroll } from '../../hooks/mutations/payroll';

const CreatePayroll = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addStaff, setAddStaff] = useState<boolean>(false);

  const [selectedClasses, setSelectedClasses] = useState<any>([]);
  const [classSearchValue, setClassSearchValue] = useState<string>('');

  const [payrollGroups, setPayrollGroups] = useState<PayrollData[]>([
    {
      staffs: [{ name: 'Jibola test' }, { name: 'Pelumi Test' }],
      net_amount: 0, //this should be automatically calculated
      gross_amount: 0,
      payroll_group_modifiers: [
        {
          modifier_name: '',
          modifier_type: '',
          is_percentage: false,
          amount: 0,
          linking_percentage: '', //this is what that want to get the poercentage of
          percentage: 0,
        },
      ],
    },
  ]);

  const addModifier = (groupIndex: number) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...payrollGroups];
      const newModifier: PayrollGroupModifier = {
        modifier_name: '',
        modifier_type: '',
        is_percentage: false,
        amount: 0,
        linking_percentage: '',
        percentage: 0,
      };

      newGroups[groupIndex].payroll_group_modifiers.push(newModifier);

      return newGroups;
    });
  };

  const handleModifierNameChange = (
    groupIndex: number,
    modifierIndex: number,
    value: string
  ) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].payroll_group_modifiers[
        modifierIndex
      ].modifier_name = value;
      return newGroups;
    });
  };

  const deleteModifier = (groupIndex: number, modifierIndex: number) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].payroll_group_modifiers.splice(modifierIndex, 1);
      return newGroups;
    });
  };

  const handleModifierTypeChange = (
    groupIndex: number,
    modifierIndex: number,
    value: string
  ) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].payroll_group_modifiers[
        modifierIndex
      ].modifier_type = value as 'ALLOWANCE' | 'DEDUCTION';
      return newGroups;
    });
  };

  const handleNetAmountChange = (groupIndex: number, value: string) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].net_amount = Number(value);
      return newGroups;
    });
  };
  const handleGrossAmountChange = (groupIndex: number, value: string) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].gross_amount = Number(value);
      return newGroups;
    });
  };

  const handleIsPercentageChange = (
    groupIndex: number,
    modifierIndex: number
  ) => {
    const newGroups = [...payrollGroups];

    newGroups[groupIndex].payroll_group_modifiers[modifierIndex].is_percentage =
      !newGroups[groupIndex].payroll_group_modifiers[modifierIndex]
        .is_percentage;
    setPayrollGroups(newGroups);
  };

  const handleLinkingPercentageChange = (
    groupIndex: number,
    modifierIndex: number,
    value: string
  ) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].payroll_group_modifiers[
        modifierIndex
      ].linking_percentage = value;
      return newGroups;
    });
  };

  const handlePercentageChange = (
    groupIndex: number,
    modifierIndex: number,
    value: number
  ) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].payroll_group_modifiers[modifierIndex].percentage =
        value;
      return newGroups;
    });
  };

  const handleAmountChange = (
    groupIndex: number,
    modifierIndex: number,
    value: number
  ) => {
    setPayrollGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex].payroll_group_modifiers[modifierIndex].amount =
        value;
      return newGroups;
    });
  };

  const getModifierNames = (groupIndex: number) => {
    return payrollGroups[groupIndex].payroll_group_modifiers.map(
      (modifier) => modifier.modifier_name
    );
  };

  const calculatePercentage = (
    groupIndex: number,
    modifierIndex: number
  ): number => {
    const modifier =
      payrollGroups[groupIndex].payroll_group_modifiers[modifierIndex];
    const modifierNames = getModifierNames(groupIndex);
    const linkingPercentage = modifier.linking_percentage;

    if (linkingPercentage && modifierNames.includes(linkingPercentage)) {
      const linkedModifier = payrollGroups[
        groupIndex
      ].payroll_group_modifiers.find(
        (m) => m.modifier_name === linkingPercentage
      );

      let percentage =
        payrollGroups[groupIndex].payroll_group_modifiers[modifierIndex]
          .percentage || 0;

      let amount = linkedModifier?.amount || 0;

      if (linkedModifier && linkedModifier.amount) {
        return (amount / 100) * percentage;
      }
    }

    return 0;
  };

  const renderModifiers = (groupIndex: number) => {
    const modifierNames = getModifierNames(groupIndex);

    return payrollGroups[groupIndex].payroll_group_modifiers.map(
      (modifier, modifierIndex) => (
        <div className='bg-[#F6F6F6] py-5 pr-7'>
          <div
            key={modifierIndex}
            className='px-7 flex mb-6 gap-7 w-full items-center'
          >
            <div className='w-full flex flex-col gap-2'>
              <label>Type</label>
              <select
                className='input-field'
                value={modifier.modifier_type}
                onChange={(e) =>
                  handleModifierTypeChange(
                    groupIndex,
                    modifierIndex,
                    e.target.value
                  )
                }
              >
                <option value='' disabled>
                  Select Type
                </option>
                <option value='ALLOWANCE'>Allowance</option>
                <option value='DEDUCTION'>Deduction</option>
              </select>
            </div>

            <div className='w-full flex flex-col gap-2'>
              <label>Name</label>
              <input
                type='text'
                className='input-field'
                value={modifier.modifier_name}
                onChange={(e) =>
                  handleModifierNameChange(
                    groupIndex,
                    modifierIndex,
                    e.target.value
                  )
                }
              />
            </div>

            {modifier.is_percentage ? (
              <>
                <div className='w-full flex flex-col gap-2'>
                  <label>Percentage Amount</label>
                  <input
                    className='input-field'
                    type='number'
                    placeholder='percentage (%)'
                    value={modifier.percentage}
                    onChange={(e) =>
                      handlePercentageChange(
                        groupIndex,
                        modifierIndex,
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>

                <p className='pt-4'>of</p>
                <div className='w-full flex flex-col gap-2'>
                  <label>Payroll Type</label>
                  <select
                    className='input-field'
                    value={modifier.linking_percentage || ''}
                    onChange={(e) =>
                      handleLinkingPercentageChange(
                        groupIndex,
                        modifierIndex,
                        e.target.value
                      )
                    }
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
                  <label>Amount</label>
                  <input
                    className='input-field'
                    type='number'
                    value={calculatePercentage(groupIndex, modifierIndex)}
                    disabled
                  />
                </div>
              </>
            ) : (
              <div className='w-full flex flex-col gap-2'>
                <label>Amount</label>
                <input
                  className='input-field'
                  type='number'
                  value={modifier.amount}
                  onChange={(e) =>
                    handleAmountChange(
                      groupIndex,
                      modifierIndex,
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            )}
            <button
              className='pt-4'
              onClick={() => deleteModifier(groupIndex, modifierIndex)}
            >
              <DeleteRed />
            </button>
          </div>
          <div
            className='flex justify-end items-center gap-2 cursor-pointer'
            onClick={() => handleIsPercentageChange(groupIndex, modifierIndex)}
          >
            {modifier.is_percentage ? <ToggleChecked /> : <ToggleUnchecked />}
            <p>Percentage</p>
          </div>
        </div>
      )
    );
  };

  const [fields, setFields] = useState({
    name: '',
    due_date: '',
  });

  const { data: schoolData } = useGetSchoolDetails();

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

  const handleAddStaff = () => {
    const newStaff: PayrollData = {
      staffs: [{ name: '' }],
      net_amount: 0, //this should be automatically calculated
      gross_amount: 0,
      payroll_group_modifiers: [
        {
          modifier_name: '',
          modifier_type: '',
          is_percentage: false,
          amount: 0,
          linking_percentage: '', //this is what that want to get the poercentage of
          percentage: 0,
        },
      ],
    };
    setPayrollGroups([...payrollGroups, newStaff]);
  };

  let classIds = selectedClasses.map((item: { id: number }) => {
    return item.id;
  });

  const { mutate, isLoading } = useCreatePayroll();

  //submit form
  const submit = () => {
    let dataToSend = {
      name: fields.name,
      due_date: fields.due_date,
      payroll_groups: payrollGroups,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Payroll created successfully');
        queryClient.invalidateQueries({
          queryKey: `payroll`,
        });

        setFields({ ...fields });
        navigate('/payroll');
      },

      onError: (e) => {
        toast.error(e?.response.data.message || 'error creating payroll');
      },
    });
  };
  return (
    <div>
      <div className='bills_overview'>
        <h2 className='bills_overview__title'>{fields.name || ''} Payroll</h2>
        <h1 className='bills_overview__approval'>APPROVAL STATUS: Pending</h1>
        <h1 className='bills_overview__status'>STATUS: Draft</h1>
      </div>

      <div className='bills_schoolInfo'>
        <div className='bills_schoolInfo__logo'>
          <img src={schoolData && schoolData?.data[0]?.arm?.logo} alt='' />
        </div>
        <div className='bills_schoolInfo__details'>
          {schoolData && schoolData?.data[0]?.arm?.name}
          <br /> {fields.name ? `${fields.name} PAYROLL` : ''}
          <p className='bills_schoolInfo__details__email'>
            Email: {schoolData && schoolData?.data[0]?.arm?.email}
          </p>
        </div>
      </div>

      <div className='bills_form'>
        <div className='bills_form__top'>
          <TextInput
            label='Payroll Name'
            placeholder='Bill Name'
            className='bills_form__top__input'
            name='name'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.name}
            fieldClass={'input-field'}
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
            options={[]}
          />

          <TextInput
            label='Payroll Due Date'
            placeholder='Bill Name'
            name='due_date'
            type='date'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.due_date}
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
          btnText='Add Staff'
          btnClass='btn-cancel'
          width='100%'
          icon={<Addcircle />}
          onClick={() => setAddStaff(!addStaff)}
        />
      </div>

      <div>
        {payrollGroups.map((group, groupIndex) => (
          <div key={groupIndex} className='mt-10x'>
            <div className='flex justify-between bg-[#E4EFF9] w-full h-[50px] px-7 items-center'>
              <p className='text-sm text-[#010C15B2] font-bold'>STAFF NAME</p>
              <p className='text-sm text-[#010C15B2] font-bold'>GROSS AMOUNT</p>
              <p className='text-sm text-[#010C15B2] font-bold'>NET AMOUNT</p>
            </div>
            <div className='flex justify-between w-full h-[50px] px-7 items-center bills_form__top mt-5'>
              <TextInput
                type={'dropdown'}
                name={'staffName'}
                handleChange={undefined}
                fieldClass={''}
                errorClass={''}
                errorMessage={''}
                label={''}
                id={''}
                placeholder={'Select staff name'}
                onSelectValue={selectValue}
                isSearchable={true}
                handleSearchValue={handleClassSearch}
                searchValue={classSearchValue}
                handleBlur={undefined}
                multi={true}
                toggleOption={toggleClasses}
                selectedValues={selectedClasses}
                options={[
                  { id: 1, name: 'Ronke Famuyiwa' },
                  { id: 2, name: 'Bola Bola' },
                ]}
              />

              <div className='input-component'>
                <input
                  onChange={(e) =>
                    handleGrossAmountChange(groupIndex, e.target.value)
                  }
                  className='input-field'
                  placeholder={'Set gross amount'}
                  name={'grossAmount'}
                />
              </div>
              <div className='input-component'>
                <input
                  onChange={(e) =>
                    handleNetAmountChange(groupIndex, e.target.value)
                  }
                  className='input-field'
                  placeholder={'Set net amount'}
                  name={'netAmount'}
                />
              </div>
            </div>

            {renderModifiers(groupIndex)}
            <div className='bills_form__other_form__addons'>
              <p onClick={() => addModifier(groupIndex)}>
                <AddCircleBlue />
                Add Modifier(Allowance/ Deduction)
              </p>
            </div>
            <button></button>
          </div>
        ))}
      </div>
      <div className='bills_form__other_form__addons'>
        <p onClick={handleAddStaff}>
          <AddCircleBlue />
          Add Staff
        </p>
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
            onClick={() => submit()}
          >
            {isLoading ? 'Saving...' : 'Save Payroll'}
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

export default CreatePayroll;
