import React, { useState } from 'react';
import Modal from 'react-modal';
import Cancel from '../../../icons/Cancel';
import { IeditModal } from '../../../types/types';
import TextInput from '../../Input/TextInput';
import './recordincome.scss';
import Dropzone from 'react-dropzone';
import upload from '../../../assets/cloud_upload.svg';
import Cash from '../../../icons/Cash';
import Bank from '../../../icons/Bank';
import { useUpdateExpense } from '../../../hooks/mutations/expenses';
import Dot from '../../../icons/Dot';
import { useDebouncedCallback } from 'use-debounce';
import Button from '../../Button/Button';
import Addcircle from '../../../icons/Addcircle';
import { useGetSingleExpenses } from '../../../hooks/queries/expenses';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';

import toast from 'react-hot-toast';

const EditExpense = ({ modalIsOpen, closeModal, selectedId }: IeditModal) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data } = useGetSingleExpenses(id ? id : selectedId);

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

  const close = () => {
    closeModal();
  };

  type StateProps = {
    expenseType: string;
    expenseGroup: string;
    paymentMethod: any;
    amount: string;
    description: string;
    dateOfTransaction: string;
  };

  //let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState<StateProps>({
    expenseType: data?.data[0]?.transaction_type?.name,
    expenseGroup: data?.data[0]?.transaction_group?.name,
    paymentMethod: data?.data[0]?.payment_method,
    amount: data?.data[0]?.amount,
    description: data?.data[0]?.description,
    dateOfTransaction: data?.data[0]?.date,
  });

  const [errors, setErrors] = useState({
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    expenseGroup: '',
    expenseType: '',
  });

  //component states
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<any>(null);
  const [expenseGroupDropdown, setExpenseGroupDopdown] =
    useState<boolean>(false);
  const [selection, setSelection] = useState('post');

  //debounce callback to control expense group dropdown
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setExpenseGroupDopdown(value);
    },
    // delay in ms
    1000
  );

  //handle field change
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    if (evt.target.name === 'expenseGroup' && value != '') {
      debounced(true);
    }

    if (evt.target.name === 'expenseGroup' && value === '') {
      debounced(false);
    }
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

  // select value from dropdown
  const selectValue = (option: string, name: string) => {
    setFields({ ...fields, [name]: option });
  };

  const { mutate, isLoading, isError } = useUpdateExpense();

  //submit form
  const submit = () => {
    let dataToSend = {
      id: id ? id : selectedId,
      payment_method: fields?.paymentMethod?.props?.children[1]
        ? fields?.paymentMethod?.props?.children[1]
        : data?.data[0]?.payment_method,
      amount: fields.amount ? fields.amount : data?.data[0]?.amount,
      description: fields.description
        ? fields.description
        : data?.data[0]?.description,
      transaction_group: fields.expenseGroup
        ? fields.expenseGroup
        : data?.data[0]?.transaction_group?.name,
      transaction_type: fields.expenseType
        ? fields.expenseType
        : data?.data[0]?.transaction_type?.name,
      date: fields.dateOfTransaction
        ? fields.dateOfTransaction
        : data?.data[0]?.date,
      attachment: file ? file[0] : '',
      account: selection === 'post' ? 'old' : 'new',
    };

    if (isNaN(Number(dataToSend.amount))) {
      toast.error('Amount field can only contain numbers');
      return;
    }

    mutate(dataToSend, {
      onSuccess: (res) => {
        queryClient.setQueryData<any>(
          [`expenses-single-${id ? id : selectedId}`],
          (prev: any) => {}
        );

        queryClient.invalidateQueries({
          queryKey: [`expenses-single-${id ? id : selectedId}`],
        });

        queryClient.invalidateQueries({
          queryKey: `expenses`,
        });
        toast.success('Transaction updated successfully');
        close();
      },

      onError: (e) => {
        toast.error(
          'Error recording transaction \nPlease make sure all fields are filled correctly'
        );
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
            <h4>Edit Transaction {data?.data[0]?.transaction_group?.name}</h4>
            <p>
              Select the expense group, type, amount, payment method, and date
              of the income you want to record
            </p>
          </div>
        </div>
        <div className='record-income__body'>
          <div className='record-income__body__title'>
            <h2>Expense Type</h2>
            <div className='record-income__body__title__badge'>
              APPROVAL STATUS: Approved
            </div>
          </div>

          <div className='dropdown-container'>
            <div className='input-component'>
              <label>Expense Group</label>
              <div className='dropdown-container'>
                <div
                  className={`dropdown-input ${
                    errors['expenseGroup'] ? 'error-field' : 'input-field'
                  }`}
                >
                  <input
                    name='expenseGroup'
                    onChange={handleChange}
                    //value={fields.expenseGroup}
                    defaultValue={data?.data[0]?.transaction_type?.name}
                  />
                  <div className='dropdown-tools'>
                    <div className='dropdown-tool'>
                      <Dot type='expense' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {expenseGroupDropdown && (
              <div
                className='dropdown-menu'
                onClick={(e: any) => e.stopPropagation()}
              >
                {[
                  { id: 1, name: 'Depreciation' },
                  { id: 2, name: 'Discount' },
                ].map((el) => (
                  <div
                    className={`dropdown-item`}
                    onClick={() => {
                      setFields({
                        ...fields,
                        expenseGroup: el.name,
                      });
                      setExpenseGroupDopdown(false);
                    }}
                  >
                    <p>{el.name}</p>
                  </div>
                ))}
                <div className='p-5'>
                  <Button
                    disabled={false}
                    btnText='Add as new expense group'
                    btnClass='btn-primary'
                    width='100%'
                    icon={<Addcircle />}
                    onClick={() => {
                      setExpenseGroupDopdown(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <TextInput
            defaultValue={data?.data[0]?.transaction_group?.name}
            label='Expense Type'
            placeholder='Type or select expense type'
            name='expenseType'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            //value={fields.expenseType}
            fieldClass={errors['expenseType'] ? 'error-field' : 'input-field'}
            errorMessage={errors['expenseType']}
            id={'expenseType'}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            selectedValues={undefined}
          />

          <TextInput
            label={selection === 'post' ? 'Amount' : 'Opening Balance'}
            placeholder={
              selection === 'post' ? 'Expense amount' : 'Opening Balance'
            }
            defaultValue={data?.data[0]?.amount}
            name='amount'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            //value={fields.amount}
            fieldClass={errors['amount'] ? 'error-field' : 'input-field'}
            errorMessage={errors['amount']}
            id={'amount'}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            selectedValues={undefined}
          />

          <TextInput
            label='Description'
            placeholder='Write anything about the expense'
            name='description'
            defaultValue={data?.data[0]?.description}
            type='textarea'
            errorClass={'error-msg'}
            handleChange={handleChange}
            //value={fields.description}
            fieldClass={
              errors['description'] ? 'error-field' : 'textarea-field'
            }
            errorMessage={errors['description']}
            id={'description'}
            onSelectValue={function (a: string, b: string): void {}}
            isSearchable={false}
            handleSearchValue={function (): void {}}
            searchValue={''}
            handleBlur={handleBlur}
            multi={false}
            toggleOption={function (a: any): void {
              throw new Error('');
            }}
            selectedValues={undefined}
          />

          <TextInput
            label='Payment Method'
            placeholder='Select payment method'
            //defaultValue={data?.data[0]?.payment_method}
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
            ]}
            selectedValues={undefined}
          />

          <TextInput
            label='Date of Transaction'
            placeholder=''
            name='dateOfTransaction'
            type='date'
            min={new Date().toISOString().split('T')[0]}
            errorClass={'error-msg'}
            handleChange={handleChange}
            //value={fields.dateOfTransaction}
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
            selectedValues={undefined}
            defaultValue={data?.data[0]?.date}
          />
          <div className='input-component'>
            <label>Attachments</label>
          </div>
          <Dropzone
            onDrop={(acceptedFiles) => {
              setFile(acceptedFiles);

              setFileUrl(
                acceptedFiles.map((file) =>
                  Object.assign(file, {
                    preview: URL.createObjectURL(file),
                  })
                )
              );
            }}
          >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
              <section className='image-drop'>
                <div className='image-drop__dash'>
                  <input
                    {...getInputProps()}
                    className='image-drop__input'
                    type='file'
                    accept='.jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*'
                  />
                  <div {...getRootProps()}>
                    <img src={upload} alt='' />

                    <p>Drag and drop files or</p>
                    <p style={{ color: '#439ADE' }}>Browse your computer</p>
                  </div>
                </div>

                {file && (
                  <>
                    <div className='upload-done'>
                      <p>Done !</p>
                    </div>
                    <div className='upload-done__image-name'>
                      <svg
                        width='16'
                        height='20'
                        viewBox='0 0 16 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M10 0H2C0.9 0 0.0100002 0.9 0.0100002 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6L10 0ZM2 18V2H9V7H14V18H2Z'
                          fill='#010C15'
                          fillOpacity='0.7'
                        />
                      </svg>
                      <div className='upload-done__image-name__details'>
                        <p>{file[0]?.path}</p>
                        <p>{Math.round(file[0]?.size * 0.001)} kb</p>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}
          </Dropzone>
        </div>
        <button
          className='record-income__footer-btn'
          onClick={() => submit()}
          disabled={
            fields.amount === '' ||
            fields.dateOfTransaction === '' ||
            fields.expenseGroup === '' ||
            fields.expenseType === '' ||
            fields.paymentMethod === '' ||
            isLoading
          }
        >
          {isLoading ? 'Please wait...' : 'Update'}
        </button>
      </div>
    </Modal>
  );
};

export default EditExpense;
