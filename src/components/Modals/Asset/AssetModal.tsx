import Modal from 'react-modal';
import { Imodal } from '../../../types/types';
import RecordCashDeposit from './RecordCashDeposit';
import RecordCashWithdrawal from './RecordCashWithdrawal';
import RecordBankWithdrawal from './RecordBankWithdrawal';
import RecordBankDeposit from './RecordBankDeposit';
import RecordBankTransfer from './RecordBankTransfer';

interface IassetModal extends Imodal {
  type: string;
  bankId?: string;
}

const AssetModal = ({ modalIsOpen, closeModal, type, bankId }: IassetModal) => {
  const close = () => {
    closeModal('');
  };
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
      {type === 'record_cash_deposit' && <RecordCashDeposit close={close} />}
      {type === 'record_cash_withdrawal' && (
        <RecordCashWithdrawal close={close} />
      )}

      {type === 'record_bank_withdrawal' && (
        <RecordBankWithdrawal close={close} />
      )}
      {type === 'record_bank_deposit' && (
        <RecordBankDeposit close={close} bankId={bankId} />
      )}
      {type === 'record_bank_transfer' && (
        <RecordBankTransfer close={close} bankId={bankId} />
      )}
    </Modal>
  );
};

export default AssetModal;
