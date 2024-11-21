import PropTypes from 'prop-types';
import "../styles/Buttons.css";

function SpectrumSelector({ spectra, onSelectSpectrum }) {
  const handleSelectChange = (event) => {
    const selectedSpectrum = spectra.find(
      (spectrum) => spectrum.name === event.target.value
    );
    onSelectSpectrum(selectedSpectrum);
  };

  return (
    <select className="select-menu" onChange={handleSelectChange} defaultValue="">
      <option value="">Виберіть спектр</option>
      {(spectra || []).map((spectrum, index) => (
        <option key={index} value={spectrum.name} className="spectrum-option">
          {spectrum.name}
        </option>
      ))}
    </select>
  );
}


SpectrumSelector.propTypes = {
  spectra: PropTypes.array.isRequired,
  onSelectSpectrum: PropTypes.func.isRequired,
};

export default SpectrumSelector;
