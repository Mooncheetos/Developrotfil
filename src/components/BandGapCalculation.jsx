// src/components/BandGapCalculation.jsx
import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../AppContext';

function BandGapCalculation({ spectra }) {
  const { thickness, selectedSpectrum } = useContext(AppContext); // Используем сохраненные спектр и толщину
  const [bandGapWidth, setBandGapWidth] = useState(null);

  const PLANCK_CONSTANT = 4.135667696e-15; // Планка (h) в эВ·с
  const SPEED_OF_LIGHT = 3e8; // Скорость света в м/с
  const REFLECTION_COEFFICIENT = 0.2; // Условное значение R, если нет точного значения

  useEffect(() => {
    if (selectedSpectrum) calculateBandGapWidth(selectedSpectrum.data); // Вызываем расчет при загрузке страницы
  }, [selectedSpectrum, thickness]);

  const calculateBandGapWidth = (spectrumData) => {
    if (!thickness || !spectrumData) return;

    const bandGapData = spectrumData
      .filter((data) => data.wavelength >= 750 && data.wavelength <= 850) // Ограничение по длинам волн
      .map((data) => {
        const wavelength = data.wavelength * 1e-9; // Перевод длины волны в метры
        const transmissionCoefficient = data.coefficient / 100; // Пропускание T
        const alpha = -Math.log(transmissionCoefficient / (1 - REFLECTION_COEFFICIENT)) / thickness; // Расчет α

        // Энергия (hν) и значение (α·hν)^2
        const energy = (PLANCK_CONSTANT * SPEED_OF_LIGHT) / wavelength; // hν, энергия в эВ
        const alphaEnergySquared = Math.pow(alpha * energy, 2);

        return { energy, alphaEnergySquared };
      });

    // Найти линейную область для экстраполяции
    const linearData = bandGapData.slice(0, 10); // Берем первые 10 точек для упрощения

    // Выполним линейную экстраполяцию
    const n = linearData.length;
    const sumX = linearData.reduce((acc, point) => acc + point.energy, 0);
    const sumY = linearData.reduce((acc, point) => acc + point.alphaEnergySquared, 0);
    const sumXY = linearData.reduce((acc, point) => acc + point.energy * point.alphaEnergySquared, 0);
    const sumX2 = linearData.reduce((acc, point) => acc + point.energy * point.energy, 0);

    // Уравнение линейной регрессии y = mx + b
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Пересечение с осью энергии (y=0): x = -b / m
    const bandGap = -intercept / slope;
    setBandGapWidth(bandGap);
  };

  return (
    <div className="bandgap-calculation">
      <h2>Расчеты ширины запрещенной зоны</h2>
      <p>Толщина слоя: {thickness ? `${thickness.toFixed(2)} нм` : "Необходимо рассчитать толщину на предыдущей странице"}</p>

      {bandGapWidth !== null && (
        <>
          <h3>Ширина запрещенной зоны</h3>
          <p>Значение: {bandGapWidth.toFixed(2)} эВ</p>
        </>
      )}
    </div>
  );
}

BandGapCalculation.propTypes = {
  spectra: PropTypes.array.isRequired,
};

export default BandGapCalculation;
