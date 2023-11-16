import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import BackArrow from '../../icons/BackArrow';

import Dots from '../../icons/Dots';

import moment from 'moment';

import Delete from '../../icons/Delete';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import Attachment from '../../components/Modals/AttachmentModal/Attachment';
import ImageIcon from '../../icons/ImageIcon';

import { useGetSingleProduct } from '../../hooks/queries/inventory';
import Restock from '../../icons/Restock';
import Dispense from '../../icons/Dispense';
import DispenseModal from '../../components/Modals/Inventory/DispenseModal';
import RestockModal from '../../components/Modals/Inventory/RestockModal';
import EditProduct from '../../components/Modals/Inventory/EditProduct';
import { useDiscardProduct } from '../../hooks/mutations/inventory';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  let action = queryParams.get('action');

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
  const [attachmentModalOpen, setAttachmentModalOpen] =
    useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');

  const closeModal = () => {
    setModalOpen(false);
    setRestockModalOpen(false);
    setAttachmentModalOpen(false);
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

  //open attachment
  const openAttachment = (url: string) => {
    if (url.includes('.pdf')) {
      window.open(url);
    } else {
      setAttachmentModalOpen(true);
      setAttachmentUrl(url);
    }
  };

  return (
    <>
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
                        NGN{' '}
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

              <div className='single-expense-wrapper__details'>
                <h3>Product Details</h3>
                <div className='single-expense-wrapper__details__bottom'>
                  <div className='single-expense-wrapper__details__bottom__left'>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>CATEGORY</h4>
                      <p>{data?.data?.product_group?.category?.name}</p>
                    </div>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>QUANTITY</h4>
                      <p>{data?.data?.quantity}</p>
                    </div>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>RE- ORDER LEVEL</h4>
                      <p>{data?.data?.reorder_level}</p>
                    </div>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>DATE OF ACQUISITION</h4>
                      <p> {moment(data?.data?.date).format('ll')}</p>
                    </div>
                  </div>

                  <div className='single-expense-wrapper__details__bottom__left'>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>TYPE</h4>
                      <p>{data?.data?.product_group?.name}</p>
                    </div>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>SIZE</h4>
                      <div className='flex-wrap'>
                        {data?.data?.sizes?.map((s: any, idx: number) => (
                          <div className='flex-wrap__item' key={idx}>
                            <p>{s.size}</p>
                            <div className='flex-wrap__badge'>
                              <p>{s.quantity} left</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='single-expense-wrapper__details__bottom__left__item'>
                      <h4>PAYMENT METHOD</h4>
                      <p>{data?.data?.payment_method}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='single-expense-wrapper__attachments'>
                <h4>Attachments</h4>
                {data?.data?.image.length > 0 ? (
                  <div
                    className='single-expense-wrapper__attachments__list'
                    onClick={() => openAttachment(data?.data?.image)}
                  >
                    <div className='single-expense-wrapper__attachments__list__item'>
                      <ImageIcon />
                      <p>{data?.data?.image}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className='single-expense-wrapper__accounts__left__btn'
                    onClick={() => setModalOpen(true)}
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
                    <p>Add Attachment</p>
                  </div>
                )}
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
      <Attachment
        modalIsOpen={attachmentModalOpen}
        close={closeModal}
        attachmentUrl={attachmentUrl}
        type='income'
      />
    </>
  );
};

export default SingleProduct;
