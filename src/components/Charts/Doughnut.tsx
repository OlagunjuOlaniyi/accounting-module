import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ datasets, labels }: any) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
    },
  };
  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
