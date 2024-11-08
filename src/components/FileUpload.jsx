import PropTypes from 'prop-types';
import parseFile from '../utils/parseFile';
import { useState } from 'react';
import '../styles/FileUpload.css';

function FileUpload({ onFileData }) {
  const [fileName, setFileName] = useState("Файл не выбран");
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        let text = new TextDecoder("utf-8").decode(buffer);

        // Проверка кириллицы, если не распознана, попробуем Windows-1251
        if (!/[А-Яа-яЁё]/.test(text)) {
          text = new TextDecoder("windows-1251").decode(buffer);
        }

        console.log("Decoded File Content:", text);

        const parsedData = parseFile(text);
        console.log("Parsed data:", parsedData); // Лог перед передачей данных
        onFileData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleReset = () => {
    setFileName("Файл не выбран");
    onFileData(null);
    setInputKey(Date.now());
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-upload" className="file-label">{fileName}</label>
      <input 
        key={inputKey}
        id="file-upload" 
        type="file" 
        accept=".txt" 
        onChange={handleFileChange} 
        className="file-input" 
      />
      {fileName !== "Файл не выбран" && (
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
