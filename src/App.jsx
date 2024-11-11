import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import SpectrumSelector from './components/SpectrumSelector';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import Header from './components/Header';
import ThicknessCalculation from './components/ThicknessCalculation'; // Добавляем компонент для третьей страницы
import BandGapCalculation from './components/BandGapCalculation';
import { AppProvider } from './AppContext';
import '../src/styles/SpectrumSelector.css';
import './App.css';

function App() {
  const [spectra, setSpectra] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleFileData = (parsedData) => {
    setSpectra(parsedData);
    setSelectedData(null);
    setShowResetButton(false);
  };

  const handleSpectrumSelect = (spectrum) => {
    setSelectedData(spectrum.data);
    setShowResetButton(true);
  };

  const handleReset = () => {
    setSpectra([]);
    setSelectedData(null);
    setShowResetButton(false);
    setResetTrigger(prev => !prev); // Для сброса файла на главной
  };

  return (
    <AppProvider>
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
                <FileUpload onFileData={handleFileData} resetTrigger={resetTrigger} />
                {spectra.length > 0 && (
                  <>
                    <SpectrumSelector spectra={spectra} onSelectSpectrum={handleSpectrumSelect} />
                    {showResetButton && (
                      <button className="reset-button" onClick={handleReset}>
                        Очистити графік
                      </button>
                    )}
                  </>
                )}
                {selectedData && <Chart data={selectedData} />}
              </div>
            }
          />
          <Route
            path="/thickness"
            element={
              <div className="thickness-page">
                <h1>Расчеты толщины образца</h1>
                <FileUpload onFileData={handleFileData} resetTrigger={resetTrigger} />
                {spectra.length > 0 && <ThicknessCalculation spectra={spectra} />}
              </div>
            }
            />
            <Route
              path="/bandgap"
              element={<BandGapCalculation spectra={spectra} />} // Добавлена четвертая страница
            />
        </Routes>
      </div>
      </Router>
      </AppProvider>
  );
}

export default App;
