import { useState } from 'react';
import PropTypes from 'prop-types';
import Chart from './Chart';
import SpectrumSelector from './SpectrumSelector';

function ChartPage({ spectra }) {
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);

  const handleSpectrumSelect = (spectrum) => {
    setSelectedSpectrum(spectrum);
  };

  return (
    <div className="chart-page">
      <h1>Оптичні властивості тонких плівок</h1>
      <SpectrumSelector spectra={spectra} onSelectSpectrum={handleSpectrumSelect} />
      {selectedSpectrum && (
        <>
          <h2>График по длине волны</h2>
          <Chart data={selectedSpectrum.data} />
        </>
      )}
    </div>
  );
}

ChartPage.propTypes = {
  spectra: PropTypes.array.isRequired,
};

export default ChartPage;
