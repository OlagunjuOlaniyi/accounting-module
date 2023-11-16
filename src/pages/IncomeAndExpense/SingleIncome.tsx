import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import BackArrow from '../../icons/BackArrow';
import Export from '../../icons/Export';
import Edit from '../../icons/Edit';
import Dots from '../../icons/Dots';
import Dot from '../../icons/Dot';
import moment from 'moment';
import EditExpense from '../../components/Modals/IncomeAndExpense/EditExpense';
import Delete from '../../icons/Delete';
import DeleteConfirmation from '../../components/Modals/DeleteConfirmation/DeleteConfirmation';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useGetSingleIncome } from '../../hooks/queries/incomes';
import { useDeleteIncome } from '../../hooks/mutations/incomes';
import Attachment from '../../components/Modals/AttachmentModal/Attachment';
import ImageIcon from '../../icons/ImageIcon';
import EditIncome from '../../components/Modals/IncomeAndExpense/EditIncome';

const SingleIncome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, data } = useGetSingleIncome(id);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [attachmentModalOpen, setAttachmentModalOpen] =
    useState<boolean>(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');

  const closeModal = () => {
    setModalOpen(false);
    setDeleteModalOpen(false);
    setAttachmentModalOpen(false);
  };

  const { mutate } = useDeleteIncome();
  const deleteLoading = useDeleteIncome().isLoading;

  //delete transaction
  const deleteTransaction = () => {
    mutate(id, {
      onSuccess: (res) => {
        queryClient.setQueryData<any>(
          [`expenses-single-${id}`],
          (prev: any) => {}
        );

        queryClient.invalidateQueries({
          queryKey: [`expenses-single-${id}`],
        });
        toast.success('Transaction deleted successfully');
        navigate('/income-and-expense');
        closeModal();
      },

      onError: (e) => {
        toast.error('Error deleting transaction');
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

  console.log(data);
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
                onClick={() => navigate('/income-and-expense')}
              >
                Income and Expense Management /
              </span>
              <span>Income</span>
            </div>
            <div className='single-expense-wrapper__top__right'>
              <button className='ie_overview__top-level__filter-date'>
                {' '}
                <Export />
                <p>Export</p>
              </button>
              <button
                className='single-expense-wrapper__top__right__edit-btn'
                onClick={() => setModalOpen(true)}
              >
                {' '}
                <Edit color='white' />
                <p>Edit</p>
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
                    <p>Delete</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='single-expense-wrapper__title'>
            <div className='single-expense-wrapper__title__left'>
              <h2>
                {Array.isArray(data?.data)
                  ? data?.data[0]?.transaction_type?.name?.toUpperCase()
                  : data?.data?.transaction_type?.name?.toUpperCase()}
              </h2>
              <div className='single-expense-wrapper__title__left__status'>
                APPROVAL STATUS: {'Approved'}
              </div>
            </div>

            <div className='single-expense-wrapper__title__right'>
              <h2>
                NGN{' '}
                {Array.isArray(data?.data)
                  ? Number(data?.data[0]?.amount).toLocaleString()
                  : Number(data?.data?.amount).toLocaleString()}
              </h2>
            </div>
          </div>

          <div className='single-expense-wrapper__desc'>
            <p>
              {Array.isArray(data?.data)
                ? data?.data[0]?.description
                : data?.data?.description}
            </p>
          </div>
          <div className='single-expense-wrapper__accounts'>
            {Array.isArray(data?.data) ? (
              <div className='single-expense-wrapper__accounts__left'>
                <p>RELATED ACCOUNTS:</p>
                {data?.data[0]?.transaction_group?.name ? (
                  <p style={{ textTransform: 'capitalize' }}>
                    {data?.data[0]?.transaction_group?.name}
                  </p>
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
                    <p>Add Account</p>
                  </div>
                )}
              </div>
            ) : (
              <div className='single-expense-wrapper__accounts__left'>
                <p>RELATED ACCOUNTS:</p>
                {data?.data?.transaction_group?.name ? (
                  <p style={{ textTransform: 'capitalize' }}>
                    {data?.data?.transaction_group?.name}
                  </p>
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
                    <p>Add Account</p>
                  </div>
                )}
              </div>
            )}
            <div className='single-expense-wrapper__accounts__right'>
              <p className='single-expense-wrapper__accounts__right__first'>
                DATE CREATED :{' '}
              </p>
              <p className='single-expense-wrapper__accounts__right__scnd'>
                {Array.isArray(data?.data)
                  ? moment(data?.data[0]?.created_at).format('lll')
                  : moment(data?.data?.created_at).format('lll')}
              </p>
            </div>
          </div>
          <div className='single-expense-wrapper__details'>
            <h3>Income Details</h3>
            <div className='single-expense-wrapper__details__bottom'>
              <div className='single-expense-wrapper__details__bottom__left'>
                <div className='single-expense-wrapper__details__bottom__left__item'>
                  <h4>GROUP</h4>
                  <p>
                    {Array.isArray(data?.data)
                      ? data?.data[0]?.transaction_group?.name
                      : data?.data?.transaction_group?.name}
                  </p>
                </div>
                <div className='single-expense-wrapper__details__bottom__left__item'>
                  <h4>PAYMENT METHOD</h4>
                  <p>
                    {' '}
                    {Array.isArray(data?.data)
                      ? data?.data[0]?.payment_method
                      : data?.data?.payment_method}
                  </p>
                </div>
              </div>

              <div className='single-expense-wrapper__details__bottom__left'>
                <div className='single-expense-wrapper__details__bottom__left__item'>
                  <h4>ACCOUNT</h4>
                  <p>
                    {' '}
                    <Dot type='income' /> Income{' '}
                  </p>
                </div>
                <div className='single-expense-wrapper__details__bottom__left__item'>
                  <h4>DATE OF TRANSACTION</h4>
                  <p>
                    {' '}
                    {Array.isArray(data?.data)
                      ? moment(data?.data[0]?.date).format('ll')
                      : moment(data?.data?.date).format('ll')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {Array.isArray(data?.data) ? (
            <div className='single-expense-wrapper__attachments'>
              <h4>Attachments</h4>
              {data?.data[0]?.attachment.length > 0 ? (
                data?.data[0]?.attachment.map((el: { attachment: string }) => (
                  <div
                    className='single-expense-wrapper__attachments__list'
                    onClick={() => openAttachment(el?.attachment)}
                  >
                    <div className='single-expense-wrapper__attachments__list__item'>
                      <ImageIcon />
                      <p>{el?.attachment}</p>
                    </div>
                  </div>
                ))
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
          ) : (
            <div className='single-expense-wrapper__attachments'>
              <h4>Attachments</h4>
              {data?.data?.attachment.length > 0 ? (
                data?.data?.attachment.map((el: { attachment: string }) => (
                  <div
                    className='single-expense-wrapper__attachments__list'
                    onClick={() => openAttachment(el?.attachment)}
                  >
                    <div className='single-expense-wrapper__attachments__list__item'>
                      <ImageIcon />
                      <p>{el?.attachment}</p>
                    </div>
                  </div>
                ))
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
          )}
        </div>
      )}
      <EditIncome modalIsOpen={modalOpen} closeModal={closeModal} />

      <DeleteConfirmation
        deleteFn={deleteTransaction}
        modalIsOpen={deleteModalOpen}
        close={closeModal}
        deleteBtnText='Delete Transaction'
        confirmationText='Are you sure you want to delete this transaction?'
        loading={deleteLoading}
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

export default SingleIncome;
