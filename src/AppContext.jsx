// src/AppContext.jsx
import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [thickness, setThickness] = useState(null);
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);
  const [refractiveIndex, setRefractiveIndex] = useState(null); // Новый коэффициент преломления  
  const [reflection, setReflection] = useState(""); // Значение R
  const [selectedPoints, setSelectedPoints] = useState([]); // Универсальное состояние для точек
  const [sampleThickness, setSampleThickness] = useState(null); // Толщина образца

  return (
    <AppContext.Provider value={{ sampleThickness, setSampleThickness,thickness, setThickness, selectedSpectrum, setSelectedSpectrum, refractiveIndex, setRefractiveIndex, selectedPoints,
        setSelectedPoints,
        reflection,
        setReflection, }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => useContext(AppContext);