import { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Stage, Layer, Line as KonvaLine } from "react-konva";
import { useAppContext } from "../AppContext";
import "../styles/buttons.css"; // Подключение файла стилей для кнопок
import "../styles/BandGapCalculation.css";

Chart.register(...registerables);

function BandGapCalculation() {
  const { selectedPoints } = useAppContext();
  const [reflection, setReflection] = useState(0.1);
  const [graphData, setGraphData] = useState(null);
  const [linePoints, setLinePoints] = useState([]); // Точки линии
  const chartContainerRef = useRef(null); // Ссылка на контейнер графика
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // Размеры холста

  // Расчёт данных для графика
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

  // Добавление точки на клик
  const handleCanvasClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (linePoints.length < 4) {
      setLinePoints([...linePoints, pointerPosition.x, pointerPosition.y]);
    } else {
      alert("Вы уже нарисовали линию. Для изменения обновите страницу.");
    }
  };

  // Подгон размеров холста под размеры графика
  useEffect(() => {
    if (chartContainerRef.current) {
      const { offsetWidth, offsetHeight } = chartContainerRef.current;
      setCanvasSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [graphData]);

  return (
    <div className="bandgap-container">
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
            className="select-menu-mat"
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
          <p>Точки не выбрано.</p>
        )}
        <button onClick={calculateBandGapData} className="select-menu">
          Розрахувати та побудувати графік
        </button>
        <div
          ref={chartContainerRef}
          style={{
            marginTop: "30px",
            position: "relative",
            width: "800px",
            height: "500px",
          }}
        >
          {graphData && (
            <>
              <Line
                data={graphData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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
                }}
              />
              <Stage
                width={canvasSize.width}
                height={canvasSize.height}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                }}
                onClick={handleCanvasClick}
              >
                <Layer>
                  {linePoints.length === 4 && (
                    <KonvaLine
                      points={linePoints}
                      stroke="red"
                      strokeWidth={2}
                      lineCap="round"
                    />
                  )}
                </Layer>
              </Stage>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// Генерация диапазона длин волн
const generateWavelengthRange = (min, max) => {
  const step = (max - min) / 100;
  return Array.from({ length: 100 }, (_, i) => min + i * step);
};

// Интерполяция пропускания
const interpolateTransmittance = (point1, point2, wavelength) => {
  const slope = (point2.coefficient - point1.coefficient) / (point2.wavelength - point1.wavelength);
  return (point1.coefficient + slope * (wavelength - point1.wavelength)) / 100;
};

// Расчёт α = ln((1 - R) / T)
const calculateAlpha = (reflection, transmittance) => {
  if (transmittance <= 0) {
    console.error("T должно быть больше 0 для расчета ln.");
    return null;
  }
  return Math.log((1 - reflection) / transmittance);
};

// Расчёт hv = 1240 / λ
const calculateHv = (wavelength) => 1240 / wavelength;

// Расчёт (hv * α)^2
const calculateSquareHvAlpha = (hv, alpha) => Math.pow(hv * alpha, 2);

export default BandGapCalculation;
