import CheckCircle from '../../icons/CheckCircle';
import './fee-item.scss';

type Iprops = {
  name: string;
  mandatory: boolean;
  discount: boolean;
  amount: number;
  discount_amount: number;
};
const FeeItem = ({
  name,
  mandatory,
  discount,
  amount,
  discount_amount,
}: Iprops) => {
  return (
    <div className='fee-item'>
      <div className='fee-item__first'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h4>{name}</h4>
          <CheckCircle />
        </div>

        <p style={{ color: '#FFA800', fontSize: '12px' }}>
          This fee type is {mandatory ? 'compulsory' : 'optional'}
        </p>
      </div>
      <h3>{discount ? discount : '0'}</h3>
      <h4>{discount ? '0' : 'N/A'}</h4>
      <h3>{discount ? '0' : discount_amount}</h3>

      <h3>NGN {Number(amount)?.toLocaleString()}</h3>
    </div>
  );
};

export default FeeItem;
