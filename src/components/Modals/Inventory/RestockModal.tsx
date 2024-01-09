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

import { useRestockProduct } from '../../../hooks/mutations/inventory';
import { useParams, useNavigate } from 'react-router';
import ThumbsIcon from '../../../icons/ThumbsIcon';
import RadioChecked from '../../../icons/RadioChecked';
import RadioUnchecked from '../../../icons/RadioUnchecked';
import { sizeOptions } from '../../../data';
import { useCurrency } from '../../../context/CurrencyContext';

interface SizeQuantiyData {
  size: string;
  quantity: number;
  ppu: number;
  spu: number;
}

interface RestockModalProps extends Imodal {
  purchasing_price: number;
  category_name: string;
}

const RestockModal = ({
  modalIsOpen,
  closeModal,
  name,
  sizes,
  purchasing_price,
  category_name,
}: RestockModalProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<any>([]);

  const [sizeQuantityData, setSizeQuantityData] = useState<SizeQuantiyData[]>(
    []
  );
  const [sameUnitPrice, setSameUnitPrice] = useState(false);
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

  const handleQuantityChange = (index: number, value: string) => {
    const updatedFormData = [...sizeQuantityData];
    updatedFormData[index].quantity = Number(value);
    setSizeQuantityData(updatedFormData);
  };

  const handlePriceChange = (index: number, value: string) => {
    const updatedFormData = [...sizeQuantityData];
    updatedFormData[index].ppu = Number(value);
    updatedFormData[index].spu = Number(value);
    setSizeQuantityData(updatedFormData);
  };

  const totalQuantity = sizeQuantityData.reduce((total, item) => {
    return total + (item.quantity ? Number(item.quantity) : 0);
  }, 0);

  const totalPrice = sizeQuantityData.reduce((total, item) => {
    return total + (item.ppu ? Number(item.ppu) : 0);
  }, 0);

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

  const initialSizeQuantityData: SizeQuantiyData[] = selected.map((s: any) => ({
    size: s.name,
    quantity: '',
    ppu: '',
  }));
  useEffect(() => {
    setSizeQuantityData(initialSizeQuantityData);
  }, [selected]);

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

  const { mutate, isLoading } = useRestockProduct(id || '');

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
    const isEmptyQuantity = sizeQuantityData.some((item) => !item.quantity);
    if (isEmptyQuantity) {
      toast.error('Quantity cannot be empty');
      return;
    }

    let dataToSend = {
      sizes: sizeQuantityData,
      payment_method:
        fields.paymentMethod.props.children[1] === 'Bank'
          ? bankId
          : fields.paymentMethod.props.children[1],
      restocking_same_unit_price: sameUnitPrice,
      date: todaysDate,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Product restocked successfully');
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
            <h4>Restock {name} </h4>
            <p>
              Select the student/ buyer name, size, and quantity of the product
              item you want to restock
            </p>
          </div>
        </div>

        <div className='record-income__body'>
          <div className='input-component' style={{ marginTop: '32px' }}>
            <label>Are you restocking with the same unit price?</label>
          </div>
          <div className='record-income__body__selection'>
            <button
              className={`record-income__body__selection__btn ${
                sameUnitPrice ? 'selected-btn' : 'unselected-btn'
              }`}
              onClick={() => setSameUnitPrice(true)}
            >
              <ThumbsIcon type={sameUnitPrice ? 'yes' : 'no'} /> <p>Yes</p>
              {sameUnitPrice ? <RadioChecked /> : <RadioUnchecked />}
            </button>

            <button
              className={`record-income__body__selection__btn ${
                !sameUnitPrice ? 'selected-btn' : 'unselected-btn'
              }`}
              onClick={() => setSameUnitPrice(!sameUnitPrice)}
            >
              <ThumbsIcon type={!sameUnitPrice ? 'yes' : 'no'} />
              <p>No</p>
              {!sameUnitPrice ? <RadioChecked /> : <RadioUnchecked />}
            </button>
          </div>
          <p
            style={{ color: '#FFA800', fontSize: '12px', marginBottom: '12px' }}
          >
            Current Purchasing Amount is {currency}{' '}
            {purchasing_price?.toLocaleString()}/{name}
          </p>
          {/* <TextInput
            label={'Student/ Buyer Name'}
            placeholder={'Student/ Buyer Name'}
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
          /> */}

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
            toggleOption={toggleOption}
            options={
              sizeOptions[category_name?.toLowerCase().split(' ').join('')]
            }
            selectedValues={selected}
          />
          <div className='flex-wrap' style={{ marginBottom: '16px' }}>
            {sizes?.map((s: any) => (
              <div className='flex-wrap__item'>
                <p>{s.size}</p>
                <div className='flex-wrap__badge'>
                  <p>{s.quantity} left</p>
                </div>
              </div>
            ))}
          </div>

          {selected.map((s: any, index: number) => (
            <div style={{ display: 'flex', gap: '12px' }}>
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
              </div>

              <div className='input-component'>
                <label>Total Selling Price per unit</label>
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
                      value={sizeQuantityData[index]?.ppu}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </div>
                </div>
              </div>
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

          <TextInput
            label={'Total purchasing price per unit'}
            placeholder={`Total product purchasing amount (${currency})`}
            name='total'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={totalPrice?.toLocaleString()}
            fieldClass={errors['total'] ? 'error-field' : 'input-field'}
            errorMessage={errors['total']}
            id={'total'}
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
        <button
          className='record-income__footer-btn'
          onClick={() => submit()}
          disabled={fields.paymentMethod === '' || selected.length === 0}
        >
          {isLoading ? 'Please wait...' : 'Restock'}
        </button>
      </div>
    </Modal>
  );
};

export default RestockModal;
