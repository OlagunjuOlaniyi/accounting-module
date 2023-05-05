import Modal from 'react-modal';
import './attachment.scss';
import Cancel from '../../../icons/Cancel';

type Iprops = {
  modalIsOpen: boolean;
  close: () => void;
  attachmentUrl: string;
  type: string;
};
const Attachment = ({ modalIsOpen, close, attachmentUrl, type }: Iprops) => {
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
      <div className='attachment-header'>
        <p>
          {attachmentUrl?.replace(
            `https://accounting-modules.s3.amazonaws.com/${type}s/`,
            ''
          )}
        </p>
        <button className='record-income__cancel__btn' onClick={close}>
          <Cancel />
        </button>
      </div>
      <div className='attachment-body'>
        <img src={attachmentUrl} alt='' />
      </div>
    </Modal>
  );
};

export default Attachment;
