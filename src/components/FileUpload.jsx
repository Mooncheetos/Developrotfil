import PropTypes from 'prop-types';
import parseFile from '../utils/parseFile';
import { useState } from 'react';
import '../styles/FileUpload.css';

function FileUpload({ onFileData }) {
  const [fileName, setFileName] = useState("Файл не вибрано");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
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
    <div className="file-upload-container">
      <label className="file-name">{fileName}</label>
      <input type="file" accept=".txt" onChange={handleFileChange} className="file-input" />
    </div>
  );
}

FileUpload.propTypes = {
  onFileData: PropTypes.func.isRequired,
};

export default FileUpload;
