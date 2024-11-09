import PropTypes from 'prop-types';
import parseFile from '../utils/parseFile';
import { useState, useEffect, useRef } from 'react';
import '../styles/FileUpload.css';

function FileUpload({ onFileData, resetTrigger }) {
  const [fileName, setFileName] = useState("Файл не выбран");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (resetTrigger && fileInputRef.current) {
      fileInputRef.current.value = "";
      setFileName("Файл не выбран");
    }
  }, [resetTrigger]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target.result;
        let text = new TextDecoder("utf-8").decode(buffer);

        if (!/[А-Яа-яЁё]/.test(text)) {
          text = new TextDecoder("windows-1251").decode(buffer);
        }

        const parsedData = parseFile(text);
        onFileData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-upload" className="file-label">{fileName}</label>
      <input         
        id="file-upload" 
        type="file"
        ref={fileInputRef}
        accept=".txt" 
        onChange={handleFileChange} 
        className="file-input" 
      />      
    </div>
  );
}

FileUpload.propTypes = {
  onFileData: PropTypes.func.isRequired,
  resetTrigger: PropTypes.bool.isRequired,
};

export default FileUpload;
