import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useAppContext } from "../AppContext";

Chart.register(...registerables);

function BandGapCalculation() {
  const { selectedPoints } = useAppContext(); // Получаем выбранные точки
  const [reflection, setReflection] = useState(0.1); // Значение R
  const [graphData, setGraphData] = useState(null);
  const [customLine, setCustomLine] = useState(null); // Хранение пользовательской линии

  // Расчет данных для графика
  const calculateBandGapData = () => {
    if (selectedPoints.length < 2 || reflection <= 0 || reflection >= 1) {
      alert("Выберите минимум 2 точки и задайте R в диапазоне от 0 до 1.");
      return;
    }

    const [point1, point2] = selectedPoints;
    const wavelengthRange = generateWavelengthRange(
      point1.wavelength,
      point2.wavelength
    );

    const results = wavelengthRange.map((wavelength) => {
      const transmittance = interpolateTransmittance(point1, point2, wavelength);
      const alpha = calculateAlpha(reflection, transmittance);
      const hv = calculateHv(wavelength);
      const squareHvAlpha = calculateSquareHvAlpha(hv, alpha);

      return { hv, squareHvAlpha };
    });

    const sortedResults = results.sort((a, b) => a.hv - b.hv);

    const chartData = {
      labels: sortedResults.map((res) => res.hv.toFixed(2)),
      datasets: [
        {
          label: "(hv*α)^2 от hv",
          data: sortedResults.map((res) => res.squareHvAlpha),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.4)",
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };

    setGraphData(chartData);
  };

  // Функция для добавления пользовательской линии
  const handleAddLine = () => {
    if (selectedPoints.length < 2) {
      alert("Выберите минимум 2 точки, чтобы провести линию.");
      return;
    }

    const [p1, p2] = selectedPoints;
    const slope = (p2.coefficient - p1.coefficient) / (p2.wavelength - p1.wavelength);
    const intercept = p1.coefficient - slope * p1.wavelength;

    const xStart = Math.min(p1.wavelength, p2.wavelength);
    const xEnd = Math.max(p1.wavelength, p2.wavelength);

    setCustomLine({
      slope,
      intercept,
      xStart,
      xEnd,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Розрахунок ширини забороненої зони</h1>
      <div>
        <label>
          Введіть середнє значення віддзеркалення (R):{" "}
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={reflection}
            onChange={(e) => setReflection(parseFloat(e.target.value))}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
        <h3>Обрані точки:</h3>
        {selectedPoints.length > 0 ? (
          selectedPoints.map((point, index) => (
            <p key={index}>
              Довжина хвилі: <strong>{point.wavelength} нм</strong>, Пропускання:{" "}
              <strong>{point.coefficient}%</strong>
            </p>
          ))
        ) : (
          <p>Точки не вибрано.</p>
        )}
        <button onClick={calculateBandGapData} style={buttonStyle}>
          Розрахувати та побудувати графік
        </button>
        <button onClick={handleAddLine} style={{ ...buttonStyle, marginLeft: "10px" }}>
          Додати лінію
        </button>
        {graphData && (
          <div style={{ marginTop: "30px" }}>
            <Line
              data={graphData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "hv (еВ)",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "(hv*α)^2",
                    },
                  },
                },
                plugins: {
                  annotation: {
                    annotations: customLine
                      ? [
                          {
                            type: "line",
                            scaleID: "x",
                            value: customLine.xStart,
                            endValue: customLine.xEnd,
                            borderColor: "red",
                            borderWidth: 2,
                          },
                        ]
                      : [],
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Дополнительные стили для кнопки
const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

// Генерация диапазона длин волн
const generateWavelengthRange = (min, max) => {
  const step = (max - min) / 100; // Генерация 100 точек для точности
  return Array.from({ length: 100 }, (_, i) => min + i * step);
};

// Интерполяция пропускания
const interpolateTransmittance = (point1, point2, wavelength) => {
  const slope = (point2.coefficient - point1.coefficient) / (point2.wavelength - point1.wavelength);
  return (point1.coefficient + slope * (wavelength - point1.wavelength)) / 100;
};

// Расчет α = ln((1 - R) / T)
const calculateAlpha = (reflection, transmittance) => {
  if (transmittance <= 0) {
    console.error("T должно быть больше 0 для расчета ln.");
    return null;
  }
  return Math.log((1 - reflection) / transmittance);
};

// Расчет hv = 1240 / λ
const calculateHv = (wavelength) => 1240 / wavelength;

// Расчет (hv * α)^2
const calculateSquareHvAlpha = (hv, alpha) => Math.pow(hv * alpha, 2);

export default BandGapCalculation;
