export default function parseFile(fileContent) {
  const lines = fileContent.split('\n');
  const spectra = [];
  let currentSpectrum = null;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    console.log("Processing line:", trimmedLine); // Проверка каждой строки

    if (/^Спектр\s*\d+/i.test(trimmedLine)) {
      currentSpectrum = { name: trimmedLine, data: [] };
      spectra.push(currentSpectrum);
    } else if (currentSpectrum && /^[0-9.,\s]+$/.test(trimmedLine)) {
      const [wavelength, coefficient] = trimmedLine.split(/\s+/).map(value => parseFloat(value.replace(',', '.')));
      if (!isNaN(wavelength) && !isNaN(coefficient) && wavelength >= 400 && wavelength <= 1100) {
        currentSpectrum.data.push({ wavelength, coefficient });
      }
    }
  });

  console.log("Parsed spectra:", spectra);  // Проверка финального результата
  return spectra.slice(0, 9);
}
