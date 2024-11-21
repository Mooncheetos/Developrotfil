import { useState } from 'react';
import PropTypes from 'prop-types';
import "../styles/ThicknessCalculation.css";


const refractiveIndices = {
  CdTe: (λ) => 2.5 + 0.01 * λ,
  CdS: (λ) => 2.2 + 0.01 * λ,
  ZnO: (λ) => 2.0 + 0.01 * λ,
};

function ThicknessCalculator({ data, selectedPoints, addPoint, removePoint, updatePoint, selectedMaterial }) {
  const [manualPoint, setManualPoint] = useState('');
  const [thickness, setThickness] = useState(null);

  const handleManualPointSubmit = () => {
    const wavelength = parseFloat(manualPoint);
    if (!isNaN(wavelength) && wavelength >= 400 && wavelength <= 1100) {
      const closest = findClosestPoint(wavelength);
      if (closest) {
        addPoint(closest);
        setManualPoint('');
      }
    }
  };

  const findClosestPoint = (wavelength) => {
    return data.reduce((closest, current) => {
      const closestDiff = Math.abs(closest.wavelength - wavelength);
      const currentDiff = Math.abs(current.wavelength - wavelength);
      return currentDiff < closestDiff ? current : closest;
    });
  };

  const calculateThickness = () => {
    if (selectedPoints.length < 2) {
      setThickness('Недостаточно точек');
      return;
    }

    const thicknessValues = [];
    for (let i = 0; i < selectedPoints.length - 1; i++) {
      const λ1 = selectedPoints[i].wavelength;
      const λ2 = selectedPoints[i + 1].wavelength;
      const n1 = refractiveIndices[selectedMaterial](λ1);
      const n2 = refractiveIndices[selectedMaterial](λ2);

      const thickness = (λ1 * λ2) / (2 * (n1 * λ2 - n2 * λ1));
      thicknessValues.push(thickness);
    }

    const averageThickness =
      thicknessValues.reduce((sum, value) => sum + value, 0) / thicknessValues.length;

    setThickness(averageThickness);
  };

  return (
    <div className="thickness-calculator">
      <div className="manual-point-input">
        <label htmlFor="manualPoint">Додати точку вручну:</label>
        <input
          type="number"
          id="manualPoint"
          value={manualPoint}
          onChange={(e) => setManualPoint(e.target.value)}
          placeholder="Введіть точку (400-1100 нм)"
        />
        <button onClick={handleManualPointSubmit}>Додати</button>
      </div>

      <div className="center-container">
        <table className="points-table">
        <thead>
          <tr>
            <th>Довжина хвилі (нм)</th>
            <th>Коефіцієнт (%)</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {selectedPoints.map((point, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={point.wavelength}
                  onChange={(e) =>
                    updatePoint(index, {
                      ...point,
                      wavelength: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={point.coefficient}
                  onChange={(e) =>
                    updatePoint(index, {
                      ...point,
                      coefficient: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </td>
              <td>
                <button onClick={() => removePoint(point.wavelength)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>      

      <button onClick={calculateThickness}>Розрахувати товщину</button>

      {thickness && (
        <div className="result">
          <h3>Результат:</h3>
          <p>Товщина: {thickness.toFixed(2)} нм</p>
        </div>
      )}
    </div>
  );
}

// Пропсы, которые должен принимать компонент
ThicknessCalculator.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedPoints: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
  addPoint: PropTypes.func.isRequired,
  removePoint: PropTypes.func.isRequired,
  updatePoint: PropTypes.func.isRequired,
  selectedMaterial: PropTypes.string.isRequired,
};

export default ThicknessCalculator;
