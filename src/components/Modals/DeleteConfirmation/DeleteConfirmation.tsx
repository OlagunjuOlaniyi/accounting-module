import React from 'react';
import Modal from 'react-modal';
import Button from '../../Button/Button';
import './deleteconfirmation.scss';
import Cancel from '../../../icons/Cancel';

type Iprops = {
  modalIsOpen: boolean;
  close: () => void;
  confirmationText: string;
  deleteFn: () => void;
  deleteBtnText: string;
  loading: boolean;
};
const DeleteConfirmation = ({
  modalIsOpen,
  close,
  deleteFn,
  confirmationText,
  deleteBtnText,
  loading,
}: Iprops) => {
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
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={close}
      style={customStyles}
      ariaHideApp={false}
    >
      <>
        <div className='record-income__cancel'>
          <button className='record-income__cancel__btn' onClick={close}>
            <Cancel />
          </button>
        </div>

        <div className='delete-confiirmation'>
          <h3>Confirm Delete</h3>
          <p>{confirmationText}</p>
          <div className='delete-confiirmation__buttons'>
            <Button
              disabled={false}
              btnClass='btn-cancel'
              btnText='Cancel'
              onClick={() => close()}
            />
            <Button
              btnClass='btn-delete'
              btnText={loading ? 'deleting...' : deleteBtnText}
              onClick={() => deleteFn()}
              disabled={loading}
            />
          </div>
        </div>
      </>
    </Modal>
  );
};

export default DeleteConfirmation;
