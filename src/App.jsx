import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import { useState } from 'react'
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
