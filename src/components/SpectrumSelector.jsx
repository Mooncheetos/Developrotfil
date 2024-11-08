import PropTypes from 'prop-types';

function SpectrumSelector({ spectra, onSelectSpectrum }) {
  const handleSelect = (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    onSelectSpectrum(spectra[selectedIndex]);
  };

  return (
    <div className="spectrum-selector">
      <h3>Выберите спектр:</h3>
      {spectra.map((spectrum, index) => (
        <div key={index}>
          <input
            type="radio"
            name="spectrum"
            value={index}
            onChange={handleSelect}
          />
          <label>{spectrum.name}</label>
        </div>
      ))}
    </div>
  );
}

SpectrumSelector.propTypes = {
  spectra: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          wavelength: PropTypes.number,
          coefficient: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  onSelectSpectrum: PropTypes.func.isRequired,
};

export default SpectrumSelector;
