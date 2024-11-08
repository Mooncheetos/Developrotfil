// export default function convertFile(fileContent) {
//   if (typeof fileContent !== 'string') {
//     console.error("Invalid file content type:", typeof fileContent);
//     return '';
//   }

//   const lines = fileContent.split('\n');
//   const convertedLines = [];
//   let currentSpectrum = null;

//   lines.forEach((line) => {
//     const trimmedLine = line.trim();
//     console.log("Processing line:", trimmedLine);

//     if (/^Спектр\s*\d+/i.test(trimmedLine)) {
//       currentSpectrum = trimmedLine;
//       convertedLines.push(trimmedLine);
//     } else if (currentSpectrum && /^[0-9.,\s]+$/.test(trimmedLine)) {
//       const [wavelength, coefficient] = trimmedLine.split(/[,\s]+/).map(value => parseFloat(value.replace(',', '.')));
//       if (!isNaN(wavelength) && !isNaN(coefficient) && wavelength >= 400 && wavelength <= 1100) {
//         convertedLines.push(`${wavelength},${coefficient}`);
//       } else {
//         console.log("Skipped line:", line);
//       }
//     }
//   });

//   const convertedContent = convertedLines.join('\n');
//   console.log("Final Converted Content:", convertedContent);
//   return convertedContent;
// }
