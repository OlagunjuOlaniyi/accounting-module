import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Cancel from '../../../icons/Cancel';
import { Imodal } from '../../../types/types';
import TextInput from '../../Input/TextInput';
import './inventory.scss';
import Dropzone from 'react-dropzone';
import upload from '../../../assets/cloud_upload.svg';
import Cash from '../../../icons/Cash';
import Bank from '../../../icons/Bank';
import Dot from '../../../icons/Dot';
import Button from '../../Button/Button';
import Addcircle from '../../../icons/Addcircle';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { useGetBankList } from '../../../hooks/queries/banks';
import Credit from '../../../icons/Credit';
import SelectArrow from '../../../icons/SelectArrow';
import { useEditProduct } from '../../../hooks/mutations/inventory';
import { groupOptions, sizeOptions } from '../../../data';
import { useParams } from 'react-router';
import ThumbsIcon from '../../../icons/ThumbsIcon';
import RadioChecked from '../../../icons/RadioChecked';
import RadioUnchecked from '../../../icons/RadioUnchecked';
import SizePriceComponent, {
  SizePrice,
} from '../../SizePriceComponent/SizePriceComponent';
import AddCircleBlue from '../../../icons/AddCircleBlue';
import { useCurrency } from '../../../context/CurrencyContext';

interface SizeQuantiyData {
  size: string;
  quantity: number;
}

interface EditProps extends Imodal {
  data: any;
  isLoading: boolean;
}

const EditProduct = ({
  modalIsOpen,
  closeModal,
  data,
  isLoading,
}: EditProps) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { currency } = useCurrency();

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

  useEffect(() => {
    setFields({
      paymentMethod: data?.data?.payment_method,
      amount: data?.data?.general_selling_price,
      description: data?.data?.description,
      dateOfTransaction: todaysDate,
      bank: '',
      quantity: '',
      name: data?.data?.name,
      product_group_name: data?.data?.product_group?.name,
      product_category_name: data?.data?.product_group?.category?.name,
      reOrderLevel: data?.data?.reorder_level,
      size: '',
      ppu: data?.data?.sizes[0]?.ppu,
      spu: data?.data?.sizes[0]?.spu,
      total: data?.data?.general_purchasing_price,
    });

    setSelected(
      data?.data?.sizes?.map((s: any) => ({
        id: s.size,
        name: s.size,
        quantity: s.quantity,
      })) || []
    );
    setSizePrices(data?.data?.sizes);

    setSameUnitPrice(data?.data?.same_unit_price);
  }, [data]);

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
  const [file, setFile] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<any>(null);
  const [incomeGroupDropdown, setIncomeGroupDopdown] = useState<boolean>(false);
  const [incomeTypeDropdown, setIncomeTypeDopdown] = useState<boolean>(false);
  const [existingProduct, setExisitingProduct] = useState(false);

  const [bankId, setBankId] = useState('');
  const [selected, setSelected] = useState<any>([]);

  const [sizeQuantityData, setSizeQuantityData] = useState<SizeQuantiyData[]>(
    []
  );
  const [sameUnitPrice, setSameUnitPrice] = useState(true);
  const [sizePrices, setSizePrices] = useState<SizePrice[]>([
    { size: '', quantity: '', ppu: '', spu: '' },
  ]);

  const handleAddSizePrice = () => {
    setSizePrices([
      ...sizePrices,
      { size: '', quantity: '', ppu: '', spu: '' },
    ]);
  };
  const handleSizePriceChange = (
    index: number,
    updatedSizePrice: SizePrice
  ) => {
    const updatedSizePrices = [...sizePrices];
    updatedSizePrices[index] = updatedSizePrice;
    setSizePrices(updatedSizePrices);
  };

  const handleDeleteSizePrice = (index: number) => {
    const updatedSizePrices = [...sizePrices];
    updatedSizePrices.splice(index, 1);
    setSizePrices(updatedSizePrices);
  };

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

  const { mutate } = useEditProduct(id || '');

  const { data: bank_accounts } = useGetBankList();

  const formattedBankAccounts = bank_accounts?.data?.map(
    (b: { id: any; account_name: any }) => ({
      id: b.id,
      name: b.account_name,
    })
  );

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

  // select value from dropdown
  const selectValue = (option: string, name: string, id: string) => {
    setFields({ ...fields, [name]: option });

    if (name === 'bank') {
      setBankId(id);
    }
  };

  const initialSizeQuantityData: SizeQuantiyData[] = selected.map((s: any) => ({
    size: s.name,
    quantity: s.quantity,
  }));
  useEffect(() => {
    // const initialSizeQuantityData: SizeQuantiyData[] =
    //   data?.data?.sizes.map((s: any) => ({
    //     size: s.size,
    //     quantity: s.quantity,
    //   })) || [];

    setSizeQuantityData(initialSizeQuantityData);
  }, [selected]);

  const handleQuantityChange = (index: number, value: string) => {
    const updatedFormData = [...sizeQuantityData];
    updatedFormData[index].quantity = Number(value);
    setSizeQuantityData(updatedFormData);
  };

  const totalPpu =
    sizeQuantityData.reduce((total, item) => {
      return total + (item.quantity ? Number(item.quantity) : 0);
    }, 0) * Number(fields.ppu);

  const totalQuantity = sameUnitPrice
    ? sizeQuantityData?.reduce((total, item) => {
        return total + (item.quantity ? Number(item.quantity) : 0);
      }, 0)
    : sizePrices?.reduce((total, item) => {
        return total + (item.quantity ? Number(item.quantity) : 0);
      }, 0);

  //submit form
  const submit = () => {
    const updatedSizes = sizeQuantityData.map((item) => ({
      ...item,
      ppu: Number(fields.ppu),
      spu: Number(fields.spu),
    }));

    if (sameUnitPrice && sizeQuantityData.length === 0) {
      toast.error('Sizes cannot be empty');
    }

    let dataToSend = {
      name: fields.name,
      is_newly_purchased: !existingProduct,
      reorder_level: fields.reOrderLevel,
      payment_method:
        fields?.paymentMethod?.props?.children[1] === 'Bank'
          ? bankId
          : fields?.paymentMethod?.props?.children[1] === 'Credit'
          ? 'Credit'
          : fields?.paymentMethod?.props?.children[1] === 'CASH'
          ? 'CASH'
          : data?.data?.payment_method,
      amount: fields.amount,
      description: fields.description,
      product_group_name: fields.product_group_name,
      product_category_name: fields.product_category_name,
      date: fields.dateOfTransaction,
      spu: fields.spu,
      ppu: fields.ppu,
      sizes: sameUnitPrice ? updatedSizes : sizePrices,
    };

    if (file) {
      if (file.map((el: any) => Math.round((el?.size / 1024) * 0.001)) > 1) {
        toast.error('Image cannot be more than 1mb');
        return;
      }

      dataToSend.image = file[0];
    }

    mutate(dataToSend, {
      onSuccess: (res) => {
        close();
        toast.success('Product updated successfully');
        queryClient.invalidateQueries({
          queryKey: `single-product-${id}`,
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
        const errorMessages = Object.keys(e?.response?.data?.error).map(
          (key) => {
            const errorMessage = e?.response?.data?.error[key].map(
              (message: string) => {
                // Removing the double quotes and escaping characters
                return message.replace(/"/g, '');
              }
            );
            return `${key}: ${errorMessage.join(', ')}`;
          }
        );

        toast.error(errorMessages.join(', ') || 'Error editing product');
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
      {isLoading ? (
        <div>Please wait...</div>
      ) : (
        <div className='record-income'>
          <div style={{ background: '#FBFDFE' }}>
            <div className='record-income__cancel'>
              <button className='record-income__cancel__btn' onClick={close}>
                <Cancel />
              </button>
            </div>
            <div className='record-income__heading'>
              <h4>Edit Product</h4>
              <p>
                Select the product category, group, name, size, amount, payment
                method, and date <br /> of the product item you want to edit
              </p>
            </div>
          </div>
          <div className='record-income__body'>
            <div className='record-income__body__title'>
              <h2>{fields?.product_category_name}</h2>
            </div>
            <div className='input-component' style={{ marginTop: '32px' }}>
              <label>Is this an existing product item?</label>
            </div>
            <div className='record-income__body__selection'>
              <button
                className={`record-income__body__selection__btn ${
                  existingProduct ? 'selected-btn' : 'unselected-btn'
                }`}
                onClick={() => setExisitingProduct(true)}
              >
                <ThumbsIcon type={existingProduct ? 'yes' : 'no'} /> <p>Yes</p>
                {existingProduct ? <RadioChecked /> : <RadioUnchecked />}
              </button>

              <button
                className={`record-income__body__selection__btn ${
                  !existingProduct ? 'selected-btn' : 'unselected-btn'
                }`}
                onClick={() => setExisitingProduct(!existingProduct)}
              >
                <ThumbsIcon type={!existingProduct ? 'yes' : 'no'} />
                <p>No</p>
                {!existingProduct ? <RadioChecked /> : <RadioUnchecked />}
              </button>
            </div>

            <div className='dropdown-container'>
              <div className='input-component'>
                <label>Product Category</label>
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
                      onChange={handleChange}
                      value={fields.product_category_name}
                      disabled
                    />
                    <div
                      className='dropdown-tools'
                      onClick={() =>
                        setIncomeGroupDopdown(!incomeGroupDropdown)
                      }
                    >
                      <div
                        className='dropdown-tool'
                        style={{ display: 'flex', gap: '12px' }}
                      >
                        <Dot type='income' />
                        <SelectArrow />
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
                  {[
                    { id: 1, name: 'CLOTHINGS' },
                    { id: 2, name: 'Books and Stationaries' },
                    { id: 3, name: 'Drug' },
                    { id: 4, name: 'Provisions and Toiletries' },
                  ].map((el: any) => (
                    <div
                      className={`dropdown-item`}
                      onClick={() => {
                        setFields({
                          ...fields,
                          product_category_name: el.name,
                        });
                        setSelected([]);
                        setIncomeGroupDopdown(false);
                      }}
                    >
                      <p>{el.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='dropdown-container'>
              <div className='input-component'>
                <label>Product Group</label>
                <div className='dropdown-container'>
                  <div
                    className={`dropdown-input ${
                      errors['product_group_name']
                        ? 'error-field'
                        : 'input-field'
                    }`}
                  >
                    <input
                      name='product_group_name'
                      onChange={handleChange}
                      value={fields.product_group_name}
                      disabled
                    />
                    <div className='dropdown-tools'>
                      <div
                        className='dropdown-tool'
                        style={{ display: 'flex', gap: '12px' }}
                        onClick={() =>
                          setIncomeTypeDopdown(!incomeTypeDropdown)
                        }
                      >
                        <Dot type='income' />
                        <SelectArrow />
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
                  {groupOptions[
                    fields.product_category_name
                      ?.toLowerCase()
                      .split(' ')
                      .join('')
                  ]?.map((el: { name: string }) => (
                    <div
                      className={`dropdown-item`}
                      onClick={() => {
                        setFields({
                          ...fields,
                          product_group_name: el.name,
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
                      btnText='Add as new product group'
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

            <TextInput
              label={'Product Name'}
              placeholder={'Product Name'}
              name='name'
              type='text'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.name}
              fieldClass={errors['name'] ? 'error-field' : 'input-field'}
              errorMessage={errors['name']}
              id={'name'}
              onSelectValue={() => {}}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={handleBlur}
              multi={false}
              toggleOption={() => {}}
              selectedValues={[]}
            />
            <div className='input-component'>
              <label>
                Did you purchase this item(s) at the same unit price?
              </label>
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
              style={{
                fontSize: '12px',
                color: '#FFA800',
                marginBottom: '12px',
              }}
            >
              {sameUnitPrice
                ? 'You can always select multiple sizes of product with the same unit price'
                : 'You will only be able to select multiple sizes of product with the same unit price'}
            </p>

            <div>
              {sameUnitPrice ? (
                <>
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
                      sizeOptions[
                        fields.product_category_name
                          ?.toLowerCase()
                          .split(' ')
                          .join('')
                      ]
                    }
                    selectedValues={selected}
                  />
                  {selected.map((s: any, index: number) => (
                    <div>
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
                    </div>
                  ))}
                  <div
                    className='record-income__body__selection'
                    style={{ gap: '12px', marginBottom: '0px' }}
                  >
                    <TextInput
                      label={'Purchasing Price per unit'}
                      placeholder={`Product purchasing amount (${currency})`}
                      name='ppu'
                      type='text'
                      errorClass={'error-msg'}
                      handleChange={handleChange}
                      value={fields.ppu}
                      fieldClass={errors['ppu'] ? 'error-field' : 'input-field'}
                      errorMessage={errors['ppu']}
                      id={'ppu'}
                      onSelectValue={() => {}}
                      isSearchable={false}
                      handleSearchValue={function (): void {}}
                      searchValue={''}
                      handleBlur={handleBlur}
                      multi={false}
                      toggleOption={() => {}}
                      selectedValues={[]}
                    />
                    <TextInput
                      label={'Selling Price per unit'}
                      placeholder={`Product selling amount (${currency})`}
                      name='spu'
                      type='text'
                      errorClass={'error-msg'}
                      handleChange={handleChange}
                      value={fields.spu}
                      fieldClass={errors['spu'] ? 'error-field' : 'input-field'}
                      errorMessage={errors['spu']}
                      id={'spu'}
                      onSelectValue={() => {}}
                      isSearchable={false}
                      handleSearchValue={function (): void {}}
                      searchValue={''}
                      handleBlur={handleBlur}
                      multi={false}
                      toggleOption={() => {}}
                      selectedValues={[]}
                    />
                  </div>
                  <TextInput
                    label={'Total Purchasing price per unit'}
                    placeholder={`Total product purchasing amount (${currency})`}
                    name='total'
                    type='text'
                    errorClass={'error-msg'}
                    handleChange={handleChange}
                    value={Number(totalPpu).toLocaleString()}
                    fieldClass={errors['total'] ? 'error-field' : 'input-field'}
                    errorMessage={errors['total']}
                    id={'total'}
                    onSelectValue={() => {}}
                    isSearchable={false}
                    handleSearchValue={function (): void {}}
                    searchValue={''}
                    handleBlur={() => {}}
                    multi={false}
                    toggleOption={() => {}}
                    selectedValues={[]}
                    disabled={true}
                  />
                </>
              ) : (
                sizePrices?.map((sizePrice, index) => (
                  <SizePriceComponent
                    sizeOptions={
                      sizeOptions[
                        fields.product_category_name
                          ?.toLowerCase()
                          .split(' ')
                          .join('')
                      ]
                    }
                    key={index}
                    sizePrice={sizePrice}
                    onSizePriceChange={(updatedSizePrice) =>
                      handleSizePriceChange(index, updatedSizePrice)
                    }
                    onDelete={() => handleDeleteSizePrice(index)}
                  />
                ))
              )}

              {!sameUnitPrice && (
                <div
                  onClick={handleAddSizePrice}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                    color: 'rgba(67, 154, 222, 1)',
                    marginTop: '5px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  <AddCircleBlue />
                  Add Another Size
                </div>
              )}
            </div>

            <TextInput
              label={'Total Product Quantity'}
              placeholder={'Total product quantity'}
              name='totalQuantity'
              type='text'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={Number(totalQuantity).toLocaleString()}
              fieldClass={'input-field'}
              errorMessage={''}
              id={'totalQuantity'}
              onSelectValue={() => {}}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={() => {}}
              multi={false}
              toggleOption={() => {}}
              selectedValues={[]}
              disabled={true}
            />

            <TextInput
              label='Description'
              placeholder='Write anything about the product'
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

            <div className='input-component'>
              <label>Upload To Edit Product Image (max of 1mb)</label>
            </div>
            <img src={data?.data?.image} alt='' width={50} height={50} />
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
                            <p>{Math.round((el?.size / 1024) * 0.001)} MB</p>
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
            <div style={{ marginTop: '16px' }}></div>
            <TextInput
              label={'Re-order level'}
              placeholder={'What is the product re- order level '}
              name='reOrderLevel'
              type='text'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.reOrderLevel}
              fieldClass={
                errors['reOrderLevel'] ? 'error-field' : 'input-field'
              }
              errorMessage={errors['reOrderLevel']}
              id={'reOrderLevel'}
              onSelectValue={() => {}}
              isSearchable={false}
              handleSearchValue={function (): void {}}
              searchValue={''}
              handleBlur={handleBlur}
              multi={false}
              toggleOption={() => {}}
              selectedValues={[]}
            />

            <TextInput
              label='Payment Method'
              placeholder='Select payment method'
              name='paymentMethod'
              type='dropdown'
              errorClass={'error-msg'}
              handleChange={handleChange}
              value={fields.paymentMethod}
              fieldClass={
                errors['paymentMethod'] ? 'error-field' : 'input-field'
              }
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
              fields.dateOfTransaction === '' ||
              fields.paymentMethod === '' ||
              isLoading
            }
          >
            {isLoading ? 'Please wait...' : 'Edit Product'}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default EditProduct;
