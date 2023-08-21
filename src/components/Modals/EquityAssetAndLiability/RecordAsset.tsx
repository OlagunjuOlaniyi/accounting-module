import React, { useState, useEffect } from 'react';
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
import { useCreateIncome } from '../../../hooks/mutations/incomes';
import { useQueryClient } from 'react-query';
import {
  useGetIncomeGroups,
  useGetIncomeTypes,
} from '../../../hooks/queries/incomes';
import {
  useGetAssetGroups,
  useGetAssetTypes,
} from '../../../hooks/queries/chartOfAccount';
import { useCreateAsset } from '../../../hooks/mutations/chartofAccounts';

const RecordLiability = ({ modalIsOpen, closeModal }: Imodal) => {
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
    closeModal('asset');
  };

  type StateProps = {
    assetType: string;
    assetGroup: string;
    paymentMethod: any;
    amount: string;
    description: string;
    dateOfTransaction: string;
    assetName: string;
  };

  let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState<StateProps>({
    assetType: '',
    assetGroup: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: todaysDate,
    assetName: '',
  });

  const [errors, setErrors] = useState({
    assetType: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    assetGroup: '',
    assetName: '',
  });

  //component states
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<any>(null);
  const [assetGroupDropdown, setAssetGroupDopdown] = useState<boolean>(false);
  const [assetTypeDropdown, setAssetTypeDopdown] = useState<boolean>(false);
  const [selection, setSelection] = useState('create');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  //debounce callback to control income group dropdown
  const debounced = useDebouncedCallback(
    // function
    (name, value) => {
      if (name === 'assetGroup') {
        setAssetGroupDopdown(value);
      } else if (name === 'assetType') {
        setAssetTypeDopdown(value);
      }
    },
    // delay in ms
    1000
  );

  //handle dropdown after seconds wth deounced
  const handleDropdown = (target: string, value: string) => {};

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

  const { mutate, isLoading, isSuccess, isError } = useCreateAsset();

  //get expense groups
  const { data: groups } = useGetAssetGroups();

  //get expense types
  const { data: types, refetch } = useGetAssetTypes();

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
      transaction_group: fields.assetGroup,
      transaction_type: fields.assetType,
      date: fields.dateOfTransaction,
      attachment: file ? file[0] : '',
      name: fields.assetName,
      account: fields.assetName,
    };

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Asset recorded successfully');
        queryClient.invalidateQueries({
          queryKey: `assets`,
        });

        setFields({
          assetType: '',
          assetGroup: '',
          paymentMethod: '',
          amount: '',
          description: '',
          dateOfTransaction: todaysDate,
          assetName: '',
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
            <h4>Create Asset</h4>
            <p>
              Select the Asset group, type, amount, payment method, and date of
              the income you want to record
            </p>
          </div>
        </div>
        <div className='record-income__body'>
          <div className='record-income__body__title'>
            <h2>Asset Name</h2>
            <div className='record-income__body__title__badge'>
              APPROVAL STATUS: Pending
            </div>
          </div>

          {selection === 'create' ? (
            <div className='dropdown-container'>
              <div className='input-component'>
                <label>Asset Group</label>
                <div className='dropdown-container'>
                  <div
                    className={`dropdown-input ${
                      errors['assetGroup'] ? 'error-field' : 'input-field'
                    }`}
                  >
                    <input
                      name='assetGroup'
                      onChange={handleChange}
                      value={fields.assetGroup}
                    />
                    <div
                      className='dropdown-tools'
                      onClick={() => setAssetGroupDopdown(!assetGroupDropdown)}
                    >
                      <div className='dropdown-tool'>
                        <div className='asset'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {assetGroupDropdown && (
                <div
                  className='dropdown-menu-copy'
                  onClick={(e: any) => e.stopPropagation()}
                >
                  {groups?.data
                    ?.filter((el: { name: string }) =>
                      el.name
                        ?.toLowerCase()
                        .includes(fields.assetGroup?.toLowerCase())
                    )
                    .map((el: any) => (
                      <div
                        className={`dropdown-item`}
                        onClick={() => {
                          setFields({
                            ...fields,
                            assetGroup: el.name,
                          });
                          setAssetGroupDopdown(false);
                        }}
                      >
                        <p>{el.name}</p>
                      </div>
                    ))}
                  <div className='p-5'>
                    <Button
                      disabled={false}
                      btnText='Add as new asset group'
                      btnClass='btn-primary'
                      width='100%'
                      icon={<Addcircle />}
                      onClick={() => {
                        setAssetGroupDopdown(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <TextInput
              label='Asset Group'
              placeholder='Type Asset group'
              name='assetGroup'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.assetGroup}
              fieldClass={errors['assetGroup'] ? 'error-field' : 'input-field'}
              errorMessage={errors['assetGroup']}
              id={'assetGroup'}
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
                <label>Asset Type</label>
                <div className='dropdown-container'>
                  <div
                    className={`dropdown-input ${
                      errors['assetGroup'] ? 'error-field' : 'input-field'
                    }`}
                  >
                    <input
                      name='assetType'
                      onChange={handleChange}
                      value={fields.assetType}
                    />
                    <div
                      className='dropdown-tools'
                      onClick={() => setAssetTypeDopdown(!assetTypeDropdown)}
                    >
                      <div className='dropdown-tool'>
                        <div className='asset'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {assetTypeDropdown && (
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
                          assetType: el.name,
                        });
                        setAssetTypeDopdown(false);
                      }}
                    >
                      <p>{el.name}</p>
                    </div>
                  ))}
                  <div className='p-5'>
                    <Button
                      disabled={false}
                      btnText='Add as new asset type'
                      btnClass='btn-primary'
                      width='100%'
                      icon={<Addcircle />}
                      onClick={() => {
                        setAssetTypeDopdown(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <TextInput
              label='Asset Type'
              placeholder='Type or select Asset type'
              name='assetType'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.assetType}
              fieldClass={errors['assetType'] ? 'error-field' : 'input-field'}
              errorMessage={errors['assetType']}
              id={'assetType'}
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
            label='Asset Name'
            placeholder='Asset Name'
            name='assetName'
            type='text'
            errorClass={'error-msg'}
            handleChange={handleChange}
            value={fields.assetName}
            fieldClass={errors['assetName'] ? 'error-field' : 'input-field'}
            errorMessage={errors['assetName']}
            id={'assetName'}
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
              selection === 'post' ? 'Asset amount' : 'Opening Balance'
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
            fields.assetGroup === '' ||
            fields.assetType === '' ||
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

export default RecordLiability;
