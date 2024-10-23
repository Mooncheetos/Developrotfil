function parseFile(text) {
  const lines = text.split('\n');
  const spectra = [];
  let currentSpectrum = null;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.match(/^Спектр\s*\d+/i)) {
      currentSpectrum = { name: trimmedLine, data: [] };
      spectra.push(currentSpectrum);
    } else if (!isNaN(trimmedLine.split(',')[0])) {
      const [wavelength, coefficient] = trimmedLine.split(',').map(Number);
      if (wavelength >= 400 && wavelength <= 1100) {
        if (currentSpectrum) {
          currentSpectrum.data.push({ wavelength, coefficient });
        }
      }
    }
  });

  return spectra.slice(0, 10); // Возвращаем максимум 10 спектров
}

export default parseFile;