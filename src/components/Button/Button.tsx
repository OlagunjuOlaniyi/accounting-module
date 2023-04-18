import React from 'react';
import './button.scss';

type Btnprops = {
  btnClass: string;
  btnText: string;
  icon?: React.ReactNode;
  width: string;
};

const Button = ({ btnClass, btnText, icon, width }: Btnprops) => {
  return (
    <div className={`${btnClass} main-btn`} style={{ width: width }}>
      {icon && icon}
      {btnText}
    </div>
  );
};

export default Button;
