export default function parseFile(fileContent) {
  const lines = fileContent.split('\n');
  return lines.map((line) => {
    const [wavelength, coefficient] = line.split(/\s+/);
    return { wavelength: parseFloat(wavelength), coefficient: parseFloat(coefficient) };
  });
}