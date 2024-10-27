import { Line } from 'react-chartjs-2';
import '../styles/Chart.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    maintainAspectRatio: false, // Уменьшение графика для адаптивности
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Довжина хвилі (нм)' } },
      y: { title: { display: true, text: 'Коефіцієнт (%)' }, min: 0, max: 100 },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Chart;
