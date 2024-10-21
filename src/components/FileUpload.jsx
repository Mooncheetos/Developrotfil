import React from 'react';
import Papa from 'papaparse';
import parseFile from '../utils/parseFile';

function FileUpload({ onFileData }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedData = parseFile(text);
        onFileData(parsedData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
