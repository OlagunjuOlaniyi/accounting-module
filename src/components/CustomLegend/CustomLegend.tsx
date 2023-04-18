import React from 'react';
import './legend.scss';

type objProps = {
  id: number;
  bgColor: string;
  label: string;
};

type legendProps = {
  data: objProps[];
};
const CustomLegend = ({ data }: legendProps) => {
  return (
    <div className='custom-legend-wrapper'>
      {data?.map(
        (el: {
          id: React.Key | null | undefined;
          bgColor: any;
          label: string;
        }) => (
          <div className='custom-legend-wrapper__wrap' key={el.id}>
            <div
              className='legend-box'
              style={{ background: el.bgColor }}
            ></div>
            <p>{el.label}</p>
          </div>
        )
      )}
    </div>
  );
};

export default CustomLegend;
