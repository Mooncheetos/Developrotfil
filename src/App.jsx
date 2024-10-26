import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import Header from './components/Header';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  const handleFileData = (parsedData) => {
    setData(parsedData);
  };

  return (
    <Router>
      <div className="app-container">
        <Header /> {/* Добавлен Header */}
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route
            path="/upload"
            element={
              <div className="upload-page">
                <h1>Оптичні властивості тонких плівок</h1>
                <FileUpload onFileData={handleFileData} />
                {data && <Chart data={data} />}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
