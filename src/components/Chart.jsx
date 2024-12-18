import { Line } from 'react-chartjs-2';
import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppContext } from '../AppContext';
import zoomPlugin from 'chartjs-plugin-zoom';
import '../styles/Chart.css';
import "../styles/Buttons.css";

// Регистрация плагинов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

function Chart({ data, selectedMaterial, setSelectedMaterial }) {
  const chartRef = useRef(null);
  const { selectedPoints, setSelectedPoints } = useAppContext();
  const [manualPoint, setManualPoint] = useState('');
  const [averageThickness, setAverageThickness] = useState(null);

  const location = useLocation();

  // Коэффициент преломления для материалов
  const getRefractiveIndex = (wavelength, material) => {
    const refractiveIndices = {
      CdTe: (λ) => 0.000193 * λ + 2.586587,
      CdS: (λ) => {
      const x = 1240 / λ; // Перевод длины волны в энергию фотона (в эВ)
      return (
        0.30793402 * Math.pow(x, 4) -
        1.946054399 * Math.pow(x, 3) +
        4.7494465 * Math.pow(x, 2) -
        5.02473737 * x +
        4.30338744
      );
    },
      ZnO: (λ) => {
      const x = 1240 / λ; // Перевод длины волны в энергию фотона (в эВ)
      return (
        0.02006866 * Math.pow(x, 5) -
        0.15792870 * Math.pow(x, 4) +
        0.48200032 * Math.pow(x, 3) -
        0.67829190 * Math.pow(x, 2) +
        0.47221585 * x +
        1.79461886
      );
    },
    };
    return refractiveIndices[material](wavelength);
  };

  // Расчёт толщины по паре точек
  const calculateThickness = (lambda1, lambda2, material) => {
    const n1 = getRefractiveIndex(lambda1, material);
    const n2 = getRefractiveIndex(lambda2, material);
    return (lambda1 * lambda2) / (2 * (n1 * lambda2 - n2 * lambda1));
  };

  // Добавление точки вручную
  const handleManualPointSubmit = () => {
    const point = parseFloat(manualPoint);
    if (!isNaN(point) && point >= 400 && point <= 1100) {
      const closest = data.reduce((prev, curr) =>
        Math.abs(curr.wavelength - point) < Math.abs(prev.wavelength - point) ? curr : prev
      );
      addPoint(closest);
    }
  };

  // Добавление точки
  const addPoint = (point) => {
    setSelectedPoints((prev) => {
      if (prev.some((p) => p.wavelength === point.wavelength)) return prev;
      return [...prev, point];
    });
  };

  // Удаление точки
  const removePoint = (wavelength) => {
    setSelectedPoints((prev) => prev.filter((p) => p.wavelength !== wavelength));
  };

  // Расчёт средней толщины
  const handleCalculateThickness = () => {
    if (selectedPoints.length < 2) {
      alert('Для расчёта необходимо минимум две точки.');
      return;
    }

    const thicknessValues = [];
    for (let i = 0; i < selectedPoints.length - 1; i++) {
      const lambda1 = selectedPoints[i].wavelength;
      const lambda2 = selectedPoints[i + 1].wavelength;
      const thickness = calculateThickness(lambda1, lambda2, selectedMaterial);
      thicknessValues.push(thickness);
    }

    const average = thicknessValues.reduce((sum, t) => sum + t, 0) / thicknessValues.length;
    setAverageThickness(average);
  };

  // Обработчик кликов по графику
  const handleChartClick = (event, elements, chart) => {
    if (!chart) return;

    // Используем метод Chart.js для получения ближайшей точки
    const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    if (points.length > 0) {
      const { index } = points[0]; // Получаем индекс ближайшей точки
      const clickedPoint = data[index]; // Добавляем точку в таблицу
      setSelectedPoints((prevPoints) => {
        if (location.pathname === '/bandgap') {
          // Ограничение до 2 точек для страницы bandgap
          if (prevPoints.length >= 2) return [clickedPoint];
          return [...prevPoints, clickedPoint];
        }
        // На странице upload можно добавлять неограниченное количество точек
        if (prevPoints.some((p) => p.wavelength === clickedPoint.wavelength)) return prevPoints;
        return [...prevPoints, clickedPoint];
      });
    }
  };

  // Данные для графика
  const chartData = {
    labels: data.map((d) => d.wavelength),
    datasets: [
      {
        label: `Коефіцієнт (${selectedMaterial})`,
        data: data.map((d) => d.coefficient),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Настройки графика
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleChartClick, // Обработчик кликов
    scales: {
      x: { title: { display: true, text: 'Довжина хвилі (нм)' }, ticks: { min: 400, max: 1100 } },
      y: { title: { display: true, text: 'Коефіцієнт (%)' }, ticks: { min: 0, max: 100 } },
    },
  };

  return (
    <div className="chart-container">
      <label htmlFor="material" className="label-style">Оберіть матеріал:</label>
      <select id="material" className="select-menu-mat" value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
        <option value="CdTe">CdTe</option>
        <option value="CdS">CdS</option>
        <option value="ZnO">ZnO</option>
      </select>

      <input
        type="number"
        className="input-style"
        value={manualPoint}
        onChange={(e) => setManualPoint(e.target.value)}
        placeholder="Довжина хвилі"
      />
      <button className="button" onClick={handleManualPointSubmit}>Додати точку</button>

      <Line ref={chartRef} data={chartData} options={options} />

      <table>
        <thead>
          <tr>
            <th>Довжина хвилі</th>
            <th>Коефіцієнт</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {selectedPoints.map((point, idx) => (
            <tr key={idx}>
              <td>{point.wavelength}</td>
              <td>{point.coefficient}</td>
              <td>
                <button className="reset-button" onClick={() => removePoint(point.wavelength)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="button-rozr" onClick={handleCalculateThickness}>Розрахувати товщину</button>

      {averageThickness && <p>Середня товщина плівки: {averageThickness.toFixed(2)} нм</p>}
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
  selectedMaterial: PropTypes.string.isRequired,
  setSelectedMaterial: PropTypes.func.isRequired,
};

export default Chart;
