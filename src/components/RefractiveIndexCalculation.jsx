// src/components/RefractiveIndexCalculation.jsx
import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../AppContext';

function RefractiveIndexCalculation({ spectra }) {
  const { thickness, setRefractiveIndex } = useContext(AppContext);
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);
  const [refractiveIndex, setLocalRefractiveIndex] = useState(null);

  const calculateRefractiveIndex = (spectrumData) => {
    if (!thickness || !spectrumData) return;

    // Пример расчета коэффициента преломления на основе длины волны
    const refractiveIndexData = spectrumData.map((data) => {
      // Здесь используем формулу или подход для расчета коэффициента преломления
      const wavelength = data.wavelength;
      const index = 1 + (wavelength / thickness); // Пример формулы, замените на нужную

      return { wavelength, index };
    });

    // Пример: берем среднее значение коэффициента преломления
    const avgRefractiveIndex = refractiveIndexData.reduce((acc, item) => acc + item.index, 0) / refractiveIndexData.length;
    setLocalRefractiveIndex(avgRefractiveIndex);
    setRefractiveIndex(avgRefractiveIndex);
  };

  const handleSpectrumSelect = (spectrum) => {
    setSelectedSpectrum(spectrum);
    calculateRefractiveIndex(spectrum.data);
  };

  return (
    <div className="refractive-index-calculation">
      <h2>Расчеты коэффициента преломления</h2>
      <p>Толщина слоя: {thickness ? `${thickness.toFixed(2)} нм` : "Необходимо рассчитать толщину на предыдущей странице"}</p>

      <select onChange={(e) => handleSpectrumSelect(spectra.find(s => s.name === e.target.value))}>
        <option value="">Выберите спектр</option>
        {spectra.map((spectrum, index) => (
          <option key={index} value={spectrum.name}>{spectrum.name}</option>
        ))}
      </select>

      {refractiveIndex !== null && (
        <>
          <h3>Коэффициент преломления</h3>
          <p>Среднее значение: {refractiveIndex.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

RefractiveIndexCalculation.propTypes = {
  spectra: PropTypes.array.isRequired,
};

export default RefractiveIndexCalculation;
