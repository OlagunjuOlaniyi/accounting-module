import React from 'react';

type Iprops = {
  type: string;
};
const Dot = ({ type }: Iprops) => {
  return (
    <svg
      width='8'
      height='8'
      viewBox='0 0 8 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='4'
        cy='4'
        r='4'
        fill={type === 'expense' ? '#FE5050' : '#43F226'}
      />
    </svg>
  );
};

export default Dot;
