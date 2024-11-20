import { useState } from 'react';
import PropTypes from 'prop-types';
import ThicknessCalculator from './ThicknessCalculator';

function ThicknessCalculation({ spectra }) {
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);

  const handleSpectrumSelect = (spectrum) => {
    setSelectedSpectrum(spectrum);
  };

  return (
    <div>
      <h1>Розрахунок товщини</h1>
      {selectedSpectrum && (
        <ThicknessCalculator
          selectedSpectrum={selectedSpectrum}
          selectedMaterial="CdTe" // Пример
        />
      )}
    </div>
  );
}

ThicknessCalculation.propTypes = {
  spectra: PropTypes.array.isRequired,
};

export default ThicknessCalculation;
