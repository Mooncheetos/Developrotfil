import { Line } from 'react-chartjs-2';
import '../styles/Chart.css';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

function Chart({ data }) {
  if (!Array.isArray(data)) return null;

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

  const axisTitleStyle = {
  display: true,
  color: '#ffffff',
  font: {
    size: 16,
    weight: 'bold',
  },
};

const tickStyle = {
  color: '#ffffff',
};

const legendStyle = {
  labels: {
    color: '#ffffff',
    font: {
      size: 14,
      weight: '500',
    },
  },
};

const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      title: { ...axisTitleStyle, text: 'Довжина хвилі (нм)' },
      ticks: tickStyle,
    },
    y: {
      title: { ...axisTitleStyle, text: 'Коефіцієнт (%)' },
      ticks: tickStyle,
      min: 0,
      max: 100,
    },
  },
  plugins: {
    legend: legendStyle,
    zoom: {
      pan: { enabled: true, mode: 'x' },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'x',
      },
    },
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