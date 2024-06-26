import React, { useState } from 'react';
import Modal from 'react-modal';
import Cancel from '../../../icons/Cancel';
import { Imodal } from '../../../types/types';
import TextInput from '../../Input/TextInput';
// import "./recordincome.scss";
import Dropzone from 'react-dropzone';
import upload from '../../../assets/cloud_upload.svg';
import Cash from '../../../icons/Cash';
import Bank from '../../../icons/Bank';

import { useDebouncedCallback } from 'use-debounce';
import Button from '../../Button/Button';
import Addcircle from '../../../icons/Addcircle';
import toast from 'react-hot-toast';

import { useQueryClient } from 'react-query';
import {
  useGetIncomeGroups,
  useGetIncomeTypes,
} from '../../../hooks/queries/incomes';
import { useCreateEquity } from '../../../hooks/mutations/chartofAccounts';

const RecordEquity = ({ modalIsOpen, closeModal }: Imodal) => {
  const queryClient = useQueryClient();
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
    closeModal('income');
  };

  type StateProps = {
    incomeType: string;
    incomeGroup: string;
    paymentMethod: any;
    amount: string;
    description: string;
    dateOfTransaction: string;
    name: string;
  };

  let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState<StateProps>({
    incomeType: '',
    incomeGroup: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: todaysDate,
    name: '',
  });

  const [errors, setErrors] = useState({
    incomeType: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    incomeGroup: '',
    name: '',
  });

  //component states
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<any>(null);
  const [incomeGroupDropdown, setIncomeGroupDopdown] = useState<boolean>(false);
  const [incomeTypeDropdown, setIncomeTypeDopdown] = useState<boolean>(false);
  const [selection, setSelection] = useState('create');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  //debounce callback to control income group dropdown
  const debounced = useDebouncedCallback(
    // function
    (name, value) => {
      if (name === 'incomeGroup') {
        setIncomeGroupDopdown(value);
      } else if (name === 'incomeType') {
        setIncomeTypeDopdown(value);
      }
    },
    // delay in ms
    1000
  );

  //handle dropdown after seconds wth deounced
  const handleDropdown = (target: string, value: string) => {
    switch (target) {
      case 'incomeGroup':
        if (value != '') {
          debounced('incomeGroup', true);
        } else {
          debounced('incomeGroup', false);
        }

        break;

      case 'incomeType':
        if (value != '') {
          debounced('incomeType', true);
        } else {
          debounced('incomeType', false);
        }
    }
  };

  //handle field change
  const handleChange = (evt: any) => {
    const value = evt.target.value;
    handleDropdown(evt.target.name, value);
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

  const { mutate, isLoading, isSuccess, isError } = useCreateEquity();

  //get expense groups
  const { data: groups } = useGetIncomeGroups();

  //get expense types
  const { data: types, refetch } = useGetIncomeTypes(selectedGroupId);

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    setSelectedGroupId(id);
    //refetch expense type
    setTimeout(() => {
      refetch();
    }, 500);
  };

  //submit form
  const submit = () => {
    if (isNaN(Number(fields.amount))) {
      toast.error('Amount field can only contain numbers');
      return;
    }

    let dataToSend = {
      payment_method: fields.paymentMethod.props.children[1],
      amount: fields.amount,
      description: fields.description,
      transaction_group: fields.incomeGroup,
      transaction_type: fields.incomeType,
      date: fields.dateOfTransaction,
      attachment: file ? file[0] : '',
      name: fields.name,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Transaction recorded successfully');
        queryClient.invalidateQueries({
          queryKey: `equity`,
        });

        setFields({
          incomeType: '',
          incomeGroup: '',
          paymentMethod: '',
          amount: '',
          description: '',
          dateOfTransaction: todaysDate,
          name: '',
        });
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
            <h4>Create Equity</h4>
            <p>
              Select the equity group, type, amount, payment method, and date of
              the income you want to record
            </p>
          </div>
        </div>
        <div className='record-income__body'>
          <div className='record-income__body__title'>
            <h2>Equity Name</h2>
            <div className='record-income__body__title__badge'>
              APPROVAL STATUS: Pending
            </div>
          </div>

          {selection === 'create' ? (
            <div className='dropdown-container'>
              <div className='input-component'>
                <label>Equity Group</label>
                <div className='dropdown-container'>
                  <div
                    className={`dropdown-input ${
                      errors['incomeGroup'] ? 'error-field' : 'input-field'
                    }`}
                  >
                    <input
                      name='incomeGroup'
                      onChange={handleChange}
                      value={fields.incomeGroup}
                    />
                    <div className='dropdown-tools'>
                      <div className='dropdown-tool'>
                        <div className='equity'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {incomeGroupDropdown && (
                <div
                  className='dropdown-menu-copy'
                  onClick={(e: any) => e.stopPropagation()}
                >
                  {groups?.data
                    ?.filter((el: { name: string }) =>
                      el.name
                        ?.toLowerCase()
                        .includes(fields.incomeGroup?.toLowerCase())
                    )
                    .map((el: any) => (
                      <div
                        className={`dropdown-item`}
                        onClick={() => {
                          setFields({
                            ...fields,
                            incomeGroup: el.name,
                          });
                          setIncomeGroupDopdown(false);
                        }}
                      >
                        <p>{el.name}</p>
                      </div>
                    ))}
                  <div className='p-5'>
                    <Button
                      disabled={false}
                      btnText='Add as new income group'
                      btnClass='btn-primary'
                      width='100%'
                      icon={<Addcircle />}
                      onClick={() => {
                        setIncomeGroupDopdown(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <TextInput
              label='Equity Group'
              placeholder='Type Equity group'
              name='equityGroup'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.incomeGroup}
              fieldClass={errors['incomeGroup'] ? 'error-field' : 'input-field'}
              errorMessage={errors['incomeGroup']}
              id={'incomeGroup'}
              onSelectValue={selectValue}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={handleBlur}
              multi={false}
              toggleOption={function (a: any): void {
                throw new Error('');
              }}
              selectedValues={undefined}
              options={groups?.data}
            />
          )}

          {selection === 'create' ? (
            <div className='dropdown-container'>
              <div className='input-component'>
                <label>Equity Type</label>
                <div className='dropdown-container'>
                  <div
                    className={`dropdown-input ${
                      errors['incomeGroup'] ? 'error-field' : 'input-field'
                    }`}
                  >
                    <input
                      name='incomeType'
                      onChange={handleChange}
                      value={fields.incomeType}
                    />
                    <div className='dropdown-tools'>
                      <div className='dropdown-tool'>
                        <div className='equity'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {incomeTypeDropdown && (
                <div
                  className='dropdown-menu-copy'
                  onClick={(e: any) => e.stopPropagation()}
                >
                  {types?.data?.map((el: { name: string }) => (
                    <div
                      className={`dropdown-item`}
                      onClick={() => {
                        setFields({
                          ...fields,
                          incomeType: el.name,
                        });
                        setIncomeTypeDopdown(false);
                      }}
                    >
                      <p>{el.name}</p>
                    </div>
                  ))}
                  <div className='p-5'>
                    <Button
                      disabled={false}
                      btnText='Add as new income type'
                      btnClass='btn-primary'
                      width='100%'
                      icon={<Addcircle />}
                      onClick={() => {
                        setIncomeTypeDopdown(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <TextInput
              label='Equity Type'
              placeholder='Type or select Equity type'
              name='incomeType'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.incomeType}
              fieldClass={errors['incomeType'] ? 'error-field' : 'input-field'}
              errorMessage={errors['incomeType']}
              id={'incomeType'}
              onSelectValue={selectValue}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={handleBlur}
              multi={false}
              toggleOption={function (a: any): void {
                throw new Error('');
              }}
              options={types?.data}
              selectedValues={undefined}
            />
          )}

          <TextInput
            label='Equity Name'
            placeholder='Equity Name'
            name='name'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.name}
            fieldClass={errors['name'] ? 'error-field' : 'input-field'}
            errorMessage={errors['name']}
            id={'name'}
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
              selection === 'post' ? 'Income amount' : 'Opening Balance'
            }
            name='amount'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.amount}
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
            placeholder='Write anything about the income'
            name='description'
            type='textarea'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.description}
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
            selectedValues={undefined}
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
                    {file.map((el: any) => (
                      <div className='upload-done__image-name' key={el.path}>
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
                          <p>{el?.path}</p>
                          <p>{Math.round(el?.size * 0.001)} kb</p>
                        </div>
                        <div
                          style={{
                            justifySelf: 'baseline',
                            marginLeft: 'auto',
                          }}
                          onClick={() => setFile(null)}
                        >
                          <Cancel />
                        </div>
                      </div>
                    ))}
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
            fields.incomeGroup === '' ||
            fields.incomeType === '' ||
            fields.paymentMethod === '' ||
            isLoading
          }
        >
          {isLoading ? 'Please wait...' : 'Record'}
        </button>
      </div>
    </Modal>
  );
};

export default RecordEquity;
