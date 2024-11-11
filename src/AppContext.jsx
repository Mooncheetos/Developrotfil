// src/AppContext.jsx
import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [thickness, setThickness] = useState(null); // Толщина слоя
  const [selectedSpectrum, setSelectedSpectrum] = useState(null); // Выбранный спектр

  return (
    <AppContext.Provider value={{ thickness, setThickness, selectedSpectrum, setSelectedSpectrum }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
