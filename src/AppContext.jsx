// src/AppContext.jsx
import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [thickness, setThickness] = useState(null);
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);
  const [refractiveIndex, setRefractiveIndex] = useState(null); // Новый коэффициент преломления
  const [selectedPoints, setSelectedPoints] = useState([]); // Выбранные точки
  const [reflection, setReflection] = useState(""); // Значение R

  return (
    <AppContext.Provider value={{ thickness, setThickness, selectedSpectrum, setSelectedSpectrum, refractiveIndex, setRefractiveIndex, selectedPoints,
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