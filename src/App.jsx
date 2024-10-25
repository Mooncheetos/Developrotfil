import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';

function App() {
  const [data, setData] = useState(null);

  const handleFileData = (parsedData) => {
    setData(parsedData);
  };

  return (
    <Router>
      <Routes>
        {/* Первая страница с приветствием */}
        <Route path="/" element={<WelcomePage />} />

        {/* Страница загрузки файла */}
        <Route
          path="/upload"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold mb-4">Оптичні властивості тонких плівок</h1>
              <FileUpload onFileData={handleFileData} />
              {data && <Chart data={data} />}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
