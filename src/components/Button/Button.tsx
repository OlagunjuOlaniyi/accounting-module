import React from 'react';
import './button.scss';

type Btnprops = {
  btnClass: string;
  btnText: string;
  icon?: React.ReactNode;
  width?: string;
  onClick: () => void;
  disabled: boolean;
};

const Button = ({
  btnClass,
  btnText,
  icon,
  width,
  onClick,
  disabled,
}: Btnprops) => {
  return (
    <button
      className={`${btnClass} main-btn`}
      style={{ width: width }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon}
      {btnText}
    </button>
  );
};

export default Button;
