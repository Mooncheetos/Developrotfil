import { useState } from "react";
import InteractiveChart from "./InteractiveChart";
import PointsTable from "./PointsTable";
import ThicknessCalculation from "./ThicknessCalculation";
import PropTypes from "prop-types";


export default function ThicknessPage({ data, nFormula }) {
  const [points, setPoints] = useState([]);

  const handlePointsSelected = (newPoints) => setPoints(newPoints);

  const handleUpdatePoint = (updatedPoints) => setPoints(updatedPoints);

  const handleDeletePoint = (index) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);
  };

  ThicknessPage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
  nFormula: PropTypes.func.isRequired,
};

  return (
    <div>
      <h1>Розрахунок товщини зразка</h1>
      <InteractiveChart data={data} onPointsSelected={handlePointsSelected} />
      {points.length > 0 && (
        <PointsTable
          points={points}
          onUpdatePoint={handleUpdatePoint}
          onDeletePoint={handleDeletePoint}
        />
      )}
      <ThicknessCalculation points={points} nFormula={nFormula} />
    </div>
  );
}
