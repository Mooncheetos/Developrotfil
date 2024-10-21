import React, { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import Chart from './components/Chart';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  const handleFileData = (parsedData) => {
    setData(parsedData);
  };

  return (
    <div className="App">
      <h1>Оптичні властивості тонких плівок</h1>
      <FileUpload onFileData={handleFileData} />
      {data && <Chart data={data} />}
    </div>
  );
}

export default App;