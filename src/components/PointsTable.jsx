import PropTypes from 'prop-types';

const PointsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Дані не завантажено або таблиця порожня.</p>;
  }

  return (
    <div className="points-table">
      <h2>Таблиця точок</h2>
      <table>
        <thead>
          <tr>
            <th>Довжина хвилі (нм)</th>
            <th>Коефіцієнт (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point, index) => (
            <tr key={index}>
              <td>{point.wavelength}</td>
              <td>{point.coefficient}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PointsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      wavelength: PropTypes.number.isRequired,
      coefficient: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PointsTable;
