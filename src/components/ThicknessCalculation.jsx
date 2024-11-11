// src/components/ThicknessCalculation.jsx
import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import findExtrema from '../utils/findExtrema';
import calculateThickness from '../utils/calculateThickness';
import SpectrumSelector from './SpectrumSelector';
import { AppContext } from '../AppContext';

function ThicknessCalculation({ spectra }) {
  const { setThickness, setSelectedSpectrum } = useContext(AppContext); // Сохраняем спектр и толщину в контексте
  const [localThickness, setLocalThickness] = useState(null);

  const handleSpectrumSelect = (spectrum) => {
    setSelectedSpectrum(spectrum); // Сохраняем выбранный спектр в контексте
    const extrema = findExtrema(spectrum.data);
    const calculatedThickness = calculateThickness(extrema);
    setLocalThickness(calculatedThickness);
    setThickness(calculatedThickness); // Сохраняем толщину в контексте
  };

  return (
    <div className="thickness-calculation">
      <h2>Расчеты толщины образца</h2>
      <SpectrumSelector spectra={spectra} onSelectSpectrum={handleSpectrumSelect} />

      {localThickness && (
        <>
          <h3>Расчёт толщины слоя</h3>
          <p>Толщина слоя: {localThickness.toFixed(2)} нм</p>
        </>
      )}
    </div>
  );
}

ThicknessCalculation.propTypes = {
  spectra: PropTypes.array.isRequired,
};

export default ThicknessCalculation;
