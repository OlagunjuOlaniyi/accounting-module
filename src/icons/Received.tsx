import React from 'react';

export type IreceivedIconProps = {
  type: string;
};
const Received = ({ type }: IreceivedIconProps) => {
  return (
    <>
      {type === 'profit' ? (
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_1857_11217)'>
            <path
              d='M2.66675 12.3959L3.60675 13.3359L11.3334 5.60927V10.0026H12.6667L12.6667 3.33594H6.00008V4.66927H10.3934L2.66675 12.3959Z'
              fill='#43F226'
            />
          </g>
          <defs>
            <clipPath id='clip0_1857_11217'>
              <rect
                width='16'
                height='16'
                fill='white'
                transform='matrix(-1 0 0 -1 16 16)'
              />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_1857_11225)'>
            <path
              d='M13.3333 3.60406L12.3933 2.66406L4.66659 10.3907V5.9974H3.33325V12.6641H9.99992V11.3307H5.60659L13.3333 3.60406Z'
              fill='#FE5050'
            />
          </g>
          <defs>
            <clipPath id='clip0_1857_11225'>
              <rect width='16' height='16' fill='white' />
            </clipPath>
          </defs>
        </svg>
      )}
    </>
  );
};

export default Received;
