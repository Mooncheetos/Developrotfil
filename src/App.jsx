import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import SpectrumSelector from './components/SpectrumSelector';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import Header from './components/Header';
import ThicknessCalculation from './components/ThicknessCalculation';
import BandGapCalculation from './components/BandGapCalculation';
import RefractiveIndexCalculation from './components/RefractiveIndexCalculation';
import { AppProvider } from './AppContext';
import './App.css';

function App() {
  const [spectra, setSpectra] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('CdTe');

  const handleFileData = (parsedData) => {
    setSpectra(parsedData);
    setSelectedData(null);
  };

  const handleSpectrumSelect = (spectrum) => {
    setSelectedData(spectrum.data);
  };

  const handleReset = () => {
    setSpectra([]);
    setSelectedData(null);
    setResetTrigger((prev) => !prev);
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
                      {selectedData && (
                        <Chart
                          data={selectedData}
                          selectedMaterial={selectedMaterial}
                          setSelectedMaterial={setSelectedMaterial}
                        />
                      )}
                    </>
                  )}
                </div>
              }
            />
            <Route path="/thickness" element={<ThicknessCalculation />} />
            <Route path="/bandgap" element={<BandGapCalculation />} />
            <Route path="/refractive-index" element={<RefractiveIndexCalculation />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
