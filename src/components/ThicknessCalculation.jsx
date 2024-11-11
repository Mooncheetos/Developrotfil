// src/components/ThicknessCalculation.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import findExtrema from '../utils/findExtrema';
import calculateThickness from '../utils/calculateThickness';
import SpectrumSelector from './SpectrumSelector';

function ThicknessCalculation({ spectra }) {
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);
  const [thickness, setThickness] = useState(null);

  const handleSpectrumSelect = (spectrum) => {
    setSelectedSpectrum(spectrum);

    // Находим экстремумы и вычисляем толщину
    const extrema = findExtrema(spectrum.data);
    const calculatedThickness = calculateThickness(extrema);
    setThickness(calculatedThickness);
  };

  return (
    <div className="thickness-calculation">
      <h2>Расчеты толщины образца</h2>
      <SpectrumSelector spectra={spectra} onSelectSpectrum={handleSpectrumSelect} />
      
      {selectedSpectrum && (
        <>
          <h3>Расчёт толщины слоя</h3>
          <p>Толщина слоя: {thickness ? `${thickness.toFixed(2)} нм` : "Недостаточно данных для расчёта"}</p>
        </>
      )}
    </div>
  );
}

ThicknessCalculation.propTypes = {
  spectra: PropTypes.array.isRequired,
};

export default ThicknessCalculation;
