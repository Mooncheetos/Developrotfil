// Функция для нахождения экстремумов в данных спектра
export default function findExtrema(data) {
  const extrema = [];

  for (let i = 1; i < data.length - 1; i++) {
    const prev = data[i - 1].coefficient;
    const curr = data[i].coefficient;
    const next = data[i + 1].coefficient;

    if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
      extrema.push(data[i]);
    }
  }

  return extrema;
}