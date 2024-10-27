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

  const handleReset = () => {
    setFileName("Файл не вибрано");
    onFileData(null); // Передаем пустое значение для сброса графика
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-upload" className="file-label">{fileName}</label>
      <input 
        id="file-upload" 
        type="file" 
        accept=".txt" 
        onChange={handleFileChange} 
        className="file-input" 
      />
      {fileName !== "Файл не вибрано" && (
        <button className="reset-button" onClick={handleReset}>
          Очистить график
        </button>
      )}
    </div>
  );
}

FileUpload.propTypes = {
  onFileData: PropTypes.func.isRequired,
};

export default FileUpload;
