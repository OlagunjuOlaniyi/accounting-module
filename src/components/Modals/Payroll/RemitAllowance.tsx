import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Cancel from '../../../icons/Cancel';
import { Imodal } from '../../../types/types';
import TextInput from '../../Input/TextInput';
import '../Inventory/inventory.scss';

import Cash from '../../../icons/Cash';
import Bank from '../../../icons/Bank';

import toast from 'react-hot-toast';

import { useQueryClient } from 'react-query';

import { useGetBankList } from '../../../hooks/queries/banks';
import Credit from '../../../icons/Credit';

import { useNavigate } from 'react-router';
import { useRemitAllowanceOrDeduction } from '../../../hooks/mutations/payroll';

const RemitAllowance = ({ modalIsOpen, closeModal, id }: any) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any>([]);
  const [selectedTypes, setSelectedTypes] = useState<any>([]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '0px',
    },
  };

  //toggle dropdown selection
  const toggleOption = (option: any) => {
    setSelected((prevSelected: any) => {
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
  const toggleTypesOption = (option: any) => {
    setSelectedTypes((prevSelected: any) => {
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

  const close = () => {
    closeModal('income');
  };

  type StateProps = {
    paymentMethod: any;
    amount: string;
    description: string;
    dateOfTransaction: string;
    bank: string;
    quantity: string;
    name: string;
    product_group_name: string;
    product_category_name: string;
    reOrderLevel: string;
    size: string;
    ppu: string;
    spu: string;
    total: string;
  };

  let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState<StateProps>({
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: todaysDate,
    bank: '',
    quantity: '',
    name: '',
    product_group_name: '',
    product_category_name: '',
    reOrderLevel: '',
    size: '',
    ppu: '',
    spu: '',
    total: '',
  });

  const [errors, setErrors] = useState({
    quantity: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    bank: '',
    name: '',
    product_group_name: '',
    product_category_name: '',
    reOrderLevel: '',
    size: '',
    ppu: '',
    spu: '',
    total: '',
  });

  //component states

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [bankId, setBankId] = useState('');

  //handle field change
  const handleChange = (evt: any) => {
    const value = evt.target.value;

    setFields({
      ...fields,
      [evt.target.name]: value,
    });
  };

  //set error on input blur
  const handleBlur = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    if (!value) {
      setErrors({
        ...errors,
        [evt.target.name]: `Field cannot be empty`,
      });
    } else {
      setErrors({
        ...errors,
        [evt.target.name]: ``,
      });
    }
  };

  const { mutate, isLoading } = useRemitAllowanceOrDeduction(id || '');

  const { data: bank_accounts } = useGetBankList();

  const formattedBankAccounts = bank_accounts?.data?.map(
    (b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    })
  );

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    setSelectedGroupId(id);
    if (name === 'bank') {
      setBankId(id);
    }
  };

  //submit form
  const submit = () => {
    let dataToSend = {
      staffs: selected.map((el: { name: string }) => ({ name: el.name })),
      type: selectedTypes.map((el: { name: string }) => el.name),
      modifier_type: 'ALLOWANCE',
      transactions_date: fields.dateOfTransaction,
      payment_method:
        fields.paymentMethod.props.children[1] === 'Bank'
          ? bankId
          : fields.paymentMethod.props.children[1],
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Allowance remitted successfully');
        navigate('/payroll');
        queryClient.invalidateQueries({
          queryKey: `payroll`,
        });
      },

      onError: (e) => {
        toast.error(e.response?.data?.message);
      },
    });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={close}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className='record-income'>
        <div style={{ background: '#FBFDFE' }}>
          <div className='record-income__cancel'>
            <button className='record-income__cancel__btn' onClick={close}>
              <Cancel />
            </button>
          </div>
          <div className='record-income__heading'>
            <h4>Pay Allowance </h4>
            <p>
              Select the payroll type, payment method, and date of transaction
              of the allowance you want to pay
            </p>
          </div>
        </div>

        <div className='record-income__body'>
          <TextInput
            label={'Staff Name'}
            placeholder={'StaffName'}
            name='name'
            type='dropdown'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={''}
            fieldClass={errors['name'] ? 'error-field' : 'input-field'}
            errorMessage={errors['name']}
            id={'student-name'}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={handleBlur}
            multi={true}
            toggleOption={toggleOption}
            selectedValues={selected}
            options={[
              { id: 1, name: 'Adegbenga Johnson' },
              { id: 2, name: 'Tunde Ahmed' },
              { id: 3, name: 'Somtochukwu James' },
            ]}
          />

          <TextInput
            label='Payroll type'
            placeholder='Select payroll type'
            name='size'
            type='dropdown'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.size}
            fieldClass={errors['size'] ? 'error-field' : 'input-field'}
            errorMessage={errors['size']}
            id={'size'}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={() => {}}
            searchValue={''}
            handleBlur={undefined}
            multi={true}
            toggleOption={toggleTypesOption}
            options={[
              // { id: 1, name: 'ALL DEDUCTIONS' },
              { id: 2, name: 'ALL ALLOWANCE' },
            ]}
            selectedValues={selectedTypes}
          />

          <TextInput
            label='Payment Method'
            placeholder='Select payment method'
            name='paymentMethod'
            type='dropdown'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.paymentMethod}
            fieldClass={errors['paymentMethod'] ? 'error-field' : 'input-field'}
            errorMessage={errors['paymentMethod']}
            id={'paymentMethod'}
            onSelectValue={selectValue}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={undefined}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            options={[
              {
                id: 1,
                name: (
                  <div className='payment-method-dropdown'>
                    <Cash />
                    CASH
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
            selectedValues={undefined}
          />

          {fields.paymentMethod?.props?.children[1]?.toLowerCase() ===
            'bank' && (
            <TextInput
              label='Bank Accounts'
              placeholder='Select bank account'
              name='bank'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.bank}
              fieldClass={errors['bank'] ? 'error-field' : 'input-field'}
              errorMessage={errors['bank']}
              id={'bank'}
              onSelectValue={selectValue}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={undefined}
              multi={false}
              toggleOption={function (a: any): void {
                throw new Error('');
              }}
              options={formattedBankAccounts}
              selectedValues={undefined}
            />
          )}

          <TextInput
            label='Date of Transaction'
            placeholder=''
            name='dateOfTransaction'
            type='date'
            min={new Date().toISOString().split('T')[0]}
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.dateOfTransaction}
            fieldClass={
              errors['dateOfTransaction'] ? 'error-field' : 'input-field'
            }
            errorMessage={errors['dateOfTransaction']}
            id={'dateOfTransaction'}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={undefined}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            selectedValues={''}
          />
        </div>
        <button
          className='record-income__footer-btn'
          onClick={() => submit()}
          disabled={
            fields.paymentMethod === '' || selected.length === 0 || isLoading
          }
        >
          {isLoading ? 'Please wait...' : 'Pay Allowance'}
        </button>
      </div>
    </Modal>
  );
};

export default RemitAllowance;
