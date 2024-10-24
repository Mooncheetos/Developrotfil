import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import PropTypes from 'prop-types';

function Chart({ data }) {
  const chartData = {
    labels: data.map(d => d.wavelength),
    datasets: [
      {
        label: 'Коефіцієнт',
        data: data.map(d => d.coefficient),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: { title: { display: true, text: 'Довжина хвилі (нм)' } },
      y: { title: { display: true, text: 'Коефіцієнт (%)' }, min: 0, max: 100 },
    },
  };

  return <Line data={chartData} options={options} />;
}

// Добавь валидацию пропсов
Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Chart;
