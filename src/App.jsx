import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import WelcomePage from './components/WelcomePage';
import SpectrumSelector from './components/SpectrumSelector';
import FileUpload from './components/FileUpload';
import Chart from './components/Chart';
import Header from './components/Header';
import ThicknessCalculation from './components/ThicknessCalculation';
import BandGapCalculation from './components/BandGapCalculation';
import RefractiveIndexCalculation from './components/RefractiveIndexCalculation';
import ReactJoyride from 'react-joyride';
import { AppProvider } from './AppContext';
import './App.css';

function AppContent() {
  const [spectra, setSpectra] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('CdTe');
  const location = useLocation();
  const [currentStepSet, setCurrentStepSet] = useState("initial");
  const [joyrideKey, setJoyrideKey] = useState(0);
  const [steps, setSteps] = useState([]);
  const stepHistory = useRef({
    initial: false,
    fileUploaded: false,
    spectrumSelected: false,
  });

  // Определение шагов
  const defineSteps = (stepSet) => {
    switch (stepSet) {
      case "initial":
        return [
          {
            target: '.upload-page-title',
            content: 'Тут ви можете завантажити файл з даними для аналізу.',
            disableBeacon: true,
          },
          {
            target: '.file-label',
            content: 'Виберіть файл для завантаження, натиснувши цю кнопку. Після завантаження оберіть бажаний спектр для аналізу.',
            disableBeacon: true,
          },
        ];
      case "fileUploaded":
        return [
          {
            target: '.spectrum-selector',
            content: 'Натисніть тут, щоб вибрати спектр для аналізу.',
            disableBeacon: true,
          },
        ];
      case "spectrumSelected":
        return [
          {
            target: '.select-menu-mat',
            content: 'Оберіть матеріал для розрахунку.',
            disableBeacon: true,
          },
          {
            target: '.chart-container',
            content: 'Виберіть точки на графіку для аналізу.',
            disableBeacon: true,
          },
          {
            target: '.input-style',
            content: 'Введіть точки вручну, якщо це необхідно.',
            disableBeacon: true,
          },
          {
            target: '.button',
            content: 'Натисніть цю кнопку, щоб додати точку до таблиці для розрахунку.',
            disableBeacon: true,
          },
          {
            target: '.button-rozr',
            content: 'Після додачи всіх точок, натисніть цю кнопку, щоб розрахувати товщину матеріалу.',
            disableBeacon: true,
          },
        ];
      
      default:
        return [];
    }
  };

  // Обновление шагов
  const updateSteps = (stepSet) => {
    if (!stepHistory.current[stepSet]) {
      const newSteps = defineSteps(stepSet);
      setSteps(newSteps);
      setJoyrideKey((prevKey) => prevKey + 1);
      stepHistory.current[stepSet] = true; // Запоминаем, что блок уже показан
    }
  };

  // Отслеживание перехода на страницу /upload
  useEffect(() => {
    if (location.pathname === "/upload" && !stepHistory.current.initial) {
      setCurrentStepSet("initial");
      updateSteps("initial");
    }
  }, [location]);

  // Показ шагов для файла
  const handleFileData = (parsedData) => {
    setSpectra(parsedData);
    setSelectedData(null);
    setShowResetButton(false);
    setCurrentStepSet("fileUploaded");
    updateSteps("fileUploaded");
  };

  // Показ шагов для спектра
  const handleSpectrumSelect = (spectrum) => {
    setSelectedData(spectrum.data);
    setShowResetButton(true);
    setCurrentStepSet("spectrumSelected");
    updateSteps("spectrumSelected");
  };

  // Сброс
  const handleReset = () => {
    setSpectra([]);
    setSelectedData(null);
    setShowResetButton(false);
    setResetTrigger((prev) => !prev);
  };

  return (
    <div className="app-container">
      <ReactJoyride
        key={joyrideKey}
        steps={steps}
        continuous={true}
        run={steps.length > 0}
        showProgress={true}
        showSkipButton={true}
        locale={{
          back: 'Назад',
          close: 'Закрити',
          last: 'Завершити',
          next: 'Далі',
          skip: 'Пропустити',
        }}
        styles={{
          options: {
            zIndex: 10000,
            backgroundColor: '#ffffff',
            textColor: '#6d28d9',
            arrowColor: '#ffffff',
          },
          tooltipContainer: {
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
          },
          tooltipTitle: {
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 'bold',
          },
          tooltipContent: {
            color: '#6d28d9',
            fontSize: '16px',
          },
          buttonNext: {
            backgroundColor: '#6d28d9',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '8px 12px',
          },
          buttonBack: {
            color: '#cccccc',
            fontSize: '14px',
          },
          buttonSkip: {
            color: '#ffffff',
            backgroundColor: '#e53e3e',
            borderRadius: '4px',
            padding: '8px 12px',
          },
        }}
      />
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/upload"
          element={
            <div className="upload-page">
              <h1 className="upload-page-title">Оптичні властивості тонких плівок</h1>
              <FileUpload onFileData={handleFileData} resetTrigger={resetTrigger} />
              {spectra.length > 0 && (
                <>
                  <SpectrumSelector spectra={spectra} onSelectSpectrum={handleSpectrumSelect} />
                  {showResetButton && (
                    <button className="reset-button" onClick={handleReset}>
                      Очистити графік
                    </button>
                  )}
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
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
