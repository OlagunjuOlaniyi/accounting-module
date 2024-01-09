import React, { useState } from 'react';

import Cancel from '../../../icons/Cancel';

import TextInput from '../../Input/TextInput';
// import "./recordincome.scss";
import Dropzone from 'react-dropzone';
import upload from '../../../assets/cloud_upload.svg';

import toast from 'react-hot-toast';

import { useQueryClient } from 'react-query';

import { useRecordBankTransfer } from '../../../hooks/mutations/chartofAccounts';
import { useGetBankList } from '../../../hooks/queries/banks';

const RecordBankTransfer = ({ close, bankId }: any) => {
  const queryClient = useQueryClient();

  type StateProps = {
    paymentMethod: any;
    amount: string;
    description: string;
    dateOfTransaction: string;
    assetName: string;
    account_name: string;
    account_number: string;
    bank: string;
    charges: string;
    source_bank: string;
    destination_bank: string;
  };

  let todaysDate = new Date().toISOString().substring(0, 10);

  const [fields, setFields] = useState<StateProps>({
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: todaysDate,
    assetName: '',
    account_name: '',
    account_number: '',
    bank: '',
    charges: '',
    source_bank: '',
    destination_bank: '',
  });

  const [errors, setErrors] = useState({
    assetType: '',
    paymentMethod: '',
    amount: '',
    description: '',
    dateOfTransaction: '',
    assetGroup: '',
    assetName: '',
    account_name: '',
    account_number: '',
    bank: '',
    charges: '',
    source_bank: '',
    destination_bank: '',
  });

  //component states
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<any>(null);

  const [bankIds, setBankIds] = useState({
    source_bank: '',
    destination_bank: '',
  });

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

  const { mutate, isLoading } = useRecordBankTransfer();

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });
    if (name === 'source_bank') {
      setBankIds({
        ...bankIds,
        source_bank: id,
      });
    }

    if (name === 'destination_bank') {
      setBankIds({
        ...bankIds,
        destination_bank: id,
      });
    }
  };

  //submit form
  const submit = () => {
    if (isNaN(Number(fields.amount))) {
      toast.error('Amount field can only contain numbers');
      return;
    }

    let dataToSend = {
      amount: fields.amount,
      description: fields.description,
      transaction_method: 2,
      source_bank: bankId,
      destination_bank: bankIds.destination_bank,
      date: fields.dateOfTransaction,
      bank_charges: fields.charges,
    };
    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Transaction successful');
        queryClient.invalidateQueries({
          queryKey: `assets`,
        });
        queryClient.invalidateQueries({
          queryKey: `list-of-banks`,
        });

        setFields({
          paymentMethod: '',
          amount: '',
          description: '',
          dateOfTransaction: '',
          assetName: '',
          account_name: '',
          account_number: '',
          bank: '',
          charges: '',
          destination_bank: '',
          source_bank: '',
        });
      },

      onError: (e) => {
        toast.error(e?.response?.data?.error);
      },
    });
  };

  const { data: bank_accounts } = useGetBankList();

  const formattedBankAccounts = bank_accounts?.data
    ?.filter((d: { id: string }) => d?.id !== bankId)
    ?.map((b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    }));

  return (
    <div className='record-income'>
      <div style={{ background: '#FBFDFE' }}>
        <div className='record-income__cancel'>
          <button className='record-income__cancel__btn' onClick={close}>
            <Cancel />
          </button>
        </div>
        <div className='record-income__heading'>
          <h4>Record bank transfer</h4>
          <p>
            Select the asset amount, and date of the cash deposit you want to
            record
          </p>
        </div>
      </div>
      <div className='record-income__body'>
        <div className='record-income__body__title'>
          <h2>{fields.bank}</h2>
          <div className='record-income__body__title__badge'>
            APPROVAL STATUS: Approved
          </div>
        </div>

        <TextInput
          label={'Transfer Amount'}
          placeholder={'Asset amount'}
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
          label='Destination Bank Account'
          placeholder='Select bank'
          name='destination_bank'
          type='dropdown'
          errorClass={'error-msg'}
          handleChange={handleChange}
          value={fields.destination_bank}
          fieldClass={
            errors['destination_bank'] ? 'error-field' : 'input-field'
          }
          errorMessage={errors['destination_bank']}
          id={'destination_bank'}
          onSelectValue={selectValue}
          isSearchable={false}
          handleSearchValue={function (): void {}}
          searchValue={''}
          handleBlur={undefined}
          multi={false}
          toggleOption={() => {}}
          options={formattedBankAccounts}
          selectedValues={undefined}
        />

        <TextInput
          label={'Transfer Charges Amount'}
          placeholder={'Charges amount'}
          name='charges'
          type='text'
          errorClass={'error-msg'}
          handleChange={handleChange}
          value={fields.charges}
          fieldClass={errors['charges'] ? 'error-field' : 'input-field'}
          errorMessage={errors['charges']}
          id={'charges'}
          onSelectValue={function (a: string, b: string): void {}}
          isSearchable={false}
          handleSearchValue={function (): void {}}
          searchValue={''}
          handleBlur={handleBlur}
          multi={false}
          toggleOption={() => {}}
          selectedValues={undefined}
        />

        <TextInput
          label='Description'
          placeholder='Write anything about the transfer'
          name='description'
          type='textarea'
          errorClass={'error-msg'}
          handleChange={handleChange}
          value={fields.description}
          fieldClass={errors['description'] ? 'error-field' : 'textarea-field'}
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
        onClick={() => {
          submit();
        }}
        disabled={
          fields.amount === '' || fields.dateOfTransaction === '' || isLoading
        }
      >
        {isLoading ? 'Please wait...' : 'Record'}
      </button>
    </div>
  );
};

export default RecordBankTransfer;
