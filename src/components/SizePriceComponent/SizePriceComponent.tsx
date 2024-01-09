import { useState } from 'react';
import DeleteRed from '../../icons/DeleteRed';
import ToggleChecked from '../../icons/ToggleChecked';
import './sizepricecomponent.scss';
import ToggleUnchecked from '../../icons/ToggleUnchecked';

export interface SizePrice {
  size: string;
  quantity: string;
  ppu: string;
  spu: string;
}

interface SizePriceComponentProps {
  sizePrice: SizePrice;
  onSizePriceChange: (sizePrice: SizePrice) => void;
  onDelete: () => void;
  sizeOptions: { id: number; name: string }[];
}

const SizePriceComponent: React.FC<SizePriceComponentProps> = ({
  sizePrice,
  onSizePriceChange,
  onDelete,
  sizeOptions,
}) => {
  const [customSize, setCustomSize] = useState<boolean>(false);
  const handleInputChange = () => {
    onSizePriceChange(sizePrice);
  };

  let total = Number(sizePrice.ppu) * Number(sizePrice.quantity);

  return (
    <div className='size-price-component'>
      <div
        onClick={() => setCustomSize(!customSize)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          margin: '20px 0px',
        }}
      >
        {customSize ? <ToggleChecked /> : <ToggleUnchecked />}
        <p>Custom size</p>
      </div>

      <div className='size-price-component__flex'>
        <div className='input-component'>
          <label>Size</label>
          {customSize ? (
            <input
              placeholder='Enter custom size'
              className='input-field'
              value={sizePrice.size}
              onChange={(e) => {
                sizePrice.size = e.target.value;
                handleInputChange();
              }}
            />
          ) : (
            <select
              className='input-field'
              value={sizePrice.size}
              onChange={(e) => {
                sizePrice.size = e.target.value;
                handleInputChange();
              }}
            >
              <option value='Select size' selected>
                Select size
              </option>
              {sizeOptions?.map((option) => (
                <option key={option?.name} value={option?.name}>
                  {option?.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className='input-component'>
          <label>Quantity</label>
          <input
            className='input-field'
            type='number'
            placeholder='Quantity'
            value={sizePrice.quantity}
            onChange={(e) => {
              sizePrice.quantity = e.target.value;
              handleInputChange();
            }}
          />
        </div>
        <button onClick={onDelete} className='spc-btn'>
          <DeleteRed />
        </button>
      </div>
      <div className='size-price-component__flex'>
        <div className='input-component'>
          <label>Purchasing Price per unit</label>
          <input
            className='input-field'
            type='number'
            placeholder='Purchasing Price Per Unit'
            value={sizePrice.ppu}
            onChange={(e) => {
              sizePrice.ppu = e.target.value;
              handleInputChange();
            }}
          />
        </div>
        <div className='input-component'>
          <label>Selling Price per unit</label>
          <input
            className='input-field'
            type='number'
            placeholder='Selling Price Per Unit'
            value={sizePrice.spu}
            onChange={(e) => {
              sizePrice.spu = e.target.value;
              handleInputChange();
            }}
          />
        </div>
      </div>

      <div className='input-component'>
        <label>Total Purchasing price per unit</label>
        <input
          className='input-field'
          disabled
          placeholder='Purchasing Price Per Unit'
          value={total?.toLocaleString()}
        />
      </div>
    </div>
  );
};

export default SizePriceComponent;
