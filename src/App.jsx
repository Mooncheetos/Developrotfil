import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import Header from './components/Header';
import './App.css';
import './styles/FileUpload.css';

function App() {
  const [data, setData] = useState(null);
  const [showSpectrumButton, setShowSpectrumButton] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleFileData = (parsedData) => {
    setData(parsedData);
    setShowSpectrumButton(true); // Показываем кнопку "Выбрать спектр"
    setShowChart(false); // Скрываем график, пока не нажата кнопка "Выбрать спектр"
  };

  const handleShowChart = () => {
    setShowChart(true); // Показываем график только после нажатия кнопки
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route
            path="/upload"
            element={
              <div className="upload-page">
                <h1>Оптичні властивості тонких плівок</h1>
                <FileUpload onFileData={handleFileData} />
                {showSpectrumButton && (
                  <button className="spectrum-button" onClick={handleShowChart}>
                    Выбрать спектр
                  </button>
                )}
                {showChart && data && <Chart data={data} />}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
