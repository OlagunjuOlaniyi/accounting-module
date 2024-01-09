import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import BackArrow from '../../icons/BackArrow';

import Dots from '../../icons/Dots';

import moment from 'moment';

import Delete from '../../icons/Delete';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import {
  useGetProductHistory,
  useGetSingleProduct,
} from '../../hooks/queries/inventory';
import Restock from '../../icons/Restock';
import Dispense from '../../icons/Dispense';
import DispenseModal from '../../components/Modals/Inventory/DispenseModal';
import RestockModal from '../../components/Modals/Inventory/RestockModal';
import EditProduct from '../../components/Modals/Inventory/EditProduct';
import { useDiscardProduct } from '../../hooks/mutations/inventory';
import RadioChecked from '../../icons/RadioChecked';
import RadioUnchecked from '../../icons/RadioUnchecked';
import Calendar from '../../icons/Calendar';
import { useCurrency } from '../../context/CurrencyContext';
import Header from '../../components/Header/Header';

const ProductHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  let action = queryParams.get('action');

  const { isLoading: historyLoading, data: historyData } = useGetProductHistory(
    id || ''
  );

  const { isLoading, data } = useGetSingleProduct(id || '');

  const [modalOpen, setModalOpen] = useState<boolean>(
    action === 'dispense' || false
  );
  const [restockModalOpen, setRestockModalOpen] = useState<boolean>(
    action === 'restock' || false
  );
  const [editModalOpen, setEditModalOpen] = useState<boolean>(
    action === 'edit' || false
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(
    action === 'delete' || false
  );
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [selectedSizeForPrice, setSelectedSizeForPrice] = useState<string>('');

  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    setSelectedSize(historyData ? historyData[0]?.size : '');
  }, [historyData, historyLoading]);

  const closeModal = () => {
    setModalOpen(false);
    setRestockModalOpen(false);

    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    setSelectedSizeForPrice(data?.data?.sizes[0]?.size);
  }, [data]);

  const { mutate } = useDiscardProduct();
  const deleteLoading = useDiscardProduct().isLoading;

  //delete transaction
  const discardProduct = () => {
    mutate(id, {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [`products`],
        });
        toast.success('Product discarded successfully');
        navigate('/inventory');
        closeModal();
      },

      onError: (e) => {
        toast.error('Error discarding product');
      },
    });
  };

  const RestockedIcon = () => {
    return (
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clipPath='url(#clip0_9241_20489)'>
          <path
            d='M12.6654 10L11.7254 9.06L8.66536 12.1133V1.33333H7.33203V12.1133L4.27203 9.05333L3.33203 10L7.9987 14.6667L12.6654 10Z'
            fill='#4BAC1D'
          />
        </g>
        <defs>
          <clipPath id='clip0_9241_20489'>
            <rect width='16' height='16' fill='white' />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const DispensedIcon = () => {
    return (
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g clip-path='url(#clip0_9241_20517)'>
          <path
            d='M3.33463 5.99994L4.27464 6.93994L7.33464 3.8866L7.33464 14.6666H8.66797L8.66797 3.8866L11.728 6.9466L12.668 5.99994L8.0013 1.33327L3.33463 5.99994Z'
            fill='#E48752'
          />
        </g>
        <defs>
          <clipPath id='clip0_9241_20517'>
            <rect
              width='16'
              height='16'
              fill='white'
              transform='matrix(-1 0 0 -1 16 15.9999)'
            />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const filteredHistory =
    historyData?.filter((history) => history.size === selectedSize)[0]
      ?.details || [];

  return (
    <>
      <Header />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className='single-expense-wrapper'>
          <div className='single-expense-wrapper__top'>
            <div className='single-expense-wrapper__top__breadcrumbs'>
              <BackArrow />
              <span
                className='single-expense-wrapper__top__breadcrumbs__inactive'
                onClick={() => navigate('/inventory')}
              >
                Inventory Management / All Products /
              </span>
              <span>{data?.data?.name}</span>
            </div>
            <div className='single-expense-wrapper__top__right'>
              <button
                className='ie_overview__top-level__filter-date'
                style={{ width: '184px' }}
                onClick={() => setRestockModalOpen(true)}
              >
                {' '}
                <Restock />
                <p>Restock Product Item</p>
              </button>
              <button
                style={{ width: '184px' }}
                className='single-expense-wrapper__top__right__edit-btn'
                onClick={() => setModalOpen(true)}
              >
                {' '}
                <Dispense />
                <p>Dispense Product Item</p>
              </button>
              <div className='delete-icon-dropdown'>
                <div onClick={() => setShowDelete(!showDelete)}>
                  <Dots />
                </div>
                {showDelete && (
                  <div
                    className='delete-dropdown'
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    <Delete />
                    <p>Discard</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='product-flex'>
            <div className='product-img-wrapper'>
              <img src={data?.data?.image} alt='' />
            </div>
            <div style={{ width: '70%' }}>
              <div className='single-expense-wrapper__title'>
                <div className='single-expense-wrapper__title__left'>
                  <h2>{data?.data?.name?.toUpperCase()}</h2>
                  <div className='record-income__body__title__badge'>
                    <p>#{data?.data?.id}</p>
                  </div>
                  <div className='single-expense-wrapper__title__left__status'>
                    STATUS: {data?.data?.status}
                  </div>
                </div>
                <div>
                  <div
                    className='single-expense-wrapper__title__right'
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                    }}
                  >
                    {data?.data?.sizes?.length === 0 ? (
                      <h2>N/A</h2>
                    ) : (
                      <h2>
                        {currency}{' '}
                        {Number(
                          data?.data?.sizes.find(
                            (product: { size: string }) =>
                              product.size === selectedSizeForPrice
                          )?.spu
                        )?.toLocaleString()}
                      </h2>
                    )}
                    <p>per unit</p>
                  </div>
                </div>
              </div>

              <div className='single-expense-wrapper__desc'>
                <p>{data?.data?.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                {data?.data?.sizes?.map((el: any) => (
                  <button
                    className={
                      selectedSizeForPrice === el?.size
                        ? 'selected-btn sizes-btn'
                        : 'sizes-btn'
                    }
                    onClick={() => setSelectedSizeForPrice(el?.size)}
                  >
                    {el?.size}
                  </button>
                ))}
              </div>

              <div className='single-expense-wrapper__accounts'>
                <div className='single-expense-wrapper__accounts__left'>
                  <p>RELATED ACCOUNTS:</p>

                  <div
                    className='single-expense-wrapper__accounts__left__btn'
                    onClick={() => navigate('/bills-fees-management')}
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g clipPath='url(#clip0_1407_6462)'>
                        <path
                          d='M8.66683 4.66536H7.3335V7.33203H4.66683V8.66536H7.3335V11.332H8.66683V8.66536H11.3335V7.33203H8.66683V4.66536ZM8.00016 1.33203C4.32016 1.33203 1.3335 4.3187 1.3335 7.9987C1.3335 11.6787 4.32016 14.6654 8.00016 14.6654C11.6802 14.6654 14.6668 11.6787 14.6668 7.9987C14.6668 4.3187 11.6802 1.33203 8.00016 1.33203ZM8.00016 13.332C5.06016 13.332 2.66683 10.9387 2.66683 7.9987C2.66683 5.0587 5.06016 2.66536 8.00016 2.66536C10.9402 2.66536 13.3335 5.0587 13.3335 7.9987C13.3335 10.9387 10.9402 13.332 8.00016 13.332Z'
                          fill='#439ADE'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_1407_6462'>
                          <rect width='16' height='16' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                    <p>Bills/Fees Management</p>
                  </div>
                </div>

                <div className='single-expense-wrapper__accounts__right'>
                  <p className='single-expense-wrapper__accounts__right__first'>
                    DATE CREATED :{' '}
                  </p>
                  <p className='single-expense-wrapper__accounts__right__scnd'>
                    {moment(data?.data?.created_at).format('lll')}
                  </p>
                </div>
              </div>

              <div
                className='single-expense-wrapper__details'
                style={{ borderBottom: 'none' }}
              >
                <h3>Product History</h3>

                <div className='history-nav'>
                  {historyData?.map((el: { size: string }) => (
                    <div
                      className={
                        selectedSize === el.size
                          ? 'history-nav__item selected-nav'
                          : 'history-nav__item'
                      }
                      onClick={() => setSelectedSize(el.size)}
                    >
                      {selectedSize === el.size ? (
                        <RadioChecked />
                      ) : (
                        <RadioUnchecked />
                      )}{' '}
                      <p>Size {el.size}</p>
                    </div>
                  ))}
                </div>

                <div className='history-table'>
                  <div className='history-table__header'>
                    <p>ACTION</p>
                    <p>TIME STAMP</p>
                    <p>QUANTITY</p>
                    <p>STOCK BALANCE</p>
                    <p>STUDENT</p>
                  </div>
                  {filteredHistory?.map((el) => (
                    <div className='history-table__body'>
                      <p className={el.activity?.toLowerCase()}>
                        {el.activity?.toLowerCase() === 'restock' && (
                          <RestockedIcon />
                        )}
                        {el.activity?.toLowerCase() === 'dispense' && (
                          <DispensedIcon />
                        )}
                        {el.activity?.toLowerCase() === 'delete' && <Delete />}
                        {el.activity}
                      </p>
                      <p className='history-table__body__timestamp'>
                        {' '}
                        <Calendar />
                        {moment(el?.created_at).format('lll')}
                      </p>
                      <p>{el.amount}</p>
                      <p>{el.residual_amount}</p>
                      <p>
                        <>
                          {el?.students?.length > 0 ? (
                            <div className='items-center'>
                              {el?.students?.map(
                                (el: { name: string }, index: number) => (
                                  <div
                                    key={index}
                                    className='rounded-2xl h-[25px] bg-[#E4EFF9] mb-3 items-center justify-center p-2'
                                  >
                                    <p>{el?.name}</p>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <p>No student selected</p>
                          )}
                        </>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DispenseModal
        modalIsOpen={modalOpen}
        closeModal={closeModal}
        name={data?.data?.name}
        sizes={data?.data?.sizes}
      />
      <RestockModal
        category_name={data?.data?.product_group?.category?.name}
        modalIsOpen={restockModalOpen}
        closeModal={closeModal}
        name={data?.data?.name}
        sizes={data?.data?.sizes}
        purchasing_price={data?.data?.general_purchasing_price}
      />

      <DeleteConfirmation
        deleteFn={discardProduct}
        modalIsOpen={deleteModalOpen}
        close={closeModal}
        deleteBtnText='Discard Product'
        confirmationText='Are you sure you want to discard this product?'
        loading={deleteLoading}
      />

      <EditProduct
        modalIsOpen={editModalOpen}
        closeModal={closeModal}
        data={data}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProductHistory;
