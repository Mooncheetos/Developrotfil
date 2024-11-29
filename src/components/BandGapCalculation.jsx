import { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function BandGapCalculation() {
  const { selectedPoints, reflection, setReflection } = useAppContext();

  // Проверка валидности входных данных
  const isValidInput = useMemo(() => {
    return (
      selectedPoints.length === 2 &&
      reflection &&
      reflection > 0 &&
      reflection < 1
    );
  }, [selectedPoints, reflection]);

  // Расчеты для графика
  const calculatedData = useMemo(() => {
    if (!isValidInput) return [];

    const [point1, point2] = selectedPoints;
    const wavelengthRange = [];
    const step = (point2.wavelength - point1.wavelength) / 100; // Разбиение на 100 точек

    for (let λ = point1.wavelength; λ <= point2.wavelength; λ += step) {
      const T = point1.coefficient / 100; // Пропускание переводим в доли
      const alpha = Math.log((1 - reflection) / T);
      const hv = 1240 / λ; // Энергия фотона
      const hvAlphaSquared = Math.pow(hv * alpha, 2);

      wavelengthRange.push({
        wavelength: λ,
        hv,
        hvAlphaSquared,
      });
    }

    return wavelengthRange;
  }, [isValidInput, selectedPoints, reflection]);

  // Данные для построения графика
  const chartData = useMemo(() => {
    if (!calculatedData.length) return null;

    return {
      labels: calculatedData.map((d) => d.hv.toFixed(2)), // Энергия фотона
      datasets: [
        {
          label: '(hv * α)^2',
          data: calculatedData.map((d) => d.hvAlphaSquared),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }, [calculatedData]);

  // Настройки графика
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'hv (eV)',
        },
      },
      y: {
        title: {
          display: true,
          text: '(hv * α)^2',
        },
      },
    },
  };

  return (
    <div className="bandgap-container">
      <h1>Розрахунок ширини забороненої зони</h1>
      <div className="reflection-input">
        <label htmlFor="reflection">
          Середнє значення віддзеркалення (R):
        </label>
        <input
          type="number"
          id="reflection"
          value={reflection}
          step="0.01"
          min="0"
          max="1"
          onChange={(e) => setReflection(Number(e.target.value))} // Обновляем значение R
        />
      </div>

      <div className="selected-points">
        <h2>Вибрані точки:</h2>
        {selectedPoints.length > 0 ? (
          <ul>
            {selectedPoints.map((point, idx) => (
              <li key={idx}>
                Довжина хвилі: {point.wavelength} нм, Пропускання: {point.coefficient}%
              </li>
            ))}
          </ul>
        ) : (
          <p>Точки для аналізу ще не вибрано.</p>
        )}
      </div>

      {calculatedData.length > 0 && (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {!isValidInput && <p>Для розрахунків потрібно вибрати 2 точки та вказати значення R.</p>}
    </div>
  );
}

export default BandGapCalculation;
