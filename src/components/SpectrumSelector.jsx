import PropTypes from 'prop-types';

function SpectrumSelector({ spectra, onSpectrumChange }) {
  return (
    <div className="spectrum-selector">
      <label htmlFor="spectrum-select">Выберите спектр:</label>
      <select id="spectrum-select" onChange={(e) => onSpectrumChange(e.target.value)}>
        <option value="">Выберите спектр</option>
        {spectra.map((spectrum) => (
          <option key={spectrum.name} value={spectrum.name}>
            {spectrum.name}
          </option>
        ))}
      </select>
    </div>
  );
}

SpectrumSelector.propTypes = {
  spectra: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        wavelength: PropTypes.number,
        coefficient: PropTypes.number,
      })
    ).isRequired,
  })).isRequired,
  onSpectrumChange: PropTypes.func.isRequired,
};

export default SpectrumSelector;
