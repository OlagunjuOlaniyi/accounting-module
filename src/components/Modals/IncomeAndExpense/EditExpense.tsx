import React, { useEffect, useState } from 'react';
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
import {
  useGetExpenseGroups,
  useGetExpenseTypes,
  useGetSingleExpenses,
} from '../../../hooks/queries/expenses';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router';

import toast from 'react-hot-toast';
import { useGetBankList } from '../../../hooks/queries/banks';
import Credit from '../../../icons/Credit';

const EditExpense = ({ modalIsOpen, closeModal, selectedId }: IeditModal) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data } = useGetSingleExpenses(id ? id : selectedId);

  const { data: bank_accounts } = useGetBankList();
  const formattedBankAccounts = bank_accounts?.data?.map(
    (b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    })
  );

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
    bank: string;
  };

  //let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState<StateProps>({
    expenseType: '',
    expenseGroup: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    bank: '',
  });
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  useEffect(() => {
    setFields({
      ...fields,
      expenseType: data?.data?.transaction_type?.name,
      expenseGroup: data?.data?.transaction_group?.name,
      paymentMethod: data?.data?.payment_method,
      amount: data?.data?.amount,
      description: data?.data?.description,
      dateOfTransaction: data?.data?.date,
    });
  }, [data]);

  const [errors, setErrors] = useState({
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    expenseGroup: '',
    expenseType: '',
    bank: '',
  });

  //component states
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<any>(null);
  const [expenseGroupDropdown, setExpenseGroupDopdown] =
    useState<boolean>(false);
  const [selection, setSelection] = useState('post');
  const [expenseTypeDropdown, setExpenseTypeDopdown] = useState<boolean>(false);
  const [bankId, setBankId] = useState('');

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
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    if (name === 'bank') {
      setBankId(id);
    }
    setSelectedGroupId(id);
    //refetch expense type
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const { mutate, isLoading, isError } = useUpdateExpense();

  //submit form
  const submit = () => {
    let dataToSend = {
      id: id ? id : selectedId,
      payment_method:
        fields.paymentMethod.props.children[1] === 'Bank'
          ? bankId
          : fields?.paymentMethod?.props?.children[1]
          ? fields?.paymentMethod?.props?.children[1]
          : data?.data?.payment_method,
      amount: fields.amount ? fields.amount : data?.data?.amount,
      description: fields.description
        ? fields.description
        : data?.data?.description,
      transaction_group: fields.expenseGroup
        ? fields.expenseGroup
        : data?.data?.transaction_group?.name,
      transaction_type: fields.expenseType
        ? fields.expenseType
        : data?.data?.transaction_type?.name,
      date: fields.dateOfTransaction
        ? fields.dateOfTransaction
        : data?.data?.date,
      attachment: file ? file : '',
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

  //get expense groups
  const { data: groups } = useGetExpenseGroups();

  //get expense types
  const { data: types, refetch } = useGetExpenseTypes(selectedGroupId);

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
            <h4>Edit Transaction {data?.data?.transaction_group?.name}</h4>
            <p>
              Select the expense group, type, amount, payment method, and date
              of the expense you want to update
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
                    value={fields.expenseGroup}
                  />
                  <div className='dropdown-tools'>
                    <div
                      className='dropdown-tool'
                      onClick={() =>
                        setExpenseGroupDopdown(!expenseGroupDropdown)
                      }
                    >
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
                {groups?.data?.map((el: { name: string; id: string }) => (
                  <div
                    className={`dropdown-item`}
                    onClick={() => {
                      selectValue(el.name, 'expenseGroup', el.id);
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

          <div className='dropdown-container'>
            <div className='input-component'>
              <label>Expense Type</label>
              <div className='dropdown-container'>
                <div
                  className={`dropdown-input ${
                    errors['expenseType'] ? 'error-field' : 'input-field'
                  }`}
                >
                  <input
                    name='expenseType'
                    onChange={handleChange}
                    value={fields.expenseType}
                  />
                  <div className='dropdown-tools'>
                    <div
                      className='dropdown-tool'
                      onClick={() =>
                        setExpenseTypeDopdown(!expenseTypeDropdown)
                      }
                    >
                      <Dot type='expense' />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {expenseTypeDropdown && (
              <div
                className='dropdown-menu-copy'
                onClick={(e: any) => e.stopPropagation()}
              >
                {types?.expense_type?.map(
                  (el: { name: string; id: string }) => (
                    <div
                      className={`dropdown-item`}
                      onClick={() => {
                        selectValue(el.name, 'expenseType', el.id);
                        setExpenseTypeDopdown(false);
                      }}
                    >
                      <p>{el.name}</p>
                    </div>
                  )
                )}
                <div className='p-5'>
                  <Button
                    disabled={false}
                    btnText='Add as new expense type'
                    btnClass='btn-primary'
                    width='100%'
                    icon={<Addcircle />}
                    onClick={() => {
                      setExpenseTypeDopdown(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <TextInput
            label={selection === 'post' ? 'Amount' : 'Opening Balance'}
            placeholder={
              selection === 'post' ? 'Expense amount' : 'Opening Balance'
            }
            defaultValue={data?.data?.amount}
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
            defaultValue={data?.data?.description}
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
            //defaultValue={data?.data?.payment_method}
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
              fieldClass={errors['bank']? 'error-field' : 'input-field'}
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
            defaultValue={data?.data?.date}
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
                        <p>{file?.path}</p>
                        <p>{Math.round(file?.size * 0.001)} kb</p>
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
