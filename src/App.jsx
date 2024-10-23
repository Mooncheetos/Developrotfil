import { useState } from 'react';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';

function App() {
  const [spectraData, setSpectraData] = useState([]);

  const handleFileData = (parsedData) => {
    setSpectraData(parsedData);
  };

  return (
    <div>
      <h1>Оптичні властивості тонкоплівкових шарів</h1>
      <FileUpload onFileData={handleFileData} />
      {spectraData.length > 0 && <Chart spectra={spectraData} />}
    </div>
  );
}

export default App;
