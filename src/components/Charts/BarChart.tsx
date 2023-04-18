import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options: any = {
  indexAxis: 'x',
  elements: {
    bar: {
      borderColor: 'rgba(0,0,0,0)',
      borderWidth: 10,
      barThickness: 20,
      maxBarThickness: 20,
    },
  },
  layout: {
    padding: 20,
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
      display: false,
    },
    title: {
      display: false,
      text: '',
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },

    y: {
      grid: {
        display: false,
      },
    },
  },
};

const HorizontalBarChart = ({ data }: any) => {
  return <Bar options={options} data={data} />;
};

export default HorizontalBarChart;
