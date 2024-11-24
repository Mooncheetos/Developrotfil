import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  // Определение шагов
  const defineSteps = (stepSet) => {
    switch (stepSet) {
      case "initial":
        return [
          {
            target: '.upload-page-title',
            content: 'Тут ви можете завантажити файл з даними для аналізу.',
          },
          {
            target: '.file-label',
            content: 'Виберіть файл для завантаження, натиснувши цю кнопку.',
          },
        ];
      case "fileUploaded":
        return [
          {
            target: '.spectrum-selector',
            content: 'Натисніть тут, щоб вибрати спектр для аналізу.',
          },
        ];
      case "spectrumSelected":
        return [
          {
            target: '.select-menu-mat',
            content: 'Оберіть матеріал для розрахунку.',
          },
          {
            target: '.chart-container',
            content: 'Виберіть точки на графіку для аналізу.',
          },
          {
            target: '.input-style',
            content: 'Введіть точки вручну, якщо це необхідно.',
          },
          {
            target: '.button',
            content: 'Натисніть цю кнопку, щоб додати точку до таблиці для розрахунку.',
          },
          {
            target: '.button-rozr',
            content: 'Після додачи всіх точок, натисніть цю кнопку, щоб розрахувати товщину.',
          },
        ];
      default:
        return [];
    }
  };

  // Обновление шагов при изменении currentStepSet
  useEffect(() => {
    const newSteps = defineSteps(currentStepSet);
    setSteps(newSteps);
    setJoyrideKey((prevKey) => prevKey + 1); // Принудительное обновление Joyride
  }, [currentStepSet]);

  // Установка начальных шагов при загрузке страницы
  useEffect(() => {
    if (location.pathname === "/upload") {
      setCurrentStepSet("initial");
      const newSteps = defineSteps("initial"); // Принудительно задаем шаги для initial
      setSteps(newSteps);
      setJoyrideKey((prevKey) => prevKey + 1);
    }
  }, [location]);

  // Обработчик загрузки файла
  const handleFileData = (parsedData) => {
    setSpectra(parsedData);
    setSelectedData(null);
    setShowResetButton(false);
    setCurrentStepSet("fileUploaded"); // Устанавливаем шаги для выбора спектра
    const newSteps = defineSteps("fileUploaded"); // Принудительно задаем шаги для fileUploaded
    setSteps(newSteps);
    setJoyrideKey((prevKey) => prevKey + 1);
  };

  // Обработчик выбора спектра
  const handleSpectrumSelect = (spectrum) => {
    setSelectedData(spectrum.data);
    setShowResetButton(true);
    setCurrentStepSet("spectrumSelected"); // Устанавливаем шаги для работы с графиком
    const newSteps = defineSteps("spectrumSelected"); // Принудительно задаем шаги для spectrumSelected
    setSteps(newSteps);
    setJoyrideKey((prevKey) => prevKey + 1);
  };

  // Сброс данных
  const handleReset = () => {
    setSpectra([]);
    setSelectedData(null);
    setShowResetButton(false);
    setResetTrigger((prev) => !prev);
    setCurrentStepSet("initial");
    const newSteps = defineSteps("initial"); // Принудительно задаем шаги для initial
    setSteps(newSteps);
    setJoyrideKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="app-container">
      <ReactJoyride
        key={joyrideKey}
        steps={steps}
        continuous={true}
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
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#4CAF50',
          },
          buttonBack: {
            color: '#999',
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