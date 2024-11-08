import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import Header from './components/Header';
import './App.css';

function App() {
  const [spectra, setSpectra] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const handleFileData = (parsedData) => {
    setSpectra(parsedData);
    setSelectedData(null);
  };

  const handleSpectrumSelect = (e) => {
    const spectrumName = e.target.value;
    const spectrum = spectra.find(s => s.name === spectrumName);
    if (spectrum) {
      setSelectedData(spectrum.data);
    }
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
                {spectra.length > 0 && (
                  <select onChange={handleSpectrumSelect}>
                    <option value="">Выберите спектр</option>
                    {spectra.map((spectrum) => (
                      <option key={spectrum.name} value={spectrum.name}>
                        {spectrum.name}
                      </option>
                    ))}
                  </select>
                )}
                {selectedData && <Chart data={selectedData} />}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
