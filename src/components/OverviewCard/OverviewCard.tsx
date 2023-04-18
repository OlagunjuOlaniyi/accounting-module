import React from 'react';
import Income from '../../icons/Income';
import Received, { IreceivedIconProps } from '../../icons/Received';
import './overviewcard.scss';

export type ICardProps = {
  type: string;
  title: string;
  amount: string | number;
  percentage: string;
  icon: React.ReactNode;
};
const OverviewCard = ({
  type,
  title,
  amount,
  percentage,
  icon,
}: ICardProps) => {
  return (
    <div className='overview-card'>
      <div className='overview-card__top'>
        {icon}
        <p className='overview-card__top__text'>{title}</p>
      </div>

      <div className='overview-card__body'>
        <h2>{amount}</h2>
        <div className='overview-card__body__projection'>
          <Received type={type} />
          <p className={`overview-card__body__little-text-${type}`}>
            {percentage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
