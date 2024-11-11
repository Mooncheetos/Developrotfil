// src/AppContext.jsx
import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [thickness, setThickness] = useState(null);
  const [selectedSpectrum, setSelectedSpectrum] = useState(null);
  const [refractiveIndex, setRefractiveIndex] = useState(null); // Новый коэффициент преломления

  return (
    <AppContext.Provider value={{ thickness, setThickness, selectedSpectrum, setSelectedSpectrum, refractiveIndex, setRefractiveIndex }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
