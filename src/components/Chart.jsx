import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart({ spectra }) {
  return (
    <div>
      {spectra.map((spectrum, index) => (
  const chartData = {
    labels: spectrum.data.map(d => d.wavelength),
    datasets: [
      {
        label: spectrum.name,
        data: spectrum.data.map(d => d.coefficient),
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
      plugins: {
        zoom: {
        pan: {
          enabled: true,
        mode: 'x',
        },
      zoom: {
        enabled: true,
      mode: 'x',
      wheel: {
        enabled: true,
      },
      },
        },
      },
  };

      return
      <div key={index}>
            <h3>{spectrum.name}</h3>
            <Line data={chartData} options={options} />
          </div>
        );
      })}
    </div>
  );
}
    
// Валидация пропсов
Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Chart;