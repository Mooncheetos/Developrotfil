import calculateRefractiveIndex from './RefractiveIndex';

// Функция для расчета толщины слоя
export default function calculateThickness(extrema) {
  if (extrema.length < 2) {
    return "Недостаточно экстремумов для расчета толщины";
  }

  const M = 1; // Порядок интерференции
  const lambda1 = extrema[0].wavelength;
  const lambda2 = extrema[1].wavelength;
  const n1 = calculateRefractiveIndex(lambda1);
  const n2 = calculateRefractiveIndex(lambda2);

  // Формула для расчета толщины
  const thickness = (M * lambda1 * lambda2) / (2 * (n1 * lambda2 - n2 * lambda1));
  return thickness;
}