import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Cancel from '../../../icons/Cancel';
import { Imodal } from '../../../types/types';
import TextInput from '../../Input/TextInput';
import './inventory.scss';

import Cash from '../../../icons/Cash';
import Bank from '../../../icons/Bank';

import toast from 'react-hot-toast';

import { useQueryClient } from 'react-query';

import { useGetBankList } from '../../../hooks/queries/banks';
import Credit from '../../../icons/Credit';

import { useDispenseProduct } from '../../../hooks/mutations/inventory';
import { useParams, useNavigate } from 'react-router';
import { deriveStudentArray } from '../../../utilities';
import { useGetStudents } from '../../../hooks/queries/students';
import { useCurrency } from '../../../context/CurrencyContext';

interface SizeQuantiyData {
  size: string;
  quantity: number;
}

const DispenseModal = ({ modalIsOpen, closeModal, name, sizes }: Imodal) => {
  const { id } = useParams();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any>([]);
  const [selectedSize, setSelectedSize] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const initialSizeQuantityData: SizeQuantiyData[] = selectedSize.map(
    (s: any) => ({
      size: s.name,
      quantity: '',
    })
  );
  const [sizeQuantityData, setSizeQuantityData] = useState<SizeQuantiyData[]>(
    []
  );

  useEffect(() => {
    setSizeQuantityData(initialSizeQuantityData);
  }, [selectedSize]);

  const handleQuantityChange = (index: number, value: string) => {
    const updatedFormData = [...sizeQuantityData];
    updatedFormData[index].quantity = Number(value);
    setSizeQuantityData(updatedFormData);
  };

  const totalQuantity = sizeQuantityData.reduce((total, item) => {
    return total + (item.quantity ? Number(item.quantity) : 0);
  }, 0);

  const handleSearch = (evt: any) => {
    setSearchValue(evt.target.value);
  };

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

  //toggle dropdown selection
  const toggleSizeOption = (option: any) => {
    setSelectedSize((prevSelected: any) => {
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

  const { mutate, isLoading } = useDispenseProduct();

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

    if (name === 'bank') {
      setBankId(id);
    }
  };

  //submit form
  const submit = () => {
    let dataToSend = {
      sizes: sizeQuantityData,
      payment_method:
        fields.paymentMethod.props.children[1] === 'Bank'
          ? bankId
          : fields.paymentMethod.props.children[1],
      student_ids: selected.map((el: { name: string }) => ({ name: el.name })),
      product_id: id,
    };

    // Check for quantity errors
    let hasQuantityError = false;
    sizeQuantityData.forEach((selectedSize) => {
      const sizeInfo = sizes.find(
        (size: { size: string | number }) => size?.size === selectedSize.size
      );

      if (sizeInfo && selectedSize.quantity > sizeInfo.quantity) {
        toast.error(
          `Quantity for size ${selectedSize.size} is more than the available quantity`
        );
        hasQuantityError = true;
      }
    });

    if (hasQuantityError) {
      return;
    }

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Product dispensed successfully');
        navigate('/inventory');
        queryClient.invalidateQueries({
          queryKey: `products`,
        });

        setFields({
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
      },

      onError: (e) => {
        toast.error('Error recording transaction');
      },
    });
  };

  const { data: classesAndStudents, isLoading: studentsLoading } =
    useGetStudents();

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
            <h4>Dispense {name} </h4>
            <p>
              Select the student/ buyer name, size, and quantity of the product
              item you want to disburse
            </p>
          </div>
        </div>
        <div className='record-income__body'>
          <TextInput
            label={'Student/ Buyer Name'}
            placeholder={'Student/ Buyer Name'}
            name='name'
            type='dropdown'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={''}
            fieldClass={'input-field'}
            errorMessage={''}
            id={'student-name'}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={true}
            handleSearchValue={handleSearch}
            searchValue={searchValue}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={toggleOption}
            selectedValues={selected}
            options={classesAndStudents || {}}
            disabled={true}
            isMultidropdown={true}
          />

          <TextInput
            label='Size'
            placeholder='Select size'
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
            toggleOption={toggleSizeOption}
            options={sizes?.map((el: any, idx: number) => ({
              id: idx,
              name: el.size,
            }))}
            selectedValues={selectedSize}
          />
          <div className='flex-wrap' style={{ margin: '16px 0' }}>
            {sizes?.map((s: any) => (
              <div className='flex-wrap__item'>
                <p>{s.size}</p>
                <div className='flex-wrap__badge'>
                  <p>{s.quantity} left</p>
                </div>
              </div>
            ))}
          </div>

          {selectedSize.map((s: any, index: number) => (
            <div
              className='record-income__body__selection'
              style={{ gap: '12px', marginBottom: '0px' }}
            >
              <div className='input-component'>
                <label>Quantity ( {s.name} )</label>
                <div className='dropdown-container'>
                  <div
                    className={`dropdown-input ${
                      errors['product_category_name']
                        ? 'error-field'
                        : 'input-field'
                    }`}
                  >
                    <input
                      name='product_category_name'
                      value={sizeQuantityData[index]?.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, e.target.value)
                      }
                    />
                  </div>
                </div>
                {/* <p style={{ fontSize: '12px', color: '#FFA800' }}>
                  Current selling amount is {currency} 8000/{s.name}
                </p> */}
              </div>

              <TextInput
                label={`Total Selling Price per unit (${currency})`}
                placeholder={''}
                name=''
                type='text'
                errorClass={'error-msg'}
                handleChange={handleChange}
                value={Number(
                  Number(sizes.find((item: any) => item.size === s.name)?.spu) *
                    Number(sizeQuantityData[index]?.quantity)
                )?.toLocaleString()}
                fieldClass={errors['quantity'] ? 'error-field' : 'input-field'}
                errorMessage={errors['quantity']}
                id={'quantity'}
                onSelectValue={() => {}}
                isSearchable={false}
                handleSearchValue={function (): void {}}
                searchValue={''}
                handleBlur={handleBlur}
                multi={false}
                toggleOption={() => {}}
                selectedValues={[]}
                disabled={true}
              />
            </div>
          ))}

          <TextInput
            label={'Total Product Quantity'}
            placeholder={'Type product quantity'}
            name='quantity'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={totalQuantity}
            fieldClass={errors['quantity'] ? 'error-field' : 'input-field'}
            errorMessage={errors['quantity']}
            id={'quantity'}
            onSelectValue={() => {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={() => {}}
            selectedValues={[]}
            disabled={true}
          />

          <div style={{ marginTop: '16px' }}></div>

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
        </div>
        <button className='record-income__footer-btn' onClick={() => submit()}>
          {isLoading ? 'Please wait...' : 'Dispense'}
        </button>
      </div>
    </Modal>
  );
};

export default DispenseModal;
